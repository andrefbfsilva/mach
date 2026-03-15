import { useEffect } from "react";

interface ShortcutCallbacks {
  onSettings?: () => void;
  onChangeLayout?: () => void;
  onCloseModal?: () => void;
}

export function useKeyboardShortcuts({ onSettings, onChangeLayout, onCloseModal }: ShortcutCallbacks) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;

      if (e.key === "Escape" && onCloseModal) {
        e.preventDefault();
        onCloseModal();
        return;
      }
      if (isMod && e.key === "," && onSettings) {
        e.preventDefault();
        onSettings();
        return;
      }
      if (isMod && e.key === "l" && onChangeLayout) {
        e.preventDefault();
        onChangeLayout();
        return;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onSettings, onChangeLayout, onCloseModal]);
}
