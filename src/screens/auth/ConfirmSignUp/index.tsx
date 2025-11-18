import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import { confirmSignUp, resendSignUpCode, signIn } from "aws-amplify/auth";
import React, { useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router";
import { MdEmail, MdCheckCircle } from "react-icons/md";
import * as styles from "./styles";

export default function ConfirmSignUpScreen() {
  useEffect(() => {
    document.title = "Xác nhận tài khoản";
  }, []);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const password = searchParams.get("password") || "";

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    code?: string;
  }>({});

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setResendSuccess(false);

    const nextErrors: {
      code?: string;
    } = {};

    // Validation
    if (!email) {
      setError("Email không hợp lệ. Vui lòng đăng ký lại.");
      return;
    }
    if (!password) {
      setError("Thông tin không hợp lệ. Vui lòng đăng ký lại.");
      return;
    }
    if (!code) {
      nextErrors.code = "Vui lòng nhập mã xác nhận.";
    } else if (code.length !== 6) {
      nextErrors.code = "Mã xác nhận phải có 6 chữ số.";
    }

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setLoading(true);
      // Placeholder for real auth logic.
      // Replace this with your auth call (e.g., AWS Amplify confirmSignUp)
      // import { confirmSignUp } from "aws-amplify/auth";
      await confirmSignUp({ username: email, confirmationCode: code });

      await signIn({ username: email, password: password });
    } catch (err: any) {
      console.error(err);
      if (err.name === "InvalidLambdaResponseException") {
        setError("Xác nhận thất bại do lỗi máy chủ. Vui lòng thử lại sau.");
      } else setError("Xác nhận thất bại. Vui lòng kiểm tra mã và thử lại.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendCode() {
    setError(null);
    setResendSuccess(false);

    if (!email) {
      setError("Email không hợp lệ. Vui lòng đăng ký lại.");
      return;
    }

    try {
      setResendLoading(true);
      // Placeholder for real auth logic.
      // Replace this with your auth call (e.g., AWS Amplify resendSignUpCode)
      // import { resendSignUpCode } from "aws-amplify/auth";
      await resendSignUpCode({ username: email });

      setResendSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Không thể gửi lại mã. Vui lòng thử lại.");
    } finally {
      setResendLoading(false);
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
              <MdEmail style={{ marginRight: 8 }} /> Xác nhận tài khoản
            </Box>
          </Typography>
          <Typography level="body-md" sx={{ mt: 1, color: "text.secondary" }}>
            Mã xác nhận đã được gửi đến email: <strong>{email}</strong>
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <FormControl
            sx={styles.formControlStyles}
            error={Boolean(fieldErrors.code)}
          >
            <FormLabel>Mã xác nhận</FormLabel>
            <Input
              type="text"
              placeholder="123456"
              value={code}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                setCode(val);
                if (fieldErrors.code)
                  setFieldErrors((v) => ({ ...v, code: undefined }));
              }}
              required
              sx={styles.inputStyles}
              slotProps={{
                input: {
                  maxLength: 6,
                },
              }}
            />
            {fieldErrors.code && (
              <FormHelperText>{fieldErrors.code}</FormHelperText>
            )}
            <FormHelperText>
              Mã gồm 6 chữ số được gửi đến email của bạn
            </FormHelperText>
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

          {resendSuccess && (
            <Typography
              color="success"
              level="body-sm"
              sx={styles.successTextStyles}
              role="status"
            >
              <MdCheckCircle
                style={{ marginRight: 4, verticalAlign: "middle" }}
              />{" "}
              Mã xác nhận đã được gửi lại thành công!
            </Typography>
          )}

          <Button
            type="submit"
            loading={loading}
            fullWidth
            sx={styles.submitButtonStyles}
          >
            Xác nhận
          </Button>
        </form>

        <Box sx={styles.resendBoxStyles}>
          <Typography level="body-sm" sx={{ color: "text.secondary" }}>
            Không nhận được mã?
          </Typography>
          <Button
            variant="plain"
            color="primary"
            onClick={handleResendCode}
            loading={resendLoading}
            sx={styles.resendButtonStyles}
          >
            Gửi lại mã
          </Button>
        </Box>

        <Box sx={styles.footerBoxStyles}>
          <Typography level="body-md">Đã xác nhận?</Typography>
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
