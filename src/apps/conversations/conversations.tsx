import * as React from "react";
import ConversationComponent from "./components/Conversation";
import Conversation from "../../types/conversation";
import * as ReactDOMClient from 'react-dom/client';
import { VsCodeApi } from "../../utils/vscode";
import "./styles.scss";

declare const vscode: VsCodeApi;

export const Conversations: React.FC = () => {
  const [conversations, setConversations] = React.useState([] as Conversation[]);

  React.useEffect(() => {
    window.addEventListener("message", (async (event: any) => {
      const data = event.data;

      switch (data.command) {
        case "refreshConversations": {
          const conversations: Conversation[] = data.conversations;
          setConversations(conversations);
        }
      }
    }).bind(this));
  });

  const handleOnConversationClick = (conversation: Conversation) => {
    vscode.postMessage({command: "selectConversation", conversation});
  };

  return (
    <div>
      <div
        id="conversations-container"
      >
        {conversations.map(conversation =>
          <ConversationComponent onClick={handleOnConversationClick} conversation={conversation} />)}
      </div>
    </div>
  );
};

const root = ReactDOMClient.createRoot(document.getElementById('root')!);
root.render(<Conversations />);