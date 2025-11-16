import type { SxProps } from "@mui/joy/styles/types";

export const container: SxProps = {
  display: "flex",
  height: "100vh",
  overflow: "hidden",
  bgcolor: "background.surface",
};

export const leftPanel = (showSidebar: boolean): SxProps => ({
  width: { xs: showSidebar ? "100%" : "0", sm: "320px", md: "28%" },
  display: { xs: showSidebar ? "flex" : "none", sm: "flex" },
  flexDirection: "column",
  borderRadius: 0,
  borderRight: "1px solid",
  borderColor: "divider",
  transition: "all 0.3s ease",
  boxShadow: { sm: "sm" },
});

export const header: SxProps = {
  p: 3,
};

export const headerTitle: SxProps = {
  fontWeight: 700,
};

export const tabsContainer: SxProps = {
  px: 2,
  pt: 2,
  pb: 1,
};

export const tabs: SxProps = {
  bgcolor: "background.surface",
  borderRadius: "md",
};

export const tabList: SxProps = {
  gap: 0.5,
  p: 0.5,
  bgcolor: "background.level1",
  borderRadius: "md",
};

export const tab: SxProps = {
  flex: 1,
  borderRadius: "sm",
  fontSize: "0.875rem",
  py: 0.75,
};

export const conversationList: SxProps = {
  flex: 1,
  overflow: "auto",
  "--ListItem-paddingY": "6px",
  "--ListItem-paddingX": "16px",
  p: 2,
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    bgcolor: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    bgcolor: "neutral.300",
    borderRadius: "10px",
    "&:hover": {
      bgcolor: "neutral.400",
    },
  },
};

export const listItem: SxProps = {
  mb: 1,
};

export const listItemButton: SxProps = {
  borderRadius: "xl",
  py: 2,
  px: 2,
  transition: "all 0.2s ease",
  bgcolor: "background.surface",
  boxShadow: "xs",
  "&:hover": {
    transform: "translateX(4px)",
    boxShadow: "md",
    bgcolor: "background.level1",
  },
  "&.Joy-selected": {
    bgcolor: "primary.softBg",
    borderLeft: "4px solid",
    borderColor: "primary.500",
    boxShadow: "md",
    "&:hover": {
      bgcolor: "primary.softBg",
    },
  },
};

export const avatarContainer: SxProps = {
  position: "relative",
  flexShrink: 0,
  mr: 1.5,
};

export const avatar: SxProps = {
  bgcolor: "primary.500",
  color: "white",
  width: 48,
  height: 48,
  fontSize: "1.25rem",
  boxShadow: "md",
  border: "2px solid",
  borderColor: "primary.500",
};

export const listItemContent: SxProps = {
  minWidth: 0,
  overflow: "hidden",
};

export const conversationHeader: SxProps = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  mb: 0.5,
  gap: 1,
};

export const conversationName: SxProps = {
  fontWeight: 500,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  flex: 1,
  minWidth: 0,
};

export const conversationTimestamp: SxProps = {
  color: "text.tertiary",
  flexShrink: 0,
};

export const conversationMessageRow: SxProps = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 1,
  minWidth: 0,
};

export const conversationMessage: SxProps = {
  color: "text.secondary",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  flex: 1,
  minWidth: 0,
};

export const emptyTabContent: SxProps = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  p: 3,
  alignItems: "center",
  justifyContent: "center",
};

export const emptyTabTitle: SxProps = {
  mb: 1,
};

export const emptyTabSubtitle: SxProps = {
  color: "text.tertiary",
};

export const searchTabContent: SxProps = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

export const searchBarContainer: SxProps = {
  p: 2,
  pb: 1,
};

export const searchInput: SxProps = {
  "--Input-minHeight": "44px",
  borderRadius: "lg",
  boxShadow: "sm",
  transition: "all 0.2s ease",
  "&:focus-within": {
    boxShadow: "md",
    transform: "translateY(-1px)",
  },
};

export const searchLoadingContainer: SxProps = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  p: 3,
};

export const emptySearchResults: SxProps = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  p: 3,
};

export const searchResultsList: SxProps = {
  flex: 1,
  overflow: "auto",
  "--ListItem-paddingY": "6px",
  "--ListItem-paddingX": "16px",
  p: 2,
  pt: 1,
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    bgcolor: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    bgcolor: "neutral.300",
    borderRadius: "10px",
    "&:hover": {
      bgcolor: "neutral.400",
    },
  },
};

export const divider: SxProps = {
  mt: "auto",
};

export const menuButton: SxProps = {
  border: "none",
  borderRadius: 0,
  p: 3,
  transition: "all 0.2s ease",
  "&:hover": {
    bgcolor: "primary.softBg",
  },
};

export const userCardContainer: SxProps = {
  display: "flex",
  alignItems: "center",
  gap: 2,
  width: "100%",
};

export const userAvatar: SxProps = {
  boxShadow: "md",
  border: "2px solid",
  borderColor: "primary.500",
  width: 48,
  height: 48,
  flexShrink: 0,
};

export const userInfo: SxProps = {
  flex: 1,
  textAlign: "left",
  minWidth: 0,
  overflow: "hidden",
};

