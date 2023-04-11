import * as React from "react";
import { useState } from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { Chat } from "./components/Chat";
import { SendMessagePanel } from "./components/SendMessagePanel";
import { Message } from "../../types/message";
import { VsCodeApi } from "../../utils/vscode";
import { Command } from "../../types/command";
import "./styles.scss";

declare const vscode: VsCodeApi;

const ChatApp: React.FC = () => {
  const [conversation, setConversation] = useState(undefined);

  const handleMessageSend = (message: Message) => {
    vscode.postMessage({
      command: "postUserMessage",
      message
    });
  };

  React.useEffect((() => {
    window.addEventListener("message", async (event) => {
      const command = event.data;

      switch (command.command) {
        case "refreshConversation":
        case "changeConversation": {
          setConversation(command.conversation);
          break;
        }
      }
    });
  }).bind(this));

  return <div>
    <Chat conversation={conversation} />
    <SendMessagePanel onMessageSend={handleMessageSend} />
  </div>;
};

const root = ReactDOMClient.createRoot(document.getElementById('root')!);
root.render(<ChatApp />);