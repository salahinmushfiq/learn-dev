// src/flows/auth/rbac.flow.js
export const rbacFlow = {
  id: "rbac_lifecycle",
  title: "RBAC Lifecycle",
  startNode: "login",
  nodes: {
    login: {
      id: "login",
      type: "task",
      title: "Authenticate",
      meta: { service: "auth" },
      run: (s) => ({ ...s, user: { role: "customer" } }),
      next: "check_permission",
    },

    check_permission: {
      id: "check_permission",
      type: "decision",
      title: "Check Role",
      meta: { service: "auth" },
      run: (s) => ({
        ...s,
        permissionGranted: s.user.role === "admin",
      }),
      next: {
        success: "access_granted",
        fail: "deny_access",
      },
    },

    deny_access: {
      id: "deny_access",
      type: "task",
      title: "Denied",
      meta: { service: "frontend" },
      run: (s) => ({ ...s, access: "denied" }),
      next: "role_upgrade",
    },

    role_upgrade: {
      id: "role_upgrade",
      type: "task",
      title: "Upgrade Role",
      meta: { service: "backend" },
      run: (s) => ({ ...s, user: { ...s.user, role: "admin" } }),
      next: "check_permission",
    },

    access_granted: {
      id: "access_granted",
      type: "end",
      title: "Access Granted",
      meta: { service: "frontend" },
      run: (s) => ({ ...s, access: "granted" }),
      next: null,
    },
  },
};