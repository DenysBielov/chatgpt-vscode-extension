export const getDefaultCreateTitlePrompt = (message: string) => {
  return `I have a chat with conversation between user and AI assistant, and I need a title that will give a hint what conversation is about using just one message:\n\n${message}\n\nTitle:`;
};