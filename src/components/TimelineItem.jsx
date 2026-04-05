// src/components/TimelineItem.jsx
import React, { memo } from "react";
import { servicesConfig } from "../data/services.config";

const typeColors = {
  state: "text-blue-300",
  request: "text-purple-300",
  middleware: "text-yellow-300",
  decision: "text-red-300",
  terminal: "text-green-300",
  api: "text-purple-400",
  async: "text-orange-300",
  failure: "text-red-600",
};

export default memo(function TimelineItem({ h, i, stepIndex, goTo }) {
  const service = servicesConfig[h.meta?.service];

  return (
    <div
      onClick={() => goTo(i)}
      className={`p-3 mb-2 cursor-pointer rounded ${
        i === stepIndex ? "bg-blue-600" : "bg-zinc-800"
      }`}
    >
      <div className="flex justify-between">
        <span className={typeColors[h.type]}>{h.label}</span>

        {service && (
          <span className={`text-xs px-2 rounded ${service.color}`}>
            {service.label}
          </span>
        )}
      </div>
    </div>
  );
});