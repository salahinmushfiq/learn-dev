export default {
  id: "rbac_flow",
  title: "RBAC System",
  startNode: "login",

  nodes: {
    login: {
      id: "login",
      title: "Login",
      next: "role_detect",
      effect: "SET_ROLE_ORGANIZER"
    },

    role_detect: {
      id: "role_detect",
      title: "Role Detection",
      next: "permission_check"
    },

    permission_check: {
      id: "permission_check",
      title: "Permission Check",
      next: "dashboard",
      effect: "CHECK_PERMISSION"
    },

    dashboard: {
      id: "dashboard",
      title: "Dashboard Access",
      next: null
    }
  }
};