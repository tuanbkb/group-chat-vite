import { useAuthenticator } from "@aws-amplify/ui-react";
import { Navigate } from "react-router";

type PublicRouteProps = {
  children: React.ReactNode;
};

export function PublicRoute({ children }: PublicRouteProps) {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  if (authStatus === "configuring") {
    return <div>Loading...</div>;
  }

  if (authStatus === "authenticated") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
