import { useEffect, useRef } from "react";
import type { Conversation, Message } from "../types";
import { fetchAllChats } from "../../../services/chat";
import { fetchMessageByChatId } from "../../../services/message";

type UseWebSocketProps = {
  userId: string;
  selectedConversation: string | null;
  conversations: Conversation[];
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  setMessageList: React.Dispatch<React.SetStateAction<Message[]>>;
};

export function useWebSocket({
  userId,
  selectedConversation,
  conversations,
  setConversations,
  setMessageList,
}: UseWebSocketProps) {
  const wsRef = useRef<WebSocket | null>(null);
  const selectedConversationRef = useRef<string | null>(null);
  const conversationsRef = useRef<Conversation[]>([]);

  // Keep ref in sync with state
  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  // WebSocket connection for real-time messages
  useEffect(() => {
    if (!userId) return;

    const WS_URL = `wss://za4oejdtm4.execute-api.ap-southeast-1.amazonaws.com/production?userId=${userId}`;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      // WebSocket connected
    };

    ws.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);

        const newMessage: Message = data;
        const chatId = newMessage.SK.slice(5);

        // Check if the chat exists in the conversation list
        const chatExists = conversationsRef.current.find(
          (conv) => conv.chatId === chatId
        );

        if (!chatExists) {
          const chats = await fetchAllChats(userId);
          setConversations(
            chats.sort(
              (a: Conversation, b: Conversation) => b.lastSent - a.lastSent
            )
          );

          if (chatId === selectedConversationRef.current) {
            const messages = await fetchMessageByChatId(chatId);
            setMessageList(messages);
          }
        } else {
          if (chatId === selectedConversationRef.current) {
            setMessageList((prev) => {
              const existingIndex = prev.findIndex(
                (msg) =>
                  msg.PK === newMessage.PK ||
                  (msg.senderId === newMessage.senderId &&
                    msg.data === newMessage.data &&
                    Math.abs(msg.sentAt - newMessage.sentAt) < 2000)
              );

              if (existingIndex !== -1) {
                const updated = [...prev];
                updated[existingIndex] = newMessage;
                return updated;
              } else {
                return [...prev, newMessage];
              }
            });
          }

          setConversations((prev) => {
            const updated = prev.map((conv) => {
              if (conv.chatId === chatId) {
                return {
                  ...conv,
                  lastMessage: newMessage.data,
                  lastSent: newMessage.sentAt,
                };
              }
              return conv;
            });
            return updated.sort((a, b) => b.lastSent - a.lastSent);
          });
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      // WebSocket disconnected
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [userId, setConversations, setMessageList]);

  return wsRef;
}
