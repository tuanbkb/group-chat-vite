import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Typography from "@mui/joy/Typography";
import { MdEdit, MdImage, MdLogout } from "react-icons/md";
import { signOut } from "aws-amplify/auth";
import * as styles from "../styles";

type UserCardProps = {
  username: string | null;
  userAvatar: string | undefined;
  onOpenNameModal: () => void;
  onOpenProfilePictureModal: () => void;
};

export default function UserCard({
  username,
  userAvatar,
  onOpenNameModal,
  onOpenProfilePictureModal,
}: UserCardProps) {
  return (
    <>
      <Divider sx={styles.divider} />
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
          <MenuItem onClick={onOpenNameModal} sx={styles.menuItem}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <MdEdit style={{ marginRight: 8 }} /> Thay đổi tên hiển thị
            </Box>
          </MenuItem>
          <MenuItem onClick={onOpenProfilePictureModal} sx={styles.menuItem}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <MdImage style={{ marginRight: 8 }} /> Thay đổi ảnh đại diện
            </Box>
          </MenuItem>
          <MenuItem
            onClick={() => signOut()}
            color="danger"
            sx={styles.menuItem}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <MdLogout style={{ marginRight: 8 }} /> Đăng xuất
            </Box>
          </MenuItem>
        </Menu>
      </Dropdown>
    </>
  );
}
