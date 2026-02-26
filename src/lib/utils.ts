import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "react-toastify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//success toast
export const showSuccess = (message?: string) => {
  toast.success(message, {
    position: "bottom-right",
    autoClose: 3000,
    theme: "colored",
  });
};

//Error toast
export const showError = (message: string) => {
  toast.error(message, {
    position: "bottom-right",
    autoClose: 4000,
    theme: "colored",
  });
};

//Info Toast
export const showInfo = (message: string) => {
  toast.info(message, {
    position: "bottom-right",
    autoClose: 3000,
    theme: "light",
  });
};
