// src/flows/auth/rbac.flow.js
export const rbacFlow = {
  id: "rbac_lifecycle",
  title: "RBAC Authorization Lifecycle",
  startNode: "login",
  nodes: {
    login: {
      id: "login",
      title: "Authenticate User",
      meta: { service: "auth" },
      run: (s) => ({ ...s, user: { id: 1, role: "customer" } }),
      next: "check_permission",
    },
    check_permission: {
      id: "check_permission",
      title: "RBAC Permission Check",
      meta: { service: "auth" },
      run: (s) => ({
        ...s,
        permissionGranted: s.user.role === "admin",
      }),
      // BRANCHING: If role isn't admin, go to deny_access
      next: (s) => (s.permissionGranted ? "access_granted" : "deny_access"),
    },
    deny_access: {
      id: "deny_access",
      title: "Access Denied Handler",
      meta: { service: "frontend" },
      run: (s) => ({ ...s, access: "denied" }),
      next: "role_upgrade",
    },
    role_upgrade: {
      id: "role_upgrade",
      title: "Role Upgrade (Admin Approval)",
      meta: { service: "backend" },
      run: (s) => ({ ...s, user: { ...s.user, role: "admin" } }),
      next: "check_permission", // Recursion back to check again
    },
    access_granted: {
      id: "access_granted",
      title: "Access Admin Panel",
      meta: { service: "frontend" },
      run: (s) => ({ ...s, access: "granted" }),
      next: null,
    },
  },
};