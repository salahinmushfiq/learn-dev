//src/data/payments.flow.js
export const paymentsFlow = [
  {
    id: "payment_init",
    label: "Initialize Payment",
    type: "request",
    meta: { service: "client" },

    run: (state) => ({
      ...state,
      payment: { status: "initialized", amount: 100 },
    }),
  },

  {
    id: "payment_gateway",
    label: "Gateway Processing",
    type: "async",
    meta: { service: "gateway" },

    run: (state) => ({
      ...state,
      payment: { ...state.payment, status: "processing" },
    }),
  },

  {
    id: "payment_result",
    label: "Gateway Result",
    type: "decision",
    meta: { service: "gateway" },

    run: (state) => {
      const ok = Math.random() > 0.4;

      return {
        ...state,
        payment: {
          ...state.payment,
          status: ok ? "authorized" : "failed",
        },
      };
    },
  },

  {
    id: "payment_finalize",
    label: "Final State",
    type: "terminal",
    meta: { service: "system" },

    run: (state) => ({
      ...state,
      status: state.payment.status,
    }),
  },
];