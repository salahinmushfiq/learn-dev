//src/data/flows/auth/jwt.flow.js
export default {
  id: "jwt_flow",
  title: "Auth + RBAC + Profile (Parallel)",
  startNode: "login",

  nodes: {
    login: {
      id: "login",
      title: "User Login",
      meta: { service: "auth" },
      run: (s) => ({
        ...s,
        userId: 1,
        token: "jwt_token",
      }),
      next: "parallel_auth",
    },

    parallel_auth: {
      id: "parallel_auth",
      title: "Parallel Auth Services",
      type: "parallel",
      meta: { service: "system" },
      next: ["fetch_profile", "check_permissions", "init_session"],
    },

    fetch_profile: {
      id: "fetch_profile",
      title: "Fetch Profile",
      meta: { service: "api", delay: 700 },
      run: (s) => ({
        ...s,
        profile: { name: "User", role: "admin" },
      }),
      next: "merge_auth",
    },

    check_permissions: {
      id: "check_permissions",
      title: "RBAC Check",
      meta: { service: "auth", delay: 1000 },
      run: (s) => ({
        ...s,
        permissionGranted: true,
      }),
      next: "merge_auth",
    },

    init_session: {
      id: "init_session",
      title: "Initialize Session",
      meta: { service: "frontend", delay: 400 },
      run: (s) => ({
        ...s,
        sessionReady: true,
      }),
      next: "merge_auth",
    },

    merge_auth: {
      id: "merge_auth",
      title: "Merge Auth State",
      type: "join",
      waitFor: ["fetch_profile", "check_permissions", "init_session"],
      meta: { service: "system" },
      run: (s) => ({
        ...s,
        authenticated: true,
      }),
      next: "dashboard",
    },

    dashboard: {
      id: "dashboard",
      title: "Load Dashboard",
      meta: { service: "frontend" },
      run: (s) => ({
        ...s,
        dashboardLoaded: true,
      }),
      next: null,
    },
  },
};