// src/components/Toast.jsx
import { useEffect } from "react";
import "./Toast.css";

export default function Toast({ message, onClose, type = "success" }) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onClose();
    }, 2000);
    return () => clearTimeout(timeout);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className={`toast ${type}`}>
      <p>{message}</p>
    </div>
  );
}
