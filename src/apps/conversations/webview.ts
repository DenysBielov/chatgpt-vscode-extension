import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import ConversationRepository from './repository';

export class ConversationsWebviewProvider implements vscode.WebviewViewProvider {
	public static readonly viewType = 'gpt-assistant.conversationsView';

	private _view?: vscode.WebviewView;

	constructor(
		private readonly _context: vscode.ExtensionContext,
		private readonly _conversationRepository: ConversationRepository
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

		this.refreshConversations();
	}

	public refreshConversations() {
		const conversations = this._conversationRepository.getAll();

		this._view?.webview.postMessage({ command: this.refreshConversations.name, conversations });
	}

	private _getWebviewContent(webview: vscode.Webview) {
		const htmlUri = path.join(this._context.extensionPath, "src", "apps", "conversations", "index.html");
		const stylesUri = webview.asWebviewUri(vscode.Uri.joinPath(this._context.extensionUri, 'media', 'build', 'styles.css'));
		const reactWebviewUri = webview.asWebviewUri(vscode.Uri.joinPath(this._context.extensionUri, 'media', 'build', 'conversations.js'));

		let html = fs.readFileSync(htmlUri.toString()).toString();

		html = html.replace("{{scriptUri}}", reactWebviewUri.toString());
		html = html.replace("{{stylesUri}}", stylesUri.toString());

		return html;
	};

	private async _handleMessage(message: any) {
		switch (message.command) {
			case "createConversation": {
				const conversation = this._conversationRepository.create();
				this._view?.webview.postMessage({ command: "conversationCreated", conversation });
				break;
			}
			case "selectConversation": {
				//TODO: change literal command name to something more stable.
				vscode.commands.executeCommand("gpt-assistant.selectConversation", message.conversation);
			}
		}
	}
}