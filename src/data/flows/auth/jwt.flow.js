//src/data/flows/auth/jwt.flow.js
export default {
  id: "jwt_flow",
  title: "JWT Auth Lifecycle",
  startNode: "login",
  nodes: {
    login: {
      id: "login",
      title: "User Login",
      meta: { service: "auth" },
      run: (s) => ({
        ...s,
        accessToken: "jwt_access_token",
        refreshToken: "jwt_refresh_token",
        user: { id: 1, role: "tourist" },
        status: "authenticated",
      }),
      next: "profile_fetch",
    },
    profile_fetch: {
      id: "profile_fetch",
      title: "Fetch User Profile",
      meta: { service: "api" },
      run: (s) => ({ ...s, profileLoaded: true }),
      next: "protected_request",
    },
    protected_request: {
      id: "protected_request",
      title: "Access Protected API",
      meta: { service: "api" },
      run: (s) => ({ ...s, lastAction: "fetch_bookings" }),
      next: "token_expired",
    },
    token_expired: {
      id: "token_expired",
      title: "Access Token Expired",
      meta: { service: "auth" },
      run: (s) => ({ ...s, status: "expired", error: "token_not_valid" }),
      next: "refresh",
    },
    refresh: {
      id: "refresh",
      title: "Refresh Token",
      meta: { service: "auth" },
      run: (s) => ({
        ...s,
        accessToken: "new_access_token",
        status: "refreshed",
      }),
      next: "retry_request",
    },
    retry_request: {
      id: "retry_request",
      title: "Retry (Axios Interceptor)",
      meta: { service: "frontend" },
      run: (s) => ({ ...s, retrySuccess: true }),
      next: "logout",
    },
    logout: {
      id: "logout",
      title: "Logout & Clear",
      meta: { service: "auth" },
      run: (s) => ({ ...s, accessToken: null, status: "logged_out" }),
      next: null,
    },
  },
};