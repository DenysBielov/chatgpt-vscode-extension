import * as vscode from 'vscode';
import { ChatWebviewProvider } from "./apps/chat/webview";
import { ConversationsWebviewProvider } from './apps/conversations/webview';
import ConversationRepository from './apps/conversations/repository';
import Store from "./store/store";
import { UUID } from 'crypto';
import Conversation from './types/conversation';

export function activate(context: vscode.ExtensionContext) {
	initWebviews(context);
}

const initWebviews = (context: vscode.ExtensionContext) => {
	const store = new Store(context);
	const conversationRepository = new ConversationRepository(store);

	//TODO: make it more generic?
	const chatProvider = new ChatWebviewProvider(context, conversationRepository);
	const conversationsProvider = new ConversationsWebviewProvider(context, conversationRepository);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(ChatWebviewProvider.viewType, chatProvider)
	);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(ConversationsWebviewProvider.viewType, conversationsProvider)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("gpt-assistant.createConversation", () => {
			const conversation = conversationRepository.create();

			chatProvider.changeConversation(conversation);
			conversationsProvider.refreshConversations();
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("gpt-assistant.selectConversation", (conversation: Conversation) => {
			conversationRepository.select(conversation);

			chatProvider.changeConversation(conversation);
			conversationsProvider.refreshConversations();
		})
	);
};

// This method is called when your extension is deactivated
export function deactivate() { }


