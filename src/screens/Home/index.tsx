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
import { useEffect, useRef, useState } from "react";
import { createNewChat, fetchAllChats } from "../../services/chat";
import { fetchMessageByChatId, sendMessage } from "../../services/message";
import {
  fetchUserData,
  queryUsersByName,
  updateDisplayName,
  uploadAvatar,
} from "../../services/user";
import * as styles from "./styles";

type Conversation = {
  chatId: string;
  users: string[];
  lastMessage?: string;
  lastSent: number;
  senderName: string;
  avatar?: string;
};

type Message = {
  PK: string;
  SK: string;
  data: string;
  senderId: string;
  sentAt: number;
};

export default function HomeScreen() {
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("chat");

  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [openNameModal, setOpenNameModal] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState("");
  const [openProfilePictureModal, setOpenProfilePictureModal] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [profilePictureType, setProfilePictureType] = useState<
    "upload" | "url"
  >("upload");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    Array<{ PK: string; name: string; email: string; avatar?: string }>
  >([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string | undefined>(undefined);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    PK: string;
    name: string;
    email: string;
    avatar?: string;
  } | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const selectedConversationRef = useRef<string | null>(null);
  const conversationsRef = useRef<Conversation[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  // Keep ref in sync with state
  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messageList.length > 0 && !messagesLoading) {
      scrollToBottom();
    }
  }, [messageList, messagesLoading]);

  const selectedConv = conversations.find(
    (c) => c.chatId === selectedConversation
  );

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    // Handle sending message
    console.log("Before sending - selectedConversation:", selectedConversation);
    await sendMessage(selectedConversation!, userId, message.trim());
    console.log("After sending - selectedConversation:", selectedConversation);

    setMessage("");
    // Scroll to bottom after sending
    setTimeout(scrollToBottom, 100);
  }

  const handleSelectConversation = async (id: string) => {
    if (id === selectedConversation) return;
    setSelectedConversation(id);
    // On mobile, hide sidebar when selecting a conversation
    setShowSidebar(false);
    setMessagesLoading(true);
    setMessageList([]);
    try {
      const messageList = await fetchMessageByChatId(id);
      setMessageList(messageList);
      console.log("Fetched messages for chatId", id, ":", messageList);
    } catch (error) {
      console.error("Error fetching messages for chatId", id, ":", error);
    } finally {
      setMessagesLoading(false);
    }
  };

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

  function handleOpenProfilePictureModal() {
    setOpenProfilePictureModal(true);
  }

  function handleCloseProfilePictureModal() {
    setOpenProfilePictureModal(false);
    setProfilePictureUrl("");
    setProfilePictureType("upload");
  }

  function handleSelectFile() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file ảnh");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Kích thước file không được vượt quá 5MB");
        return;
      }

      // Convert to base64 for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePictureUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSaveProfilePicture() {
    if (profilePictureUrl.trim()) {
      // TODO: Add API call to update profile picture
      console.log("Updating profile picture:");
      console.log("Type:", profilePictureType);
      console.log(
        "Data:",
        profilePictureType === "upload"
          ? "Base64 image data"
          : profilePictureUrl
      );
      try {
        const res = await uploadAvatar(
          userId,
          profilePictureUrl,
          profilePictureType
        );
        const avatarUrl = res.url;
        console.log("Avatar updated. URL:", avatarUrl);
        setUserAvatar(avatarUrl);

        // if (profilePictureType === "upload") {
        //   await uploadProfilePicture(userId, profilePictureUrl); // base64 data
        // } else {
        //   await updateProfilePictureUrl(userId, profilePictureUrl); // URL
        // }
        handleCloseProfilePictureModal();
      } catch (error) {
        console.error("Error updating profile picture:", error);
      }
    }
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

  async function handleSearch(query: string) {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      // TODO: Replace with actual API call to search users
      // import { searchUsers } from "../../services/user";
      // const results = await searchUsers(query);

      // Mock search results for now
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const res = await queryUsersByName(query);
      // Filter out the current user from search results
      setSearchResults(res.filter((user: any) => user.PK !== `USER#${userId}`));
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }

  async function handleUserSelect(PK: string) {
    const user = searchResults.find((u) => u.PK === PK);
    if (user) {
      const otherUserId = user.PK.slice(5);

      // Check if conversation already exists with this user
      const existingConv = conversations.find((conv) =>
        conv.users.includes(otherUserId)
      );

      if (existingConv) {
        // Navigate directly to existing conversation
        console.log(
          "Conversation already exists, navigating to:",
          existingConv.chatId
        );
        setSearchQuery("");
        setSearchResults([]);
        setActiveTab("chat");
        await handleSelectConversation(existingConv.chatId);
      } else {
        // Show confirmation modal for new conversation
        setSelectedUser(user);
        setOpenConfirmModal(true);
      }
    }
  }

  function handleCloseConfirmModal() {
    setOpenConfirmModal(false);
    setSelectedUser(null);
  }

  async function handleConfirmCreateConversation() {
    if (!selectedUser) return;

    try {
      const otherUserId = selectedUser.PK.slice(5);

      // Create new conversation
      console.log("Creating conversation with user:", selectedUser);
      const res = await createNewChat(userId, otherUserId);

      // Close modal and reset states
      handleCloseConfirmModal();
      setSearchQuery("");
      setSearchResults([]);
      setActiveTab("chat");

      const chats = await fetchAllChats(userId);
      // Sort conversations by lastSent descending (most recent first)
      setConversations(
        chats.sort(
          (a: Conversation, b: Conversation) => b.lastSent - a.lastSent
        )
      );
      await handleSelectConversation(res.conversationId);
    } catch (error) {
      console.error("Error creating conversation:", error);
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
        const data = await Promise.all([
          fetchUserData(uid),
          fetchAllChats(uid),
        ]);
        setUsername(data[0].name);
        setUserAvatar(data[0].avatar);
        setConversations(data[1]);
      } catch (error) {
        console.error("Error fetching username:", error);
      }
      setLoading(false);
    };
    fetchHomeData();
  }, []);

  // WebSocket connection for real-time messages
  useEffect(() => {
    if (!userId) return;

    // TODO: Replace with your actual WebSocket URL
    const WS_URL = `wss://za4oejdtm4.execute-api.ap-southeast-1.amazonaws.com/production?userId=${userId}`;

    // Create WebSocket connection
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected!");
      // Send authentication/join message
    };

    ws.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket message received:", data);

        const newMessage: Message = data;
        const chatId = newMessage.SK.slice(5);

        console.log(
          "Selected conversation id:",
          selectedConversationRef.current
        );
        console.log("New message chat id:", chatId);
        console.log("Match?: ", chatId === selectedConversationRef.current);

        // Check if the chat exists in the conversation list
        const chatExists = conversationsRef.current.find(
          (conv) => conv.chatId === chatId
        );

        if (!chatExists) {
          console.log("Chat not found in conversation list, refetching...");
          // Refetch conversation list
          const chats = await fetchAllChats(userId);
          setConversations(
            chats.sort(
              (a: Conversation, b: Conversation) => b.lastSent - a.lastSent
            )
          );

          // If this is the selected conversation, refetch messages
          if (chatId === selectedConversationRef.current) {
            const messages = await fetchMessageByChatId(chatId);
            setMessageList(messages);
          }
        } else {
          // Chat exists, update normally
          if (chatId === selectedConversationRef.current) {
            console.log("New message for current conversation:", newMessage);
            setMessageList((prev) => [...prev, newMessage]);
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
            // Sort by lastSent descending (most recent first)
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
      console.log("WebSocket disconnected!");
    };

    // Cleanup function
    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [userId]);

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
            </TabList>
          </Tabs>
        </Box>

        {/* Tab Content */}
        {activeTab === "chat" && (
          <List sx={styles.conversationList}>
            {conversations.map((conv) => (
              <ListItem key={conv.chatId} sx={styles.listItem}>
                <ListItemButton
                  selected={selectedConversation === conv.chatId}
                  onClick={() => handleSelectConversation(conv.chatId)}
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
                        <Typography
                          level="body-xs"
                          sx={styles.conversationTimestamp}
                        >
                          {new Date(conv.lastSent).toLocaleTimeString()}
                        </Typography>
                      )}
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
          <Box sx={styles.searchTabContent}>
            <Box sx={styles.searchBarContainer}>
              <Input
                placeholder="Tìm kiếm theo tên..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                sx={styles.searchInput}
                startDecorator={<Typography>🔍</Typography>}
              />
            </Box>

            {searchLoading ? (
              <Box sx={styles.searchLoadingContainer}>
                <CircularProgress size="sm" />
              </Box>
            ) : searchQuery && searchResults.length === 0 ? (
              <Box sx={styles.emptySearchResults}>
                <Typography level="body-md" sx={{ color: "text.secondary" }}>
                  Không tìm thấy kết quả nào
                </Typography>
              </Box>
            ) : searchResults.length > 0 ? (
              <List sx={styles.searchResultsList}>
                {searchResults.map((user) => (
                  <ListItem key={user.PK} sx={styles.listItem}>
                    <ListItemButton
                      onClick={() => handleUserSelect(user.PK)}
                      sx={styles.listItemButton}
                    >
                      <Box sx={styles.avatarContainer}>
                        <Avatar src={user.avatar} sx={styles.avatar}>
                          {!user.avatar && user.name[0].toUpperCase()}
                        </Avatar>
                      </Box>
                      <ListItemContent sx={styles.listItemContent}>
                        <Typography
                          level="title-md"
                          sx={styles.conversationName}
                        >
                          {user.name}
                        </Typography>
                        <Typography
                          level="body-sm"
                          sx={{ color: "text.secondary" }}
                        >
                          {user.email}
                        </Typography>
                      </ListItemContent>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={styles.emptyTabContent}>
                <Typography level="h4" sx={styles.emptyTabTitle}>
                  🔍 Tìm kiếm người dùng
                </Typography>
                <Typography level="body-sm" sx={styles.emptyTabSubtitle}>
                  Nhập tên để tìm kiếm
                </Typography>
              </Box>
            )}
          </Box>
        )}

        <Divider sx={styles.divider} />

        {/* User Card */}
        <Dropdown>
          <MenuButton sx={styles.menuButton}>
            <Box sx={styles.userCardContainer}>
              <Avatar size="lg" src={userAvatar} sx={styles.userAvatar}>
                {!userAvatar && (username?.[0]?.toUpperCase() || "U")}
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
              onClick={handleOpenProfilePictureModal}
              sx={styles.menuItem}
            >
              🖼️ Thay đổi ảnh đại diện
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
              <Avatar src={selectedConv.avatar} sx={styles.chatHeaderAvatar}>
                {!selectedConv.avatar &&
                  selectedConv.senderName[0].toUpperCase()}
              </Avatar>
              <Box sx={styles.chatHeaderContent}>
                <Typography level="title-lg" sx={styles.chatHeaderTitle}>
                  {selectedConv.senderName}
                </Typography>
              </Box>
            </Sheet>

            {/* Messages Area */}
            <Box sx={styles.messagesArea}>
              {messagesLoading ? (
                <Box sx={styles.messagesLoadingContainer}>
                  <CircularProgress />
                </Box>
              ) : (
                messageList.map((msg) => (
                  <Box
                    key={msg.PK}
                    sx={styles.messageContainer(msg.senderId === userId)}
                  >
                    <Box sx={styles.messageContent}>
                      {!(msg.senderId === userId) && (
                        <Typography level="body-xs" sx={styles.messageSender}>
                          {selectedConv.senderName}
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
                        {new Date(msg.sentAt).toLocaleTimeString()}
                      </Typography>
                    </Box>
                  </Box>
                ))
              )}
              <div ref={messagesEndRef} />
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
        <ModalDialog sx={styles.modalDialog}>
          <Typography level="h4" sx={styles.modalTitle}>
            📝 Thay đổi tên hiển thị
          </Typography>
          <Input
            placeholder="Nhập tên hiển thị mới"
            value={newDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
            sx={styles.modalInput}
            autoFocus
          />
          <Box sx={styles.modalActions}>
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

      {/* Change Profile Picture Modal */}
      <Modal
        open={openProfilePictureModal}
        onClose={handleCloseProfilePictureModal}
      >
        <ModalDialog sx={styles.modalDialog}>
          <Typography level="h4" sx={styles.modalTitle}>
            🖼️ Thay đổi ảnh đại diện
          </Typography>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <Tabs
            value={profilePictureType}
            onChange={(_, newValue) => {
              setProfilePictureType(newValue as "upload" | "url");
              setProfilePictureUrl("");
            }}
          >
            <TabList>
              <Tab value="upload">📁 Tải lên</Tab>
              <Tab value="url">🔗 URL</Tab>
            </TabList>

            <Box sx={{ mt: 2 }}>
              {profilePictureType === "upload" ? (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleSelectFile}
                  fullWidth
                  size="lg"
                >
                  Chọn ảnh từ máy tính
                </Button>
              ) : (
                <Input
                  placeholder="Nhập URL ảnh đại diện"
                  value={profilePictureUrl}
                  onChange={(e) => setProfilePictureUrl(e.target.value)}
                  size="lg"
                  autoFocus
                />
              )}
            </Box>
          </Tabs>

          {profilePictureUrl && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <Avatar
                src={profilePictureUrl}
                sx={{ width: 100, height: 100 }}
              />
            </Box>
          )}
          <Box sx={styles.modalActions}>
            <Button
              variant="plain"
              color="neutral"
              onClick={handleCloseProfilePictureModal}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSaveProfilePicture}
              disabled={!profilePictureUrl.trim()}
            >
              Lưu
            </Button>
          </Box>
        </ModalDialog>
      </Modal>

      {/* Confirm Create Conversation Modal */}
      <Modal open={openConfirmModal} onClose={handleCloseConfirmModal}>
        <ModalDialog sx={styles.modalDialog}>
          <Typography level="h4" sx={styles.modalTitle}>
            💬 Tạo cuộc trò chuyện
          </Typography>
          {selectedUser && (
            <Box sx={styles.confirmModalContent}>
              <Box sx={styles.confirmModalUserContainer}>
                <Avatar
                  src={selectedUser.avatar}
                  sx={styles.confirmModalAvatar}
                >
                  {!selectedUser.avatar && selectedUser.name[0].toUpperCase()}
                </Avatar>
                <Box>
                  <Typography level="title-lg" sx={styles.confirmModalUserName}>
                    {selectedUser.name}
                  </Typography>
                  <Typography level="body-sm" sx={styles.confirmModalUserEmail}>
                    {selectedUser.email}
                  </Typography>
                </Box>
              </Box>
              <Typography level="body-md" sx={styles.confirmModalMessage}>
                Bạn có muốn bắt đầu cuộc trò chuyện với người dùng này?
              </Typography>
            </Box>
          )}
          <Box sx={styles.modalActions}>
            <Button
              variant="plain"
              color="neutral"
              onClick={handleCloseConfirmModal}
            >
              Hủy
            </Button>
            <Button onClick={handleConfirmCreateConversation}>
              Tạo cuộc trò chuyện
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </Box>
  );
}
