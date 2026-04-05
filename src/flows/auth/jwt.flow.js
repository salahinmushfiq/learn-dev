export default {
  id: "jwt_flow",
  title: "JWT Authentication Lifecycle",
  startNode: "login",

  nodes: {
    login: {
      id: "login",
      title: "User Login",
      next: "token_issue",
      effect: "SET_USER"
    },

    token_issue: {
      id: "token_issue",
      title: "JWT Issued",
      next: "auth_request",
      effect: "ISSUE_TOKENS"
    },

    auth_request: {
      id: "auth_request",
      title: "Authenticated Request",
      next: "token_expiry",
      effect: "API_CALL"
    },

    token_expiry: {
      id: "token_expiry",
      title: "Token Expired",
      next: "refresh_token",
      effect: "EXPIRE_TOKEN"
    },

    refresh_token: {
      id: "refresh_token",
      title: "Refresh Token Flow",
      next: "logout",
      effect: "REFRESH_TOKEN"
    },

    logout: {
      id: "logout",
      title: "Logout",
      next: null,
      effect: "CLEAR_SESSION"
    }
  }
};