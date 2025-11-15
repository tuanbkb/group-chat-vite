import { useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

type PublicRouteProps = {
  children: React.ReactNode;
};

export function PublicRoute({ children }: PublicRouteProps) {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const navigate = useNavigate();

  useEffect(() => {
    if (authStatus === "authenticated") {
      navigate("/", { replace: true });
    }
  }, [authStatus, navigate]);

  if (authStatus === "configuring") {
    return <div>Loading...</div>;
  }

  if (authStatus === "authenticated") {
    return null;
  }

  return <>{children}</>;
}
