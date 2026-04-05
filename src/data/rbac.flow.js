//src/data/rbac.flow.js
export const rbacFlow = [
  {
    id: "load_session",
    label: "Load User Session",
    type: "state",
    meta: { service: "auth" },

    run: (state) => ({
      ...state,
      user: { id: 1, role: "tourist" },
    }),
  },

  {
    id: "route_check",
    label: "Route Permission Check",
    type: "middleware",
    meta: { service: "router" },

    run: (state) => ({
      ...state,
      route: { requiredRoles: ["admin"] },
      claims: { role: state.user.role },
    }),
  },

  {
    id: "rbac_decision",
    label: "RBAC Decision Engine",
    type: "decision",
    meta: { service: "middleware" },

    run: (state) => {
      const allowed =
        state.route.requiredRoles.includes(state.claims.role);

      return {
        ...state,
        authorization: { allowed },
      };
    },
  },

  {
    id: "rbac_result",
    label: "Final Access Decision",
    type: "terminal",
    meta: { service: "gateway" },

    run: (state) => ({
      ...state,
      response: {
        status: state.authorization.allowed ? 200 : 403,
      },
    }),
  },
];