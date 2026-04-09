// src/data/flows/innerPatissier.flows.js
export const innerPatissierFlows = [
  {
    id: "inventory",
    projectId: "inner-patissier",
    tabLabel: "Inventory System",
    startNode: "stock-update",
    nodes: {
      "stock-update": {
        id: "stock-update",
        title: "Stock Deduction on Order",
        meta: { service: "inventory" },
        run: (s) => ({ ...s, stock: 18 }),
        next: "validation",
      },
      "validation": {
        id: "validation",
        title: "Stock Validation",
        meta: { service: "backend" },
        run: (s) => ({ ...s, valid: true }),
        next: "sync-dashboard",
      },
      "sync-dashboard": {
        id: "sync-dashboard",
        title: "Sync Dashboard",
        meta: { service: "frontend" },
        run: (s) => ({ ...s, dashboardUpdated: true }),
        next: null,
      },
    },
  },
  {
    id: "analytics",
    projectId: "inner-patissier",
    tabLabel: "Customer Intelligence",
    startNode: "orders-fetch",
    nodes: {
      "orders-fetch": {
        id: "orders-fetch",
        title: "Fetch Orders",
        meta: { service: "backend" },
        run: (s) => ({ ...s, orders: 1200 }),
        next: "rfm",
      },
      "rfm": {
        id: "rfm",
        title: "RFM Segmentation",
        meta: { service: "analytics" },
        run: (s) => ({ ...s, segments: ["VIP", "Loyal"] }),
        next: "coupon",
      },
      "coupon": {
        id: "coupon",
        title: "Coupon Engine",
        meta: { service: "backend" },
        run: (s) => ({ ...s, coupons: ["VIP10"] }),
        next: "heatmap",
      },
      "heatmap": {
        id: "heatmap",
        title: "Mapbox Heatmap",
        meta: { service: "frontend" },
        run: (s) => ({ ...s, mapReady: true }),
        next: "delivery",
      },
      "delivery": {
        id: "delivery",
        title: "Delivery Tracking",
        meta: { service: "logistics" },
        run: (s) => ({ ...s, deliveryStatus: "in_transit" }),
        next: null,
      },
    },
  },
];