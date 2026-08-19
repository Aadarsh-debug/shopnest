import React from "react";
import { useToast } from "../context/ToastContext";
import { IconCheck, IconX, IconSparkles } from "./Icons";

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="toast-portal">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-item toast-${toast.type} animate-slide-up`}
          role="alert"
        >
          <div className="toast-icon">
            {toast.type === "success" && <IconCheck size={18} />}
            {toast.type === "error" && <IconX size={18} />}
            {toast.type === "info" && <IconSparkles size={18} />}
          </div>
          <div className="toast-body">
            {toast.title && <div className="toast-title">{toast.title}</div>}
            <div className="toast-message">{toast.message}</div>
          </div>
          <button
            className="toast-close"
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss notification"
          >
            <IconX size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
