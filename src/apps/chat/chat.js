import $ from "jquery";

const vscode = acquireVsCodeApi ? acquireVsCodeApi() : undefined;
const chatContainer = document.querySelector("#messages-container");
const requestTextArea = document.querySelector("#user-input-textarea");


const init = () => {
  const submitMessageButton = document.querySelector("#user-input-submit");

  submitMessageButton.addEventListener("click", (event) => {
    event.preventDefault();
    onUserInput();
  });

  requestTextArea.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.keyCode === 13) {
      event.preventDefault();
      onUserInput();
    }
  });


};

const onUserInput = () => {
  const requestText = requestTextArea.value;
  pushChatMessage(requestText, "You");
  vscode.postMessage({
    type: "onUserInput",
    text: requestText,
  });
  requestTextArea.value = "";
};

const pushChatMessage = (content, role) => {
  const chatMessageElement = createChatMessage(content, role);
  $(chatContainer).append(chatMessageElement);
};

const clearChat = () => {
  $(chatContainer).empty();
};

const createChatMessage = (text, sender) => {
  return $(`
    <div class="group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 bg-gray-50 dark:bg-[#444654]" id="message">
      <div class="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0 m-auto">
        <span class="block h-6 w-6 aspect-square" style="background-color: ${stringToColor(
          sender
        )}"></span>
        <div id="text">${text}</div>
      </div>
    </div>
  `);
};

init();