export const username: SxProps = {
  fontWeight: 600,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

export const statusContainer: SxProps = {
  display: "flex",
  alignItems: "center",
  gap: 0.5,
};

export const statusIndicator: SxProps = {
  width: 8,
  height: 8,
  borderRadius: "50%",
  bgcolor: "success.500",
  boxShadow: "0 0 8px var(--joy-palette-success-500)",
};

export const statusText: SxProps = {
  color: "success.600",
  fontWeight: 500,
};

export const menu: SxProps = {
  minWidth: 200,
  boxShadow: "lg",
};

export const menuItem: SxProps = {
  py: 1.5,
};

export const rightPanel = (showSidebar: boolean): SxProps => ({
  flex: 1,
  display: {
    xs: showSidebar ? "none" : "flex",
    sm: "flex",
  },
  flexDirection: "column",
});

export const chatHeader: SxProps = {
  p: 3,
  display: "flex",
  alignItems: "center",
  gap: 2,
  borderBottom: "1px solid",
  borderColor: "divider",
  background:
    "linear-gradient(180deg, var(--joy-palette-background-surface) 0%, var(--joy-palette-background-level1) 100%)",
  boxShadow: "sm",
};

export const backButton: SxProps = {
  display: { xs: "flex", sm: "none" },
  borderRadius: "lg",
  boxShadow: "sm",
};

export const chatHeaderAvatar: SxProps = {
  bgcolor: "primary.500",
  color: "white",
  width: 48,
  height: 48,
  fontSize: "1.5rem",
  boxShadow: "md",
  border: "2px solid",
  borderColor: "background.surface",
  flexShrink: 0,
};

export const chatHeaderContent: SxProps = {
  flex: 1,
  minWidth: 0,
};

export const chatHeaderTitle: SxProps = {
  fontWeight: 700,
};

export const messagesArea: SxProps = {
  flex: 1,
  overflow: "auto",
  p: 3,
  display: "flex",
  flexDirection: "column",
  gap: 2,
  background:
    "linear-gradient(180deg, var(--joy-palette-background-level1) 0%, var(--joy-palette-background-body) 100%)",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    bgcolor: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    bgcolor: "neutral.300",
    borderRadius: "10px",
    "&:hover": {
      bgcolor: "neutral.400",
    },
  },
};

export const messageContainer = (isOwn: boolean): SxProps => ({
  display: "flex",
  justifyContent: isOwn ? "flex-end" : "flex-start",
});

export const messageContent: SxProps = {
  maxWidth: { xs: "85%", sm: "70%", md: "60%" },
  display: "flex",
  flexDirection: "column",
  gap: 0.5,
};

export const messageSender: SxProps = {
  px: 1.5,
  fontWeight: 600,
  color: "primary.500",
};

export const messageSheet = (isOwn: boolean): SxProps => ({
  p: 2,
  borderRadius: "xl",
  boxShadow: isOwn ? "md" : "sm",
  ...(isOwn
    ? {
        borderTopRightRadius: 6,
      }
    : {
        borderTopLeftRadius: 6,
      }),
});

export const messageText = (isOwn: boolean): SxProps => ({
  color: isOwn ? "white" : "text.primary",
});

export const messageTimestamp = (isOwn: boolean): SxProps => ({
  px: 1.5,
  color: "text.tertiary",
  textAlign: isOwn ? "right" : "left",
});

export const messageInputContainer: SxProps = {
  p: 3,
  borderTop: "1px solid",
  borderColor: "divider",
  background:
    "linear-gradient(180deg, var(--joy-palette-background-level1) 0%, var(--joy-palette-background-surface) 100%)",
  boxShadow: "0 -2px 8px rgba(0,0,0,0.05)",
};

export const messageInputForm: SxProps = {
  display: "flex",
  gap: 1.5,
  alignItems: "center",
};

export const messageInput: SxProps = {
  flex: 1,
  "--Input-minHeight": "48px",
  borderRadius: "xl",
  boxShadow: "sm",
  transition: "all 0.2s ease",
  "&:focus-within": {
    boxShadow: "md",
    transform: "translateY(-1px)",
  },
};

export const sendButton: SxProps = {
  borderRadius: "xl",
  width: 48,
  height: 48,
  boxShadow: "md",
  background:
    "linear-gradient(135deg, var(--joy-palette-primary-500) 0%, var(--joy-palette-primary-600) 100%)",
  transition: "all 0.2s ease",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: "lg",
  },
  "&:active": {
    transform: "scale(0.95)",
  },
};

export const emptyChat: SxProps = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const emptyChatText: SxProps = {
  color: "text.tertiary",
};

export const messagesLoadingContainer: SxProps = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flex: 1,
};

export const modalDialog: SxProps = {
  minWidth: 400,
};

export const modalTitle: SxProps = {
  mb: 2,
};

export const modalInput: SxProps = {
  mb: 2,
};

export const modalActions: SxProps = {
  display: "flex",
  gap: 1,
  justifyContent: "flex-end",
};

export const confirmModalContent: SxProps = {
  mb: 3,
};

export const confirmModalUserContainer: SxProps = {
  display: "flex",
  alignItems: "center",
  gap: 2,
  mb: 2,
};

export const confirmModalAvatar: SxProps = {
  width: 56,
  height: 56,
  bgcolor: "primary.500",
};

export const confirmModalUserName: SxProps = {
  fontWeight: 600,
};

export const confirmModalUserEmail: SxProps = {
  color: "text.secondary",
};

export const confirmModalMessage: SxProps = {
  color: "text.secondary",
};
