import toast from "react-hot-toast";
import Swal from "sweetalert2";

export const notify = {
  success: (message) => {
    return toast.success(message, {
      duration: 3500,
      style: {
        background: "#0f172a",
        color: "#f8fafc",
        border: "1px solid #1e293b",
        borderRadius: "0.75rem",
        fontSize: "0.875rem",
        fontWeight: "500",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
      },
      iconTheme: {
        primary: "#10b981",
        secondary: "#0f172a",
      },
    });
  },

  error: (message) => {
    return toast.error(message || "An unexpected error occurred", {
      duration: 4000,
      style: {
        background: "#0f172a",
        color: "#f8fafc",
        border: "1px solid #1e293b",
        borderRadius: "0.75rem",
        fontSize: "0.875rem",
        fontWeight: "500",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
      },
      iconTheme: {
        primary: "#f43f5e",
        secondary: "#0f172a",
      },
    });
  },

  warning: (message) => {
    return toast(message, {
      duration: 4000,
      icon: "⚠️",
      style: {
        background: "#0f172a",
        color: "#f8fafc",
        border: "1px solid #1e293b",
        borderRadius: "0.75rem",
        fontSize: "0.875rem",
        fontWeight: "500",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
      },
    });
  },

  info: (message) => {
    return toast(message, {
      duration: 3500,
      icon: "ℹ️",
      style: {
        background: "#0f172a",
        color: "#f8fafc",
        border: "1px solid #1e293b",
        borderRadius: "0.75rem",
        fontSize: "0.875rem",
        fontWeight: "500",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
      },
    });
  },

  confirmDelete: async ({ title = "Are you sure?", text = "You won't be able to revert this!" } = {}) => {
    const result = await Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#0f172a",
      color: "#f8fafc",
      customClass: {
        popup: "rounded-2xl border border-slate-800 shadow-2xl",
        confirmButton: "px-5 py-2.5 rounded-xl font-medium text-sm shadow-md",
        cancelButton: "px-5 py-2.5 rounded-xl font-medium text-sm shadow-md",
      },
    });

    return result.isConfirmed;
  },
};

export default notify;
