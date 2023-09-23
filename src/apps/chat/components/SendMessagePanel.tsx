import * as React from 'react';
import { Message } from '../../../types/message';
import { v4 as uuidv4 } from 'uuid';
import { BiNavigation } from "react-icons/bi";

export interface ISendMessagePanelProps {
  onMessageSend: (message: Message) => void;
}

export const SendMessagePanel: React.FC<ISendMessagePanelProps> = (props: ISendMessagePanelProps) => {
  const [textAreaValue, setTextAreaValue] = React.useState("");
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleTextAreaInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
    setTextAreaValue(textAreaRef.current ? textAreaRef.current.value : "");
    autoResizeTextArea(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.key === "Enter" || event.keyCode === 13) && !event.shiftKey) {
      event.preventDefault();
      handleMessagePost();
    }
  };

  const handleMessagePost = () => {
    if (!textAreaRef.current) {
      return;
    }

    const textAreaValue = textAreaRef.current.value;
    textAreaRef.current.value = "";

    if (!textAreaValue) {
      //TODO: add "empty message" error.
      return;
    }

    props.onMessageSend({
      content: textAreaValue, 
      role: "user", 
      id: uuidv4(),
      datetime: new Date()
    });
  };

  return (
    <div className="send-message-panel">
      <form>
        <div
          className="input-container"
        >
          <textarea
            ref={textAreaRef}
            id="user-input-textarea"
            style={{
              maxHeight: "200px",
              height: "24px",
              overflowY: "hidden"
            }}
            placeholder="Send a message..."
            className="user-input"
            onInput={handleTextAreaInput}
            onKeyDown={handleKeyDown}
          ></textarea>
          <button id="user-input-submit" disabled={!textAreaValue} className="submit-button" onClick={(event) => { event.preventDefault(); handleMessagePost(); }}>
            <BiNavigation />
          </button>
        </div>
      </form >
    </div >
  );
};

const autoResizeTextArea = (event: React.FormEvent<HTMLTextAreaElement>) => {
  const textArea = event.currentTarget;
  textArea.style.height = "0";
  textArea.style.height = (textArea.scrollHeight) + "px";
};