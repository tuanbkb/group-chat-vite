import type { SxProps } from "@mui/joy/styles/types";

export const containerStyles: SxProps = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  p: 2,
  bgcolor: "background.body",
};

export const sheetStyles: SxProps = {
  width: "100%",
  maxWidth: 440,
  p: 4,
  borderRadius: "xl",
  boxShadow: "lg",
  bgcolor: "background.surface",
};

export const headerBoxStyles: SxProps = {
  textAlign: "center",
  mb: 3,
};

export const titleStyles: SxProps = {
  fontWeight: 700,
  color: "primary.500",
};

export const formControlStyles: SxProps = {
  mb: 2,
};

export const inputStyles: SxProps = {
  borderRadius: "md",
  "&:focus-within": {
    boxShadow: "0 0 0 2px var(--joy-palette-primary-200)",
  },
};

export const forgotPasswordBoxStyles: SxProps = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  mb: 2,
};

export const errorTextStyles: SxProps = {
  mb: 2,
  textAlign: "center",
  p: 1.5,
  borderRadius: "md",
  bgcolor: "danger.softBg",
};

export const submitButtonStyles: SxProps = {
  borderRadius: "md",
  py: 1.25,
  transition: "all 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "md",
  },
  "&:active": {
    transform: "translateY(0)",
  },
};

export const footerBoxStyles: SxProps = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  mt: 3,
  gap: 0.5,
};

export const linkStyles = {
  textDecoration: "none",
};
