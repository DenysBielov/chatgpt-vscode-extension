import { Message } from "./message";

export default interface Conversation {
  id: string;
  messages: Message[];
  title: string;
  selected: boolean;
}