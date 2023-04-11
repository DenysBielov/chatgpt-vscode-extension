import * as vscode from 'vscode';
import { OpenAiClient } from '../../openAIClient';
import * as fs from 'fs';
import * as path from 'path';
import Conversation from '../../types/conversation';
import { Message } from '../../types/message';
import ConversationRepository from '../conversations/repository';
import { randomUUID } from 'crypto';

export class ChatWebviewProvider implements vscode.WebviewViewProvider {
	public static readonly viewType = 'gpt-assistant.chatView';

	private _view?: vscode.WebviewView;
	private _openAiClient: OpenAiClient;
	private _currentConversation: Conversation;

	constructor(
		private readonly _context: vscode.ExtensionContext,
		private readonly _conversationRepository: ConversationRepository
	) {
	}

	async resolveWebviewView(
		webviewView: vscode.WebviewView
	) {
		this._view = webviewView;

		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [
				vscode.Uri.file(path.join(this._context.extensionPath, 'media'))
			]
		};

		webviewView.webview.html = this._getWebviewContent(webviewView.webview);

		webviewView.webview.onDidReceiveMessage(async message => await this._handleMessage(message));

		this._openAiClient = new OpenAiClient();
		await this._openAiClient.init();
	}

	public changeConversation(conversation: Conversation) {
		this._currentConversation = conversation;

		this._view?.webview.postMessage({ command: "onConversationChanged", conversation });
	}

	private _getWebviewContent(webview: vscode.Webview) {
		const htmlUri = path.join(this._context.extensionPath, "src", "apps", "chat", "index.html");
		const stylesUri = webview.asWebviewUri(vscode.Uri.joinPath(this._context.extensionUri, 'media', 'build', 'styles.css'));
		const reactWebviewUri = webview.asWebviewUri(vscode.Uri.joinPath(this._context.extensionUri, 'media', 'build', 'chat.js'));

		let html = fs.readFileSync(htmlUri.toString()).toString();

		html = html.replace("{{scriptUri}}", reactWebviewUri.toString());
		html = html.replace("{{stylesUri}}", stylesUri.toString());

		return html;
	};

	private async _handleMessage(message: any) {
		switch (message.command) {
			case "postUserMessage": {

				if (!this._currentConversation) {
					vscode.commands.executeCommand("gpt-assistant.createConversation");
				}

				this.addMessageToConversation(message.message);

				const responseStream = await this._openAiClient.sendChatRequest(this._currentConversation.messages);
				const responseMessage = {
					role: "assistant",
					content: "",
					id: randomUUID()
				};
				this.addMessageToConversation(responseMessage);
				let messageContentDelta = {} as any;
				const reader = responseStream.getReader();
				while (!(messageContentDelta = await reader.read()).done) {
					responseMessage.content += messageContentDelta.value || "";

					this.setConversation(this._currentConversation);
				}
			}
		}
	}

	//TODO: refactor
	private addMessageToConversation(message: Message) {
		this._currentConversation.messages.push(message);
		this._conversationRepository.update(this._currentConversation);

		this.setConversation(this._currentConversation);
	}

	private setConversation(conversation: Conversation) {
		this._view?.webview.postMessage({ command: "refreshConversation", conversation });
	}
}