import { Authenticator } from "@aws-amplify/ui-react";
import "@fontsource/inter";
import { Amplify } from "aws-amplify";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "add later",
      userPoolClientId: "add later",
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
        endpoint: "add later",
        region: "add later",
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Authenticator.Provider>
      <App />
    </Authenticator.Provider>
  </StrictMode>
);
