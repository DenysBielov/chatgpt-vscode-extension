import { UUID, randomUUID } from "crypto";
import Conversation from "../../types/conversation";
import { CONVERSATIONS_STORE_KEY } from "./constants";
import Store from "../../store/store";

export default class ConversationRepository {
  constructor(private readonly _store: Store) {

  }

  create(selectedByDefault: Boolean = true): Conversation {
    const conversation: Conversation = {
      id: randomUUID(),
      messages: [],
      title: "New conversation",
      selected: false
    };
    let conversations: Conversation[] = this._store.get(CONVERSATIONS_STORE_KEY) || [];
    conversations.push(conversation);
    this._store.set(CONVERSATIONS_STORE_KEY, conversations);

    if (selectedByDefault) {
      this.select(conversation);
    }

    return conversation;
  }

  get(conversationId: string): Conversation | undefined {
    const conversations: Conversation[] = this._store.get(CONVERSATIONS_STORE_KEY);

    return conversations.find(con => con.id === conversationId);
  }

  getAll(): Conversation[] | undefined {
    const conversations: Conversation[] = this._store.get(CONVERSATIONS_STORE_KEY) || [];

    return conversations;
  }

  update(conversation: Conversation) {
    let conversations: Conversation[] = this._store.get(CONVERSATIONS_STORE_KEY);
    conversations = conversations.filter(con => con.id !== conversation.id);
    conversations.push(conversation);
    this._store.set(CONVERSATIONS_STORE_KEY, conversations);
  }

  updateAll(conversations: Conversation[]) {
    this._store.set(CONVERSATIONS_STORE_KEY, conversations);
  }

  delete(conversationId: string) {
    let conversations: Conversation[] = this._store.get(CONVERSATIONS_STORE_KEY);
    conversations = conversations.filter(con => con.id !== conversationId);

    this._store.set(CONVERSATIONS_STORE_KEY, conversations);
  }

  selectById(conversationId: string) {
    const conversation = this.get(conversationId);

    if (conversation) {
      this.select(conversation);
    }
  }

  select(conversation: Conversation) {
    const conversations = this.getAll();
    if (!conversations) {
      return;
    }
    conversations.forEach(c => c.selected = c.id === conversation.id);

    this.updateAll(conversations);
  }

  count() {
    const all = this.getAll();
    return all ? all.length : 0;
  }

  any() {
    return this.count() > 0;
  }
}