import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  user: {
    additionalFields: {
      role: {
        type: "string",
        input: true,
        defaultValue: "user",
      },
    },
  },
});
