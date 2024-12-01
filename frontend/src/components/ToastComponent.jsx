import React from "react";
import { Toast } from "flowbite-react";
import { HiCheck, HiX, HiExclamation } from "react-icons/hi";
import { useToast } from "../context/ToastContext";

const ToastComponent = () => {
  const { toast, showToast } = useToast();

  if (!toast.show) return null;

  const icons = {
    success: <HiCheck className="h-5 w-5" />,
    error: <HiX className="h-5 w-5" />,
    warning: <HiExclamation className="h-5 w-5" />,
  };

  const colors = {
    success: "bg-green-100 text-green-500",
    error: "bg-red-100 text-red-500",
    warning: "bg-yellow-100 text-yellow-500",
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <Toast>
        <div
          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
            colors[toast.type]
          }`}
        >
          {icons[toast.type]}
        </div>
        <div className="ml-3 text-sm font-normal">{toast.message}</div>
        <Toast.Toggle onDismiss={() => showToast(false)} />
      </Toast>
    </div>
  );
};

export default ToastComponent;
