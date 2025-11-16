import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router";
import * as styles from "./styles";

type ForgetPasswordForm = {
  email: string;
};

export default function ForgetPasswordScreen() {
  useEffect(() => {
    document.title = "Quên mật khẩu";
  }, []);
  const [form, setForm] = useState<ForgetPasswordForm>({
    email: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
  }>({});

  function update<K extends keyof ForgetPasswordForm>(
    key: K,
    value: ForgetPasswordForm[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setSuccess(null);

    const nextErrors: { email?: string } = {};
    // Basic email validation
    if (!form.email) {
      nextErrors.email = "Vui lòng nhập email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Vui lòng nhập địa chỉ email hợp lệ.";
    }
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setLoading(true);
      // Placeholder for real password reset logic.
      // Replace this with your auth call (Amplify, Firebase, custom API, etc.).
      await new Promise((resolve) => setTimeout(resolve, 700));
      console.log("Password reset requested for", form.email);
      setSuccess(
        "Đã gửi liên kết đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư."
      );
      // Clear form
      setForm({ email: "" });
    } catch (err) {
      console.error(err);
      setError("Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={styles.containerStyles}>
      <Sheet variant="outlined" sx={styles.sheetStyles}>
        <Box sx={styles.headerBoxStyles}>
          <Typography level="h3" component="h1" sx={styles.titleStyles}>
            🔑 Quên mật khẩu
          </Typography>
          <Typography level="body-md" sx={{ mt: 1, color: "text.secondary" }}>
            Nhập email của bạn và chúng tôi sẽ gửi cho bạn liên kết để đặt lại
            mật khẩu.
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <FormControl
            sx={styles.formControlStyles}
            error={Boolean(fieldErrors.email)}
          >
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={(e) => {
                const val = e.target.value;
                update("email", val);
                if (fieldErrors.email)
                  setFieldErrors((v) => ({ ...v, email: undefined }));
                if (error) setError(null);
                if (success) setSuccess(null);
              }}
              required
              sx={styles.inputStyles}
            />
            {fieldErrors.email && (
              <FormHelperText>{fieldErrors.email}</FormHelperText>
            )}
          </FormControl>

          {error && (
            <Typography
              color="danger"
              level="body-sm"
              sx={styles.errorTextStyles}
              role="alert"
            >
              {error}
            </Typography>
          )}

          {success && (
            <Typography
              color="success"
              level="body-sm"
              sx={styles.successTextStyles}
              role="alert"
            >
              {success}
            </Typography>
          )}

          <Button
            type="submit"
            loading={loading}
            fullWidth
            sx={styles.submitButtonStyles}
          >
            Gửi liên kết đặt lại
          </Button>

          <Box sx={styles.footerBoxStyles}>
            <NavLink to="/signin" style={styles.linkStyles}>
              <Typography
                level="body-md"
                color="primary"
                sx={{ fontWeight: 600 }}
              >
                Quay lại đăng nhập
              </Typography>
            </NavLink>
          </Box>
        </form>
      </Sheet>
    </Box>
  );
}
