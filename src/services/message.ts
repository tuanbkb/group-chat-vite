import { apiGet, apiPost } from "./apiClient";

export const fetchMessageByChatId = async (chatId: string): Promise<any> => {
  try {
    const messages = await apiGet("chatApi", `/messages/getAllFromConversation`, {
      queryParams: {
        chatId,
      },
    });
    if (Array.isArray(messages)) {
      messages.sort((a: any, b: any) => a.sentAt - b.sentAt);
    }
    console.log("Messages fetched:", messages);
    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export const sendMessage = async (
  conversationId: string,
  senderId: string,
  message: string
): Promise<any> => {
  try {
    const res = await apiPost("chatApi", `/messages/send`, {
      conversationId,
      senderId,
      message,
    });
    return res;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};