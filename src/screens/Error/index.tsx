import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import { useEffect } from "react";

export default function ErrorScreen() {
  useEffect(() => {
    document.title = "Không tìm thấy trang";
  }, []);
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        bgcolor: "background.body",
        textAlign: "center",
      }}
    >
      <Typography level="h1" sx={{ fontSize: "6rem", fontWeight: "bold" }}>
        404
      </Typography>
      <Typography level="h4" sx={{ mb: 1 }}>
        Không tìm thấy trang
      </Typography>
      <Typography level="body-md" sx={{ mb: 3, color: "text.secondary" }}>
        Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
      </Typography>
      <Button onClick={() => (window.location.href = "/")}>
        Quay về trang chủ
      </Button>
    </Box>
  );
}
