import { apiGet, apiPost } from "./apiClient";
import { fetchUserData } from "./user";

export const fetchAllChats = async (userId: string): Promise<any> => {
  try {
    const chats = await apiGet("chatApi", "/conversations", {
      queryParams: {
        userId,
      },
    });
    if (Array.isArray(chats)) {
      await Promise.all(
        chats.map(async (chat: any) => {
          const senderid = chat.users.filter((u: string) => u !== userId);
          const sender = await fetchUserData(senderid[0]);
          chat.senderName = sender.name;
          chat.avatar = sender.avatar;
      }));
    }
    console.log("Chats fetched:", chats);
    return chats;
  } catch (error) {
    console.error("Error fetching chats:", error);
    throw error;
  }
};

export const createNewChat = async (userId: string, otherUserId: string): Promise<any> => { 
  try {
    const res = await apiPost("chatApi", "/conversations", {
      users: [userId, otherUserId],
    });
    return res;
  } catch (error) {
    console.error("Error creating new chat:", error);
    throw error;
  }
}