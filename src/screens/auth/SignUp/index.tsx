import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import * as styles from "./styles";
import { signUp } from "aws-amplify/auth";

type SignUpForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignUpScreen() {
  useEffect(() => {
    document.title = "Đăng ký";
  }, []);
  const navigate = useNavigate();
  const [form, setForm] = useState<SignUpForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  function update<K extends keyof SignUpForm>(key: K, value: SignUpForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);

    const nextErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    // Validation
    if (!form.name) {
      nextErrors.name = "Vui lòng nhập tên.";
    }
    if (!form.email) {
      nextErrors.email = "Vui lòng nhập email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Vui lòng nhập địa chỉ email hợp lệ.";
    }
    if (!form.password) {
      nextErrors.password = "Vui lòng nhập mật khẩu.";
    } else if (form.password.length < 8) {
      nextErrors.password = "Mật khẩu phải có ít nhất 8 ký tự.";
    } else if (!/[a-z]/.test(form.password) || !/[0-9]/.test(form.password)) {
      nextErrors.password =
        "Mật khẩu phải chứa ít nhất 1 chữ thường và 1 chữ số.";
    }
    if (!form.confirmPassword) {
      nextErrors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
    } else if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = "Mật khẩu không khớp.";
    }

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setLoading(true);
      // Placeholder for real auth logic.
      // Replace this with your auth call (Amplify, Firebase, custom API, etc.).
      // import { signUp } from "aws-amplify/auth";
      const res = await signUp({
        username: form.email,
        password: form.password,
        options: { userAttributes: { name: form.name } },
      });
      console.log("Signing up with", form);
      console.log("Sign up response:", res);
      // On success: redirect to confirm signup screen
      navigate(
        `/confirm-signup?email=${encodeURIComponent(form.email)}&password=${encodeURIComponent(form.password)}`
      );
    } catch (err: any) {
      console.error(err);
      if (err.name === "UsernameExistsException") {
        setError("Email này đã được sử dụng. Vui lòng sử dụng email khác.");
      } else if (err.name === "InvalidPasswordException") {
        setError("Mật khẩu không đáp ứng yêu cầu bảo mật.");
      } else setError("Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={styles.containerStyles}>
      <Sheet variant="outlined" sx={styles.sheetStyles}>
        <Box sx={styles.headerBoxStyles}>
          <Typography level="h3" component="h1" sx={styles.titleStyles}>
            🚀 Tạo tài khoản
          </Typography>
          <Typography level="body-md" sx={{ mt: 1, color: "text.secondary" }}>
            Bắt đầu hành trình của bạn với chúng tôi ngay hôm nay.
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <FormControl
            sx={styles.formControlStyles}
            error={Boolean(fieldErrors.name)}
          >
            <FormLabel>Tên</FormLabel>
            <Input
              type="text"
              placeholder="Nguyễn Văn A"
              value={form.name}
              onChange={(e) => {
                const val = e.target.value;
                update("name", val);
                if (fieldErrors.name)
                  setFieldErrors((v) => ({ ...v, name: undefined }));
              }}
              required
              sx={styles.inputStyles}
            />
            {fieldErrors.name && (
              <FormHelperText>{fieldErrors.name}</FormHelperText>
            )}
          </FormControl>

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
              placeholder="Tối thiểu 8 ký tự"
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

          <FormControl
            sx={styles.formControlStyles}
            error={Boolean(fieldErrors.confirmPassword)}
          >
            <FormLabel>Xác nhận mật khẩu</FormLabel>
            <Input
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={form.confirmPassword}
              onChange={(e) => {
                const val = e.target.value;
                update("confirmPassword", val);
                if (fieldErrors.confirmPassword)
                  setFieldErrors((v) => ({ ...v, confirmPassword: undefined }));
              }}
              required
              sx={styles.inputStyles}
            />
            {fieldErrors.confirmPassword && (
              <FormHelperText>{fieldErrors.confirmPassword}</FormHelperText>
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

          <Button
            type="submit"
            loading={loading}
            fullWidth
            sx={styles.submitButtonStyles}
          >
            Đăng ký
          </Button>
        </form>

        <Box sx={styles.footerBoxStyles}>
          <Typography level="body-md">Đã có tài khoản?</Typography>
          <NavLink to="/signin" style={styles.linkStyles}>
            <Typography
              level="body-md"
              color="primary"
              sx={{ fontWeight: 600 }}
            >
              Đăng nhập
            </Typography>
          </NavLink>
        </Box>
      </Sheet>
    </Box>
  );
}
