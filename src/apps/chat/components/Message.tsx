import * as React from 'react';
import { Message } from '../../../types/message';
import { stringToColor } from '../utils';
import Markdown from './Markdown';
import { RiQuestionMark, RiRobot2Line, RiUser3Line } from "react-icons/ri";

export interface IChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<IChatMessageProps> = (props: IChatMessageProps) => {
  const { message } = props;

  return (
    <div key={message.id} className="chat-message" id="message">
      <div className="content">
        <span className='icon'>{roleToIcon(message.role)}</span>
        <div className='text'>
          <Markdown>
            {message.content}
          </Markdown>
        </div>
      </div>
    </div>
  );
};


const roleToIcon = (role: string) => {
  switch (role) {
    case "user": {
      return <RiUser3Line size={"1.5rem"} />;
    }

    case "assistant": {
      return <RiRobot2Line size={"1.5rem"} />;
    }

    default: {
      return <RiQuestionMark size={"1.5rem"} />;
    }
  }
}