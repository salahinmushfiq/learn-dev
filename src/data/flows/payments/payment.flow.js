// src/data/flows/payment/payment.flow.js
export const paymentFlow = {
  id: "sslcommerz_payment",
  title: "sslcommerz_payment",
  projectId: "tour-mate",
  startNode: "init_payment",

  nodes: {
    init_payment: {
      id: "init_payment",
      title: "Frontend: Initialize Payment",
      meta: { service: "frontend" },

      run: (s) => ({
        ...s,
        request: {
          endpoint: "POST /payments/init",
          gateway: "sslcommerz",
          amount: 5000,
          bookingId: "BK2001",
        },
        response: { sessionId: "SSLCZ2001", redirectURL: "https://sandbox.sslcommerz.com/session" },
        paymentState: "initiated",
      }),

      next: "redirect_to_gateway",
    },

    redirect_to_gateway: {
      id: "redirect_to_gateway",
      title: "Frontend: Redirect User to Gateway",
      meta: { service: "frontend" },

      run: (s) => ({
        ...s,
        request: { action: "redirect_user", url: s.response.redirectURL },
        response: { status: "user_on_gateway" },
        paymentState: "in_progress",
      }),

      next: "gateway_process",
    },

    gateway_process: {
      id: "gateway_process",
      title: "SSLCommerz: Gateway Processing",
      meta: { service: "gateway" },

      run: (s) => ({
        ...s,
        request: { sessionId: s.response.sessionId, amount: 5000 },
        response: { tran_id: "TX5001", status: "VALID", gatewayMessage: "Payment Successful" },
        gatewayState: "completed",
      }),

      next: "callback_backend",
    },

    callback_backend: {
      id: "callback_backend",
      title: "Backend: Receive Gateway Callback",
      meta: { service: "backend" },

      run: (s) => ({
        ...s,
        request: { tran_id: s.response.tran_id, status: s.response.status },
        response: { verified: true, bookingId: "BK2001" },
        paymentState: "verified",
      }),

      next: "update_booking_status",
    },

    update_booking_status: {
      id: "update_booking_status",
      title: "Backend: Update Booking Status",
      meta: { service: "backend" },

      run: (s) => ({
        ...s,
        request: { bookingId: s.response.bookingId, status: "paid" },
        response: { success: true, bookingStatus: "confirmed" },
        paymentState: "completed",
        bookingStatus: "confirmed",
      }),

      next: "notify_frontend",
    },

    notify_frontend: {
      id: "notify_frontend",
      title: "Frontend: Receive Confirmation",
      meta: { service: "frontend" },

      run: (s) => ({
        ...s,
        request: { endpoint: "GET /bookings/BK2001/status" },
        response: { bookingStatus: "confirmed", amountPaid: 5000 },
        paymentState: "success",
        confirmed: true,
      }),

      next: null,
    },
  },
};