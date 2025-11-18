import { CircularProgress } from "@mui/joy";
import Avatar from "@mui/joy/Avatar";
import Divider from "@mui/joy/Divider";
import {
  MdChat,
  MdSend,
  MdUploadFile,
  MdLink,
  MdEdit,
  MdImage,
  MdSearch,
} from "react-icons/md";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
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
import type { Conversation, Message } from "./types";
import ConversationList from "./components/ConversationList";
import SearchTab from "./components/SearchTab";
import UserCard from "./components/UserCard";
import { ChatHeader, MessageList } from "./components/ChatArea";
import { useWebSocket } from "./hooks/useWebSocket";
import * as styles from "./styles";

export default function HomeScreen() {
  useEffect(() => {
    document.title = "AWS Chat App - Trang chủ";
  }, []);
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
  const [creatingConversation, setCreatingConversation] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    PK: string;
    name: string;
    email: string;
    avatar?: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  // WebSocket hook for real-time messages
  useWebSocket({
    userId,
    selectedConversation,
    conversations,
    setConversations,
    setMessageList,
  });

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

    const messageText = message.trim();
    const tempMessage: Message = {
      PK: `temp_${Date.now()}`,
      SK: `CHAT#${selectedConversation}`,
      data: messageText,
      senderId: userId,
      sentAt: Date.now(),
    };

    // Add message to UI immediately for instant feedback
    setMessageList((prev) => [...prev, tempMessage]);
    setMessage("");

    // Handle sending message
    await sendMessage(selectedConversation!, userId, messageText);

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
      const messages = await fetchMessageByChatId(id);
      setMessageList(messages);
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
      try {
        const res = await uploadAvatar(
          userId,
          profilePictureUrl,
          profilePictureType
        );
        const avatarUrl = res.url;
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
    setCreatingConversation(false);
  }

  async function handleConfirmCreateConversation() {
    if (!selectedUser || creatingConversation) return;

    try {
      setCreatingConversation(true);
      const otherUserId = selectedUser.PK.slice(5);

      // Create new conversation
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
    } finally {
      setCreatingConversation(false);
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
        <Box
          sx={{
            ...styles.header,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
          }}
        >
          <img
            src="/logo.svg"
            alt="Chat App Logo"
            style={{ width: 40, height: 40 }}
          />
          <Typography level="h3" color="primary" sx={styles.headerTitle}>
            AWS Chat App
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
                <MdChat style={{ marginRight: 6 }} /> Trò chuyện
              </Tab>
              <Tab value="search" sx={styles.tab}>
                <MdSearch style={{ marginRight: 6 }} /> Tìm kiếm
              </Tab>
            </TabList>
          </Tabs>
        </Box>

        {/* Tab Content */}
        {activeTab === "chat" && (
          <ConversationList
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelectConversation={handleSelectConversation}
          />
        )}

        {activeTab === "search" && (
          <SearchTab
            searchQuery={searchQuery}
            searchResults={searchResults}
            searchLoading={searchLoading}
            onSearch={handleSearch}
            onUserSelect={handleUserSelect}
          />
        )}

        <Divider sx={styles.divider} />

        {/* User Card */}
        <UserCard
          username={username}
          userAvatar={userAvatar}
          onOpenNameModal={handleOpenNameModal}
          onOpenProfilePictureModal={handleOpenProfilePictureModal}
        />
      </Sheet>

      {/* Right Panel - Chat Area */}
      <Box sx={styles.rightPanel(showSidebar)}>
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <ChatHeader conversation={selectedConv} onBack={handleBackToList} />

            {/* Messages Area */}
            <MessageList
              messages={messageList}
              userId={userId}
              senderName={selectedConv.senderName}
              loading={messagesLoading}
              messagesEndRef={messagesEndRef}
            />

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
                    <MdSend />
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
            <MdEdit style={{ marginRight: 8 }} /> Thay đổi tên hiển thị
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
            <MdImage style={{ marginRight: 8 }} /> Thay đổi ảnh đại diện
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
              <Tab value="upload">
                <MdUploadFile style={{ marginRight: 6 }} /> Tải lên
              </Tab>
              <Tab value="url">
                <MdLink style={{ marginRight: 6 }} /> URL
              </Tab>
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
            <MdChat style={{ marginRight: 8 }} /> Tạo cuộc trò chuyện
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
              disabled={creatingConversation}
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmCreateConversation}
              loading={creatingConversation}
              disabled={creatingConversation}
            >
              Tạo cuộc trò chuyện
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </Box>
  );
}
