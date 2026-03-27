export type ToastType = "success" | "error" | "info";

export interface ToastEventDetail {
  message: string;
  type: ToastType;
  duration?: number;
}

export const toast = {
  success: (message: string, duration = 5000) => {
    window.dispatchEvent(
      new CustomEvent<ToastEventDetail>("app-toast", {
        detail: { message, type: "success", duration },
      })
    );
  },
  error: (message: string, duration = 5000) => {
    window.dispatchEvent(
      new CustomEvent<ToastEventDetail>("app-toast", {
        detail: { message, type: "error", duration },
      })
    );
  },
  info: (message: string, duration = 5000) => {
    window.dispatchEvent(
      new CustomEvent<ToastEventDetail>("app-toast", {
        detail: { message, type: "info", duration },
      })
    );
  },
};
