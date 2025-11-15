import { useAuthenticator } from "@aws-amplify/ui-react";
import { Navigate } from "react-router";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  if (authStatus === "configuring") {
    return <div>Loading...</div>;
  }

  if (authStatus === "unauthenticated") {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}
