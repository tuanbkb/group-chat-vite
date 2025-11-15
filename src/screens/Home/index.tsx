import { CircularProgress } from "@mui/joy";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import Dropdown from "@mui/joy/Dropdown";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Sheet from "@mui/joy/Sheet";
import Tab from "@mui/joy/Tab";
import TabList from "@mui/joy/TabList";
import Tabs from "@mui/joy/Tabs";
import Typography from "@mui/joy/Typography";
import { fetchUserAttributes, signOut } from "aws-amplify/auth";
import { useEffect, useState } from "react";
import { fetchUserData, updateDisplayName } from "../../services/user";
import * as styles from "./styles";

type Conversation = {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar?: string;
};

type Message = {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
  isOwn: boolean;
};

export default function HomeScreen() {
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >("1");
  const [message, setMessage] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("chat");

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [openNameModal, setOpenNameModal] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState("");

  // Mock data
  const conversations: Conversation[] = [
    {
      id: "1",
      name: "Nguyễn Văn A",
      lastMessage: "Chúng ta hẹn họp vào 2h chiều nhé",
      timestamp: "10:30",
    },
    {
      id: "2",
      name: "Trần Thị B",
      lastMessage: "Cuối tuần có rảnh không?",
      timestamp: "09:15",
    },
    {
      id: "3",
      name: "Lê Văn C",
      lastMessage: "Cảm ơn bạn nhiều nhé!",
      timestamp: "Hôm qua",
    },
  ];

  const messages: Message[] = [
    {
      id: "1",
      text: "Chào bạn! Bạn khỏe không?",
      sender: "Nguyễn Văn A",
      timestamp: "10:25",
      isOwn: false,
    },
    {
      id: "2",
      text: "Mình khỏe, cảm ơn bạn! Còn bạn thì sao?",
      sender: "me",
      timestamp: "10:27",
      isOwn: true,
    },
    {
      id: "3",
      text: "Mình cũng ổn. Chúng ta hẹn họp vào 2h chiều nhé",
      sender: "Nguyễn Văn A",
      timestamp: "10:30",
      isOwn: false,
    },
    {
      id: "4",
      text: "Được rồi, hẹn gặp bạn lúc đó!",
      sender: "me",
      timestamp: "10:31",
      isOwn: true,
    },
  ];

  const selectedConv = conversations.find((c) => c.id === selectedConversation);

  function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    // Handle sending message
    console.log("Sending message:", message);
    setMessage("");
  }

  function handleSelectConversation(id: string) {
    setSelectedConversation(id);
    // On mobile, hide sidebar when selecting a conversation
    setShowSidebar(false);
  }

  function handleBackToList() {
    setShowSidebar(true);
    setSelectedConversation(null);
  }

  function handleOpenNameModal() {
    setNewDisplayName(username || "");
    setOpenNameModal(true);
  }

  function handleCloseNameModal() {
    setOpenNameModal(false);
    setNewDisplayName("");
  }

  async function handleSaveDisplayName() {
    if (newDisplayName.trim()) {
      // TODO: Add API call to update username in database
      console.log("Updating display name to:", newDisplayName.trim());
      try {
        await updateDisplayName(userId, newDisplayName.trim());
        setUsername(newDisplayName.trim());
      } catch (error) {
        console.error("Error updating display name:", error);
      }
      handleCloseNameModal();
    }
  }

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      const uid = await fetchUserAttributes().then((attrs) => attrs.sub);

      if (!uid) {
        console.error("User ID not found.");
        signOut();
        return;
      }
      setUserId(uid);
      try {
        const data = await fetchUserData(uid);
        setUsername(data.name);
      } catch (error) {
        console.error("Error fetching username:", error);
      }
      setLoading(false);
    };
    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          ...styles.container,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={styles.container}>
      {/* Left Panel - Conversations List */}
      <Sheet variant="soft" sx={styles.leftPanel(showSidebar)}>
        {/* Header */}
        <Box sx={styles.header}>
          <Typography level="h3" color="primary" sx={styles.headerTitle}>
            💬 Tin nhắn
          </Typography>
        </Box>

        {/* Navigation Tabs */}
        <Box sx={styles.tabsContainer}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue as string)}
            sx={styles.tabs}
          >
            <TabList size="sm" sx={styles.tabList}>
              <Tab value="chat" sx={styles.tab}>
                💬 Trò chuyện
              </Tab>
              <Tab value="search" sx={styles.tab}>
                🔍 Tìm kiếm
              </Tab>
              <Tab value="requests" sx={styles.tab}>
                📋 Yêu cầu
              </Tab>
            </TabList>
          </Tabs>
        </Box>

        {/* Tab Content */}
        {activeTab === "chat" && (
          <List sx={styles.conversationList}>
            {conversations.map((conv) => (
              <ListItem key={conv.id} sx={styles.listItem}>
                <ListItemButton
                  selected={selectedConversation === conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  sx={styles.listItemButton}
                >
                  <Box sx={styles.avatarContainer}>
                    <Avatar sx={styles.avatar}>
                      {conv.name[0].toUpperCase()}
                    </Avatar>
                  </Box>
                  <ListItemContent sx={styles.listItemContent}>
                    <Box sx={styles.conversationHeader}>
                      <Typography level="title-md" sx={styles.conversationName}>
                        {conv.name}
                      </Typography>
                      <Typography
                        level="body-xs"
                        sx={styles.conversationTimestamp}
                      >
                        {conv.timestamp}
                      </Typography>
                    </Box>
                    <Box sx={styles.conversationMessageRow}>
                      <Typography
                        level="body-sm"
                        sx={styles.conversationMessage}
                      >
                        {conv.lastMessage}
                      </Typography>
                    </Box>
                  </ListItemContent>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}

        {activeTab === "search" && (
          <Box sx={styles.emptyTabContent}>
            <Typography level="h4" sx={styles.emptyTabTitle}>
              🔍 Tìm kiếm người dùng
            </Typography>
            <Typography level="body-sm" sx={styles.emptyTabSubtitle}>
              Tính năng đang được phát triển
            </Typography>
          </Box>
        )}

        {activeTab === "requests" && (
          <Box sx={styles.emptyTabContent}>
            <Typography level="h4" sx={styles.emptyTabTitle}>
              📋 Yêu cầu kết bạn
            </Typography>
            <Typography level="body-sm" sx={styles.emptyTabSubtitle}>
              Tính năng đang được phát triển
            </Typography>
          </Box>
        )}

        <Divider sx={styles.divider} />

        {/* User Card */}
        <Dropdown>
          <MenuButton sx={styles.menuButton}>
            <Box sx={styles.userCardContainer}>
              <Avatar size="lg" sx={styles.userAvatar}>
                {username?.[0]?.toUpperCase() || "U"}
              </Avatar>
              <Box sx={styles.userInfo}>
                <Typography level="title-md" sx={styles.username}>
                  {username || "User"}
                </Typography>
                <Box sx={styles.statusContainer}>
                  <Box sx={styles.statusIndicator} />
                  <Typography level="body-xs" sx={styles.statusText}>
                    Đang hoạt động
                  </Typography>
                </Box>
              </Box>
            </Box>
          </MenuButton>
          <Menu placement="top-end" sx={styles.menu}>
            <MenuItem onClick={handleOpenNameModal} sx={styles.menuItem}>
              📝 Thay đổi tên hiển thị
            </MenuItem>
            <MenuItem
              onClick={() => signOut()}
              color="danger"
              sx={styles.menuItem}
            >
              🚪 Đăng xuất
            </MenuItem>
          </Menu>
        </Dropdown>
      </Sheet>

      {/* Right Panel - Chat Area */}
      <Box sx={styles.rightPanel(showSidebar)}>
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <Sheet sx={styles.chatHeader}>
              <IconButton
                sx={styles.backButton}
                onClick={handleBackToList}
                variant="soft"
                color="neutral"
              >
                ←
              </IconButton>
              <Avatar sx={styles.chatHeaderAvatar}>
                {selectedConv.name[0].toUpperCase()}
              </Avatar>
              <Box sx={styles.chatHeaderContent}>
                <Typography level="title-lg" sx={styles.chatHeaderTitle}>
                  {selectedConv.name}
                </Typography>
              </Box>
            </Sheet>

            {/* Messages Area */}
            <Box sx={styles.messagesArea}>
              {messages.map((msg) => (
                <Box key={msg.id} sx={styles.messageContainer(msg.isOwn)}>
                  <Box sx={styles.messageContent}>
                    {!msg.isOwn && (
                      <Typography level="body-xs" sx={styles.messageSender}>
                        {msg.sender}
                      </Typography>
                    )}
                    <Sheet
                      variant={msg.isOwn ? "solid" : "outlined"}
                      color={msg.isOwn ? "primary" : "neutral"}
                      sx={styles.messageSheet(msg.isOwn)}
                    >
                      <Typography
                        level="body-md"
                        sx={styles.messageText(msg.isOwn)}
                      >
                        {msg.text}
                      </Typography>
                    </Sheet>
                    <Typography
                      level="body-xs"
                      sx={styles.messageTimestamp(msg.isOwn)}
                    >
                      {msg.timestamp}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Message Input */}
            <Sheet sx={styles.messageInputContainer}>
              <form onSubmit={handleSendMessage}>
                <Box sx={styles.messageInputForm}>
                  <Input
                    placeholder="Nhập tin nhắn..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    sx={styles.messageInput}
                    size="lg"
                  />
                  <IconButton
                    type="submit"
                    color="primary"
                    size="lg"
                    sx={styles.sendButton}
                  >
                    ➤
                  </IconButton>
                </Box>
              </form>
            </Sheet>
          </>
        ) : (
          <Box sx={styles.emptyChat}>
            <Typography level="body-lg" sx={styles.emptyChatText}>
              Chọn một cuộc trò chuyện để bắt đầu
            </Typography>
          </Box>
        )}
      </Box>

      {/* Change Display Name Modal */}
      <Modal open={openNameModal} onClose={handleCloseNameModal}>
        <ModalDialog sx={{ minWidth: 400 }}>
          <Typography level="h4" sx={{ mb: 2 }}>
            📝 Thay đổi tên hiển thị
          </Typography>
          <Input
            placeholder="Nhập tên hiển thị mới"
            value={newDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
            sx={{ mb: 2 }}
            autoFocus
          />
          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Button
              variant="plain"
              color="neutral"
              onClick={handleCloseNameModal}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSaveDisplayName}
              disabled={!newDisplayName.trim()}
            >
              Lưu
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </Box>
  );
}
