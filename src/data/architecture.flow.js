//src/auth/architectureFlow.flow.js
export const architectureFlow = [
  {
    id: "client_request",
    label: "React sends booking request",
    type: "request",
    meta: { service: "react" },

    run: (state) => ({
      ...state,
      status: "initiated",
      trace: [
        {
          service: "react",
          event: "request_start",
        },
      ],
      request: {
        endpoint: "/api/bookings",
        payload: { tourId: 101, userId: 1 },
      },
    }),
  },

  {
    id: "django_receive",
    label: "Django receives request",
    type: "middleware",
    meta: { service: "django" },

    run: (state) => ({
      ...state,
      trace: [
        ...(state.trace || []),
        {
          service: "django",
          event: "received",
        },
      ],
    }),
  },

  {
    id: "auth_check",
    label: "Auth validation",
    type: "decision",
    meta: { service: "django" },

    run: (state) => {
      const authenticated = true;

      if (!authenticated) {
        return {
          ...state,
          failedAt: "auth",
          error: "Unauthorized user",
          status: "failed",
        };
      }

      return {
        ...state,
        auth: { userId: 1, authenticated },
      };
    },
  },

  {
    id: "booking_logic",
    label: "Booking creation",
    type: "api",
    meta: { service: "django" },

    run: (state) => ({
      ...state,
      booking: {
        tourId: state.request.payload.tourId,
        status: "pending_payment",
        price: 120,
        reserved: true,
      },
    }),
  },

  {
    id: "payment_intent",
    label: "Create payment intent",
    type: "api",
    meta: { service: "django" },

    run: (state) => ({
      ...state,
      payment: {
        intentId: "pay_123",
        status: "processing",
        amount: state.booking.price,
      },
    }),
  },

  {
    id: "payment_gateway",
    label: "External payment gateway",
    type: "async",
    meta: { service: "gateway" },

    run: (state) => {
      const success = Math.random() > 0.5;

      if (!success) {
        return {
          ...state,
          payment: {
            ...state.payment,
            status: "failed",
            error: "Card declined",
          },
          failedAt: "payment",
        };
      }

      return {
        ...state,
        payment: {
          ...state.payment,
          status: "success",
          transactionId: "txn_789",
        },
      };
    },
  },

  {
    id: "failure_handler",
    label: "Failure propagation handler",
    type: "system",
    meta: { service: "system" },

    run: (state) => {
      if (!state.failedAt) return state;

      const rollbackTrace = [];

      if (state.failedAt === "payment") {
        rollbackTrace.push({
          service: "booking",
          event: "rollback_reservation",
        });

        return {
          ...state,
          booking: {
            ...state.booking,
            status: "cancelled",
            reserved: false,
          },
          status: "rolled_back",
          trace: [...state.trace, ...rollbackTrace],
        };
      }

      if (state.failedAt === "auth") {
        return {
          ...state,
          booking: null,
          payment: null,
          status: "terminated",
          trace: [
            ...state.trace,
            {
              service: "system",
              event: "terminated_at_auth",
            },
          ],
        };
      }

      return state;
    },
  },

  {
    id: "finalization",
    label: "Finalize booking state",
    type: "terminal",
    meta: { service: "system" },

    run: (state) => {
      if (state.failedAt) {
        return { ...state, status: "failed" };
      }

      return {
        ...state,
        booking: {
          ...state.booking,
          status: "confirmed",
          bookingId: "bk_456",
        },
        status: "success",
      };
    },
  },
];