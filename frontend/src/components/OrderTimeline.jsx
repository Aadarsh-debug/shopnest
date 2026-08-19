import React from "react";
import { IconCheck, IconTruck, IconPackage, IconSparkles } from "./Icons";

export default function OrderTimeline({ status = "Processing" }) {
  const steps = [
    { label: "Order Placed", key: "Pending", icon: <IconPackage size={14} /> },
    { label: "Processing & Quality Check", key: "Processing", icon: <IconSparkles size={14} /> },
    { label: "Shipped & In Transit", key: "Shipped", icon: <IconTruck size={14} /> },
    { label: "Delivered", key: "Delivered", icon: <IconCheck size={14} /> },
  ];

  const statusOrder = ["Pending", "Processing", "Shipped", "Delivered"];
  const currentIndex = Math.max(0, statusOrder.indexOf(status));
  const progressPercent = (currentIndex / (steps.length - 1)) * 100;

  return (
    <div style={{ margin: "2rem 0 2.5rem" }}>
      <div className="order-timeline">
        <div className="order-timeline-track" />
        <div
          className="order-timeline-progress"
          style={{ width: `${progressPercent}%` }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isActive = idx === currentIndex;

          return (
            <div
              key={step.key}
              className={`timeline-step ${isCompleted ? "completed" : ""} ${isActive ? "active" : ""}`}
            >
              <div className="timeline-dot">
                {isCompleted ? <IconCheck size={14} /> : idx + 1}
              </div>
              <span className="timeline-label">{step.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
