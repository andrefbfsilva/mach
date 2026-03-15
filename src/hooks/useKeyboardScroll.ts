import { useCallback } from "react";

export function useKeyboardScroll() {
  const scrollToInput = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      // Small delay to wait for keyboard animation
      setTimeout(() => {
        e.target.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    },
    []
  );
  return scrollToInput;
}
