import { Authenticator } from "@aws-amplify/ui-react";
import "@fontsource/inter";
import { Amplify } from "aws-amplify";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_USER_POOL_ID || "",
      userPoolClientId: import.meta.env.VITE_USER_CLIENT_ID || "",
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: "code",
      userAttributes: {
        email: {
          required: true,
        },
        name: {
          required: true,
        },
      },
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: false,
        requireNumbers: true,
        requireSpecialCharacters: false,
      },
    },
  },
  API: {
    REST: {
      chatApi: {
        endpoint: import.meta.env.VITE_API_ENDPOINT || "",
        region: import.meta.env.VITE_API_REGION || "",
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <Authenticator.Provider>
    <App />
  </Authenticator.Provider>
);
