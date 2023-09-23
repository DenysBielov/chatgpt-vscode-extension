import { randomUUID } from "crypto";
import Conversation from "../../types/conversation";
import { CONVERSATIONS_STORE_KEY } from "./constants";
import Store from "../../store/store";

export default class ConversationRepository {
  constructor(private readonly _store: Store) {

  }

  create(): Conversation {
    const conversation: Conversation = {
      id: randomUUID(),
      messages: [],
      title: "",
      selected: false
    };

    const conversations: Conversation[] = this._store.get(CONVERSATIONS_STORE_KEY) || [];
    conversations.push(conversation);
    this._store.set(CONVERSATIONS_STORE_KEY, conversations);

    return conversation;
  }

  get(conversationId: string): Conversation | undefined {
    const conversations: Conversation[] = this._store.get(CONVERSATIONS_STORE_KEY);

    return conversations.find(con => con.id === conversationId);
  }

  getAll(): Conversation[] {
    const conversations: Conversation[] = this._store.get(CONVERSATIONS_STORE_KEY) || [];

    return conversations;
  }

  getSelected(): Conversation | undefined {
    const conversations: Conversation[] = this.getAll();

    return conversations.find(c => c.selected);
  }

  getLatest(): Conversation | undefined {
    const conversations: Conversation[] = this.getAll();

    conversations.sort((convA, convB) => {
      const convAMessagesDates = convA.messages.map(m => m.datetime.getTime());
      const convBMessagesDates = convB.messages.map(m => m.datetime.getTime());

      return Math.max(...convAMessagesDates) - Math.max(...convBMessagesDates);
    });

    return conversations && conversations[0];
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

  deleteById(conversationId: string) {
    let conversations: Conversation[] = this._store.get(CONVERSATIONS_STORE_KEY);
    conversations = conversations.filter(con => con.id !== conversationId);

    this.updateAll(conversations);
  }

  delete(conversation: Conversation) {
    this.deleteById(conversation.id);
  }

  selectById(conversationId: string) {
    const conversation = this.get(conversationId);

    if (conversation) {
      this.select(conversation);
    }
  }

  select(conversation: Conversation) {
    if (!conversation) {
      return;
    }

    const conversations = this.getAll();

    if (!conversations) {
      return;
    }

    conversations.filter(Boolean).forEach(c => c.selected = c.id === conversation.id);

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