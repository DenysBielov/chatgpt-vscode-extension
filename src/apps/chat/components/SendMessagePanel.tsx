import * as React from 'react';
import { Message } from '../../../types/message';
import { v4 as uuidv4 } from 'uuid';

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
      handleMessagePost();
    }
  };

  const handleMessagePost = () => {
    if(!textAreaRef.current){
      return;
    }
    
    const textAreaValue = textAreaRef.current.value;
    textAreaRef.current.value = "";

    props.onMessageSend({ content: textAreaValue, role: "user", id: uuidv4() });
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
          <button id="user-input-submit" disabled={!textAreaValue} className="submit-button " onClick={(event) => { event.preventDefault(); handleMessagePost(); }}>
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 mr-1"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
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