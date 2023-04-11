import $ from "jquery";

const vscode = acquireVsCodeApi ? acquireVsCodeApi() : undefined;
const conversations = [];
const conversationsContainer = $(
  document.querySelector("#conversations-container")
);

const init = () => {
  attachConversationClickEventsHandler($(".conversation"));

};

const clearConversationsList = () => {
  conversationsContainer.empty();
};

const createConversationElement = (conversation) => {
  const conversationElement = $(`
    <div data-id="${conversation.id}" class="conversation flex gap-2 items-center hover:cursor-pointer h-18 p-4 rounded-lg hover:bg-[#2A2B32] group">
          <span>
            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </span>
          <div class="flex-1 text-ellipsis max-h-5 overflow-hidden break-all relative">
            ${conversation.title}
            <div class="absolute inset-y-0 right-0 w-8 z-10 bg-gradient-to-l from-gray-800 group-hover:from-[#2A2B32]"></div>
          </div>
          <button>
            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </button>
          <button>
            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>`);

  attachConversationClickEventsHandler(conversationElement);

  return conversationElement;
};

const attachConversationClickEventsHandler = (conversationElement) => {
  conversationElement.on("click", (event) => {
    const element = $(event.target).closest(".conversation");
    
    vscode.postMessage({
      command: "selectConversation",
      conversationId: element.data("id"),
    });
  });
};

init();
