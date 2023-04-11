import * as React from 'react';
import Conversation from '../../../types/conversation';
import { ChatMessage } from './Message';

export interface IChatProps {
  conversation?: Conversation;
}

export const Chat: React.FC<IChatProps> = (props: IChatProps) => {
  const { conversation } = props;

  return (
    <div>
      {
        conversation && conversation.messages.length > 0 ?
          <div className='chat-container'>
            {conversation.messages.map((message) =>
              <ChatMessage message={message} />
            )}
            <div style={{ height: "5rem", backgroundColor: 'transparent' }}></div>
          </div>
          :
          <div className='no-conversation-chat'>
            <p>Send a message to a start conversation</p>
          </div>
      }
    </div>
  );
};
