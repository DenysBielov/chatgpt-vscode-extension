import * as React from 'react';
import Conversation from '../../../types/conversation';
import { ChatMessage } from './Message';
import { Tooltip } from 'react-tooltip';
import { useEffect } from 'react';

export interface IChatProps {
  conversation?: Conversation;
}

export const Chat: React.FC<IChatProps> = (props: IChatProps) => {
  const { conversation } = props;
  const chatBottom = React.useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (chatBottom.current) {
      chatBottom.current.scrollIntoView();
    }
  }, [conversation]);

  return (
    <div>
      {
        conversation && conversation.messages.length > 0 ?
          <div className='chat-container'>
            {conversation.messages.map((message) =>
              <ChatMessage message={message} />
            )}
            <div ref={chatBottom} style={{ height: "5rem", backgroundColor: 'transparent' }}></div>

            <Tooltip anchorSelect=".code-block-info-tooltip" place='top'>
              Hold CTRL button to be able to drag code into editor.
            </Tooltip>
            <Tooltip anchorSelect=".insert-code-button" place='top'>
              Insert or replace
            </Tooltip>
          </div>
          :
          <div className='no-conversation-chat'>
            <p>Send a message to a start conversation</p>
          </div>
      }
    </div>
  );
};
