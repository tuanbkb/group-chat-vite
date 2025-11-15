import { createBrowserRouter } from "react-router";
import ConfirmSignUpScreen from "../screens/auth/ConfirmSignUp";
import ForgetPasswordScreen from "../screens/auth/ForgetPassword";
import SignInScreen from "../screens/auth/SignIn";
import SignUpScreen from "../screens/auth/SignUp";
import ErrorScreen from "../screens/Error";
import HomeScreen from "../screens/Home";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicRoute } from "./PublicRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: () => (
      <ProtectedRoute>
        <HomeScreen />
      </ProtectedRoute>
    ),
  },
  {
    path: "/signin",
    Component: () => (
      <PublicRoute>
        <SignInScreen />
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    Component: () => (
      <PublicRoute>
        <SignUpScreen />
      </PublicRoute>
    ),
  },
  {
    path: "/confirm-signup",
    Component: () => (
      <PublicRoute>
        <ConfirmSignUpScreen />
      </PublicRoute>
    ),
  },
  {
    path: "/forget-password",
    Component: () => (
      <PublicRoute>
        <ForgetPasswordScreen />
      </PublicRoute>
    ),
  },
  {
    path: "*",
    Component: ErrorScreen,
  },
]);
