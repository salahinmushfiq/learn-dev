// src/data/flows/payments/payment.flow.js

export const paymentFlow = {
  id: "payment_parallel",
  title: "Distributed Payment Verification",
  startNode: "init",

  nodes: {
    init: {
      id: "init",
      title: "Initialize Payment",
      meta: { service: "frontend" },
      run: (s) => ({
        ...s,
        amount: 5000,
        bookingId: "BK9001",
      }),
      next: "parallel_processing",
    },

    parallel_processing: {
      id: "parallel_processing",
      title: "Parallel Processing",
      type: "parallel",
      next: ["gateway", "fraud_check", "logging"],
    },

    gateway: {
      id: "gateway",
      title: "Gateway",
      meta: { service: "sslcommerz", delay: 800 },
      run: (s) => ({ ...s, gateway: "ok" }),
      next: "merge",
    },

    fraud_check: {
      id: "fraud_check",
      title: "Fraud Check",
      meta: { service: "security", delay: 1200 },
      run: (s) => ({ ...s, fraud: "low" }),
      next: "merge",
    },

    logging: {
      id: "logging",
      title: "Logging",
      meta: { service: "logger", delay: 500 },
      run: (s) => ({ ...s, logged: true }),
      next: "merge",
    },

    merge: {
      id: "merge",
      title: "Merge & Verify",
      meta: { service: "backend" },
      type: "join",
      waitFor: ["gateway", "fraud_check", "logging"],
      run: (s) => ({ ...s, verified: true }),
      next: "notify",
    },

    notify: {
      id: "notify",
      title: "Notify User",
      meta: { service: "frontend" },
      run: (s) => ({ ...s, done: true }),
      next: null,
    },
  },
};