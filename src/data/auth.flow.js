//src/auth/flows.js
export const authFlow = [
  {
    id: "auth_request",
    label: "Authentication Request",
    type: "request",
    meta: { service: "react" },

    run: (state) => ({
      ...state,
      request: { type: "login", provider: "jwt" },
      client: { loading: true },
    }),
  },

  {
    id: "auth_validate",
    label: "Credential Validation",
    type: "middleware",
    meta: { service: "django" },

    run: (state) => {
      const success = true;

      return success
        ? {
            ...state,
            user: { id: 1, role: "tourist" },
          }
        : {
            ...state,
            error: "INVALID_CREDENTIALS",
          };
    },
  },

  {
    id: "auth_token_issue",
    label: "Token Issuance",
    type: "api",
    meta: { service: "django" },

    run: (state) => ({
      ...state,
      tokens: {
        access: "jwt_access",
        refresh: "jwt_refresh",
      },
    }),
  },

  {
    id: "auth_complete",
    label: "Authentication Complete",
    type: "terminal",
    meta: { service: "system" },

    run: (state) => ({
      ...state,
      status: "authenticated",
      client: { loading: false },
    }),
  },
];