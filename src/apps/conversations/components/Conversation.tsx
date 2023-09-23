import * as React from "react";
import Conversation from '../../../types/conversation';
import { BiMessageAltDetail, BiPencil, BiTrash } from "react-icons/bi";

type Props = {
  conversation: Conversation,
  onClick: (conversation: Conversation) => void
  onRemoveConversation: (conversation: Conversation) => void
};

const ConversationComponent = (props: Props) => {
  const { conversation, onClick, onRemoveConversation } = props;

  const removeConversation = () => {
    onRemoveConversation(conversation);
  };

  return (
    <div onClick={() => onClick(conversation)} data-id={conversation.id} key={conversation.id} className="conversation" data-selected={conversation.selected}>
      <span className="icon">
        <BiMessageAltDetail />
      </span>
      <div className="title">
        {conversation.title || "New conversation"}
        <div className="fade"></div>
      </div>
      <div className="buttons">
        <button>
          <BiPencil />
        </button>
        <button onClick={removeConversation}>
          <BiTrash />
        </button>
      </div>
    </div>
  );
};

export default ConversationComponent;