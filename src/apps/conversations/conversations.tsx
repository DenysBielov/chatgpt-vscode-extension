import * as React from "react";
import ConversationComponent from "./components/Conversation";
import Conversation from "../../types/conversation";
import * as ReactDOMClient from 'react-dom/client';
import { VsCodeApi } from "../../utils/vscode";
import "./styles.scss";

declare const vscode: VsCodeApi;

export const Conversations: React.FC = () => {
  const [conversations, setConversations] = React.useState<Conversation[] | undefined>(undefined);

  React.useEffect(() => {
    window.addEventListener("message", (async (event: any) => {
      const data = event.data;

      switch (data.command) {
        case "refreshConversations": {
          const newConversations: Conversation[] = data.conversations;
          setConversations(newConversations);
          break;
        }
      }
    }));

    vscode.postMessage({ command: "initializeBackend" });
  }, []);

  const handleOnConversationClick = (conversation: Conversation) => {
    vscode.postMessage({ command: "selectConversation", conversation });
  };

  const handleConversationRemove = (conversation: Conversation) => {
    vscode.postMessage({ command: "removeConversation", conversation });
  };

  return (
    <div>
      <div
        id="conversations-container"
      >
        {conversations && conversations.map(conversation =>
          <ConversationComponent onRemoveConversation={handleConversationRemove} onClick={handleOnConversationClick} conversation={conversation} />)}
      </div>
    </div>
  );
};

const root = ReactDOMClient.createRoot(document.getElementById('root')!);
root.render(<Conversations />);