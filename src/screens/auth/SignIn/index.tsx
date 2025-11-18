import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import { resendSignUpCode, signIn } from "aws-amplify/auth";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { MdLogin } from "react-icons/md";
import * as styles from "./styles";

type SignInForm = {
  email: string;
  password: string;
  remember: boolean;
};

export default function SignInScreen() {
  useEffect(() => {
    document.title = "Đăng nhập";
  }, []);
  const navigate = useNavigate();
  const [form, setForm] = useState<SignInForm>({
    email: "",
    password: "",
    remember: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  function update<K extends keyof SignInForm>(key: K, value: SignInForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);

    const nextErrors: { email?: string; password?: string } = {};
    // Basic email validation
    if (!form.email) {
      nextErrors.email = "Vui lòng nhập email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Vui lòng nhập địa chỉ email hợp lệ.";
    }
    if (!form.password) {
      nextErrors.password = "Vui lòng nhập mật khẩu.";
    }
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setLoading(true);
      const signInRes = await signIn({
        username: form.email,
        password: form.password,
      });
      if (signInRes.nextStep?.signInStep === "CONFIRM_SIGN_UP") {
        await resendSignUpCode({ username: form.email });
        navigate(
          `/confirm-signup?email=${encodeURIComponent(form.email)}&password=${encodeURIComponent(form.password)}`
        );
      }
    } catch (err) {
      console.error(err);
      setError("Sai thông tin đăng nhập. Vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={styles.containerStyles}>
      {/* Logo and App Name - Positioned at top of page */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <img
          src="/logo.svg"
          alt="AWS Chat App Logo"
          style={{ width: 40, height: 40, marginRight: 10 }}
        />
        <Typography
          level="h2"
          sx={{ fontWeight: "bold", color: "primary.main" }}
        >
          AWS Chat App
        </Typography>
      </Box>

      <Sheet variant="outlined" sx={styles.sheetStyles}>
        <Box sx={styles.headerBoxStyles}>
          <Typography level="h3" component="h1" sx={styles.titleStyles}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MdLogin style={{ marginRight: 8 }} /> Đăng nhập
            </Box>
          </Typography>
          <Typography level="body-md" sx={{ mt: 1, color: "text.secondary" }}>
            Chào mừng trở lại — vui lòng nhập thông tin của bạn.
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
              }}
              required
              sx={styles.inputStyles}
            />
            {fieldErrors.email && (
              <FormHelperText>{fieldErrors.email}</FormHelperText>
            )}
          </FormControl>

          <FormControl
            sx={styles.formControlStyles}
            error={Boolean(fieldErrors.password)}
          >
            <FormLabel>Mật khẩu</FormLabel>
            <Input
              type="password"
              placeholder="Mật khẩu của bạn"
              value={form.password}
              onChange={(e) => {
                const val = e.target.value;
                update("password", val);
                if (fieldErrors.password)
                  setFieldErrors((v) => ({ ...v, password: undefined }));
              }}
              required
              sx={styles.inputStyles}
            />
            {fieldErrors.password && (
              <FormHelperText>{fieldErrors.password}</FormHelperText>
            )}
          </FormControl>

          <Box sx={styles.forgotPasswordBoxStyles}>
            <NavLink to="/forget-password" style={styles.linkStyles}>
              <Typography
                level="body-md"
                color="primary"
                sx={{ fontWeight: 600 }}
              >
                Quên mật khẩu?
              </Typography>
            </NavLink>
          </Box>

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

          <Button
            type="submit"
            loading={loading}
            fullWidth
            sx={styles.submitButtonStyles}
          >
            Đăng nhập
          </Button>
        </form>

        <Box sx={styles.footerBoxStyles}>
          <Typography level="body-md">Chưa có tài khoản?</Typography>
          <NavLink to="/signup" style={styles.linkStyles}>
            <Typography
              level="body-md"
              color="primary"
              sx={{ fontWeight: 600 }}
            >
              Đăng ký
            </Typography>
          </NavLink>
        </Box>
      </Sheet>
    </Box>
  );
}
