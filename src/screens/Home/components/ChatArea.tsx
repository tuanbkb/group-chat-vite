import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import { CircularProgress } from "@mui/joy";
import IconButton from "@mui/joy/IconButton";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import { MdArrowBack } from "react-icons/md";
import type { Conversation, Message } from "../types";
import { formatMessageTimestamp } from "../../../utils/formatTimestamp";
import * as styles from "../styles";

type ChatHeaderProps = {
  conversation: Conversation;
  onBack: () => void;
};

export function ChatHeader({ conversation, onBack }: ChatHeaderProps) {
  return (
    <Sheet sx={styles.chatHeader}>
      <IconButton
        sx={styles.backButton}
        onClick={onBack}
        variant="soft"
        color="neutral"
      >
        <MdArrowBack />
      </IconButton>
      <Avatar src={conversation.avatar} sx={styles.chatHeaderAvatar}>
        {!conversation.avatar && conversation.senderName[0].toUpperCase()}
      </Avatar>
      <Box sx={styles.chatHeaderContent}>
        <Typography level="title-lg" sx={styles.chatHeaderTitle}>
          {conversation.senderName}
        </Typography>
      </Box>
    </Sheet>
  );
}

type MessageListProps = {
  messages: Message[];
  userId: string;
  senderName: string;
  loading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
};

export function MessageList({
  messages,
  userId,
  senderName,
  loading,
  messagesEndRef,
}: MessageListProps) {
  return (
    <Box sx={styles.messagesArea}>
      {loading ? (
        <Box sx={styles.messagesLoadingContainer}>
          <CircularProgress />
        </Box>
      ) : (
        messages.map((msg) => (
          <Box
            key={msg.PK}
            sx={styles.messageContainer(msg.senderId === userId)}
          >
            <Box sx={styles.messageContent}>
              {!(msg.senderId === userId) && (
                <Typography level="body-xs" sx={styles.messageSender}>
                  {senderName}
                </Typography>
              )}
              <Sheet
                variant={msg.senderId === userId ? "solid" : "outlined"}
                color={msg.senderId === userId ? "primary" : "neutral"}
                sx={styles.messageSheet(msg.senderId === userId)}
              >
                <Typography
                  level="body-md"
                  sx={styles.messageText(msg.senderId === userId)}
                >
                  {msg.data}
                </Typography>
              </Sheet>
              <Typography
                level="body-xs"
                sx={styles.messageTimestamp(msg.senderId === userId)}
              >
                {formatMessageTimestamp(msg.sentAt)}
              </Typography>
            </Box>
          </Box>
        ))
      )}
      <div ref={messagesEndRef} />
    </Box>
  );
}
