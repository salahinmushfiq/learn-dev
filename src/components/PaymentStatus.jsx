// src/components/PaymentStatus.jsx
import React from 'react'

export const PaymentStatus = ({paymentStatus}) => {
  const statusColors = {
    initialized: "text-blue-300",
    intent_created: "text-indigo-300",
    processing: "text-yellow-300",
    authorized: "text-green-300",
    confirmed: "text-green-400",
    success: "text-emerald-400",
    failed_temp: "text-orange-400",
    failed_final: "text-red-500",
  };
  
  return (
     <div className="mt-4 mb-2 p-3 bg-white/5 rounded-lg border border-white/10 text-sm">
        Current Payment Status:{" "}
        <span className={`font-bold ${statusColors[paymentStatus] || "text-white"}`}>
        {paymentStatus}
        </span>
    </div>
  )
}
