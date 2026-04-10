// src/data/flows/tourmate.flows.js

export const tourmateFlows = [
  {
    id: "tm_booking_orchestration",
    projectId: "tour-mate",
    tabLabel: "Booking Orchestration",
    startNode: "start",

    nodes: {
      start: {
        id: "start",
        title: "Start Booking",
        meta: { service: "frontend" },
        run: (s) => ({ ...s, tourId: "T100" }),
        next: "parallel_checks",
      },

      parallel_checks: {
        id: "parallel_checks",
        title: "Parallel Checks",
        type: "parallel",
        next: ["auth", "availability", "pricing"],
      },

      auth: {
        id: "auth",
        title: "Auth Check",
        meta: { service: "auth", delay: 400 },
        run: (s) => ({ ...s, auth: true }),
        next: "merge",
      },

      availability: {
        id: "availability",
        title: "Availability",
        meta: { service: "inventory", delay: 800 },
        run: (s) => ({ ...s, seats: true }),
        next: "merge",
      },

      pricing: {
        id: "pricing",
        title: "Pricing",
        meta: { service: "pricing", delay: 600 },
        run: (s) => ({ ...s, price: 4800 }),
        next: "merge",
      },

      merge: {
        id: "merge",
        title: "Merge Results",
        type: "join",
        waitFor: ["auth", "availability", "pricing"],
        meta: { service: "backend" },
        run: (s) => ({ ...s, ready: true }),
        next: "booking",
      },

      booking: {
        id: "booking",
        title: "Create Booking",
        meta: { service: "booking" },
        run: (s) => ({ ...s, bookingId: "BK777" }),
        next: null,
      },
    },
  },
];