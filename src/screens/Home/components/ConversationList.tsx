import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import type { Conversation } from "../types";
import { formatTimestamp } from "../../../utils/formatTimestamp";
import * as styles from "../styles";

type ConversationListProps = {
  conversations: Conversation[];
  selectedConversation: string | null;
  onSelectConversation: (id: string) => void;
};

export default function ConversationList({
  conversations,
  selectedConversation,
  onSelectConversation,
}: ConversationListProps) {
  return (
    <List sx={styles.conversationList}>
      {conversations.map((conv) => (
        <ListItem key={conv.chatId} sx={styles.listItem}>
          <ListItemButton
            selected={selectedConversation === conv.chatId}
            onClick={() => onSelectConversation(conv.chatId)}
            sx={styles.listItemButton}
          >
            <Box sx={styles.avatarContainer}>
              <Avatar src={conv.avatar} sx={styles.avatar}>
                {!conv.avatar && conv.senderName[0].toUpperCase()}
              </Avatar>
            </Box>
            <ListItemContent sx={styles.listItemContent}>
              <Box sx={styles.conversationHeader}>
                <Typography level="title-md" sx={styles.conversationName}>
                  {conv.senderName}
                </Typography>
                {conv.lastSent !== 0 && (
                  <Typography level="body-xs" sx={styles.conversationTimestamp}>
                    {formatTimestamp(conv.lastSent)}
                  </Typography>
                )}
              </Box>
              <Box sx={styles.conversationMessageRow}>
                <Typography level="body-sm" sx={styles.conversationMessage}>
                  {conv.lastMessage}
                </Typography>
              </Box>
            </ListItemContent>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
