export default {
  id: "payment_flow",
  title: "Payment Lifecycle",
  startNode: "create_order",

  nodes: {
    create_order: {
      id: "create_order",
      title: "Order Created",
      next: "partial_payment"
    },

    partial_payment: {
      id: "partial_payment",
      title: "Partial Payment",
      next: "pending_balance",
      effect: "PARTIAL_PAYMENT"
    },

    pending_balance: {
      id: "pending_balance",
      title: "Pending Balance",
      next: "payment_retry"
    },

    payment_retry: {
      id: "payment_retry",
      title: "Retry Payment",
      next: "completed",
      effect: "COMPLETE_PAYMENT"
    },

    completed: {
      id: "completed",
      title: "Completed",
      next: null
    }
  }
};