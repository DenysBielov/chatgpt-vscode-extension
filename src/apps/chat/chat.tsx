import * as React from "react";
import { useState } from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { Chat } from "./components/Chat";
import { SendMessagePanel } from "./components/SendMessagePanel";
import { Message } from "../../types/message";
import { VsCodeApi } from "../../utils/vscode";
import "./styles.scss";
import ApiKeyPanel from "./components/ApiKeyPanel";
import Loader from "../shared/components/Loader";

declare const vscode: VsCodeApi;

const ChatApp: React.FC = () => {
  const [conversation, setConversation] = useState(undefined);
  const [isApiKeyPanelVisible, setIsApiKeyPanelVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleApiKeySubmit = (key: string) => {
    vscode.postMessage({
      command: "setOpenAiApiKey",
      key
    });
  };

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
        case "toggleApiKeyView": {
          setIsApiKeyPanelVisible(command.visible);
          break;
        }
        case "toggleLoading": {
          setIsLoading(command.isLoading);
        }
      }
    });

    vscode.postMessage({ command: "initializeBackend" });
  }), []);

  return isLoading ?
    <div>
      <Loader></Loader>
    </div>
    :
    (isApiKeyPanelVisible ?
      <ApiKeyPanel onApiKeySubmit={handleApiKeySubmit} />
      :
      <div>
        <Chat conversation={conversation} />
        <SendMessagePanel onMessageSend={handleMessageSend} />
      </div>);
};

const root = ReactDOMClient.createRoot(document.getElementById('root')!);
root.render(<ChatApp />);