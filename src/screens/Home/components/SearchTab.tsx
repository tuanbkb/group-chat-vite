import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import { CircularProgress } from "@mui/joy";
import Input from "@mui/joy/Input";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import { MdSearch } from "react-icons/md";
import type { SearchUser } from "../types";
import * as styles from "../styles";

type SearchTabProps = {
  searchQuery: string;
  searchResults: SearchUser[];
  searchLoading: boolean;
  onSearch: (query: string) => void;
  onUserSelect: (userId: string) => void;
};

export default function SearchTab({
  searchQuery,
  searchResults,
  searchLoading,
  onSearch,
  onUserSelect,
}: SearchTabProps) {
  return (
    <Box sx={styles.searchTabContent}>
      <Box sx={styles.searchBarContainer}>
        <Input
          placeholder="Tìm kiếm theo tên..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          sx={styles.searchInput}
          startDecorator={<MdSearch />}
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
                onClick={() => onUserSelect(user.PK)}
                sx={styles.listItemButton}
              >
                <Box sx={styles.avatarContainer}>
                  <Avatar src={user.avatar} sx={styles.avatar}>
                    {!user.avatar && user.name[0].toUpperCase()}
                  </Avatar>
                </Box>
                <ListItemContent sx={styles.listItemContent}>
                  <Typography level="title-md" sx={styles.conversationName}>
                    {user.name}
                  </Typography>
                  <Typography level="body-sm" sx={{ color: "text.secondary" }}>
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
            <MdSearch style={{ marginRight: 6 }} /> Tìm kiếm người dùng
          </Typography>
          <Typography level="body-sm" sx={styles.emptyTabSubtitle}>
            Nhập tên để tìm kiếm
          </Typography>
        </Box>
      )}
    </Box>
  );
}
