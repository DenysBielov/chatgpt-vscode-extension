import * as React from 'react';
import { Message } from '../../../types/message';
import { stringToColor } from '../utils';

export interface IChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<IChatMessageProps> = (props: IChatMessageProps) => {
  const { message } = props;

  return (
    <div key={message.id} className="chat-message" id="message">
      <div className="content">
        <span className="icon" style={{ backgroundColor: stringToColor(message.role) }}></span>
        <div id="text">{message.content}</div>
      </div>
    </div>
  );
};
