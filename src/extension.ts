import * as vscode from 'vscode';
import { ChatWebviewProvider } from "./apps/chat/webview";
import { ConversationsWebviewProvider } from './apps/conversations/webview';
import ConversationRepository from './apps/conversations/repository';
import Store from "./store/store";
import Conversation from './types/conversation';
import { OPEN_AI_API_KEY } from './utils/const';

export function activate(context: vscode.ExtensionContext) {
	initWebviews(context);
}

const initWebviews = (context: vscode.ExtensionContext) => {
	const workspaceStore = new Store(context.workspaceState);
	const globalStore = new Store(context.globalState);
	const conversationRepository = new ConversationRepository(workspaceStore);

	const openAiApiKey: string = globalStore.get(OPEN_AI_API_KEY);

	//TODO: make it more generic?
	const chatProvider = new ChatWebviewProvider(context, conversationRepository, openAiApiKey);
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

			vscode.commands.executeCommand("gpt-assistant.selectConversation", conversation);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("gpt-assistant.changeOpenAiApiKey", (key) => {
			globalStore.set(OPEN_AI_API_KEY, key);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("gpt-assistant.removeConversation", (conversation: Conversation) => {
			vscode.window
				.showInformationMessage(`Do you want to remove conversation "${conversation.title}"?`, "Yes", "No")
				.then(answer => {
					if (answer === "Yes") {
						conversationRepository.delete(conversation);

						if (!conversationRepository.getSelected()) {
							const conversations = conversationRepository.getAll();

							if (conversations) {
								conversationRepository.select(conversations.find(() => true)!);
							}
						}

						chatProvider.changeConversation(conversation);
						conversationsProvider.refreshConversations();
					}
				});
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


