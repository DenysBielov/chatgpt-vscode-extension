import * as vscode from 'vscode';
import { MissingApiKeyError, OpenAiClient } from '../../openai/openAIClient';
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
		private readonly _conversationRepository: ConversationRepository,
		private _openAiApiKey: string
	) { }

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
	}

	private async initOpenAiClient() {
		try {
			this._openAiClient = new OpenAiClient(this._openAiApiKey);
			await this._openAiClient.init();
			this.toggleApiKeyView(false);
		}
		catch (e) {
			if (e instanceof MissingApiKeyError) {
				this.toggleApiKeyView(true);
			}
		}
	}

	public changeConversation(conversation: Conversation) {
		this._currentConversation = conversation;

		this._view?.webview.postMessage({ command: "changeConversation", conversation });
	}

	private _getWebviewContent(webview: vscode.Webview) {
		const stylesUri = webview.asWebviewUri(vscode.Uri.joinPath(this._context.extensionUri, 'media', 'build', 'styles.css'));
		const reactWebviewUri = webview.asWebviewUri(vscode.Uri.joinPath(this._context.extensionUri, 'media', 'build', 'chat.js'));

		let html = `
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>GPT Assistant</title>
			</head>
			<body class="relative">
				<div id="root"></div>
				<script>
					const vscode = acquireVsCodeApi();
				</script>
				<script src="{{scriptUri}}"></script>
			</body>
		</html>
		`;

		html = html.replace("{{scriptUri}}", reactWebviewUri.toString());
		html = html.replace("{{stylesUri}}", stylesUri.toString());

		return html;
	}

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
					id: randomUUID(),
					datetime: new Date()
				};
				this.addMessageToConversation(responseMessage);
				let messageContentDelta = {} as any;
				const reader = responseStream.getReader();
				while (!(messageContentDelta = await reader.read()).done) {
					responseMessage.content += messageContentDelta.value || "";

					this.setConversation(this._currentConversation);
				}
				break;
			}

			case "setOpenAiApiKey": {
				this.toggleLoader(true);
				const key = message.key;
				vscode.commands.executeCommand("gpt-assistant.changeOpenAiApiKey", key);
				this._openAiApiKey = message.key;
				this.initOpenAiClient();
				this.toggleLoader(false);
				break;
			}

			case "initializeBackend": {
				this.initOpenAiClient();
				const selectedConversation = this._conversationRepository.getSelected();
				if (selectedConversation) {
					this.changeConversation(selectedConversation);
				}
				this.toggleLoader(false);
				break;
			}

			case "replaceCode": {
				this.replaceCodeInCurrentEditor(message.code);
			}
		}
	}

	private replaceCodeInCurrentEditor(code: string) {
		const textEditor = vscode.window.activeTextEditor;

		if (!textEditor) {
			vscode.window.showInformationMessage("To insert code into active editor, you need to open editor first!");
			return;
		}

		const currentSelection = textEditor.selection;
		const snippet = new vscode.SnippetString(code);

		if (currentSelection.isEmpty) {
			textEditor.insertSnippet(snippet, textEditor.selection.active);
		} else {
			textEditor.insertSnippet(snippet, currentSelection);
		}

		vscode.window.showTextDocument(textEditor.document);
	}

	private toggleLoader(isLoading: boolean) {
		this._view?.webview.postMessage({ command: "toggleLoading", isLoading: isLoading });
	}

	//TODO: refactor
	private async addMessageToConversation(message: Message) {
		this._currentConversation.messages.push(message);
		this._conversationRepository.update(this._currentConversation);
		console.log(this._currentConversation);
		if (!this._currentConversation.title) {
			await this.setConverationTitle();
		}

		this.setConversation(this._currentConversation);
	}

	private async setConverationTitle() {
		const message = this._currentConversation.messages.find(m => m.role === "assistant")?.content;
		if (!message) {
			return;
		}
		const title = await this._openAiClient.sendCompletionRequest(message);
		console.log("title", title);
	}

	private setConversation(conversation: Conversation) {
		this._view?.webview.postMessage({ command: "refreshConversation", conversation });
	}

	private toggleApiKeyView(visible: boolean) {
		this._view?.webview.postMessage({ command: "toggleApiKeyView", visible });
	}
}