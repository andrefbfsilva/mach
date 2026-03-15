import { useStore } from "@/store/useStore";

const patterns = {
  tap: 10,
  success: [10, 50, 10],
  warning: [30, 30, 30],
  heavy: 50,
} as const;

export type HapticPattern = keyof typeof patterns;

export function useHaptic() {
  const isSupported = typeof navigator !== "undefined" && "vibrate" in navigator;
  const hapticEnabled = useStore((s) => s.settings.hapticEnabled);

  const trigger = (pattern: HapticPattern = "tap") => {
    if (!isSupported || !hapticEnabled) return;
    navigator.vibrate(patterns[pattern]);
  };

  return { trigger, isSupported };
}
