import { useEffect, useRef, useState } from "react";
import { useStore } from "@/store/useStore";

export const isWakeLockSupported =
  typeof navigator !== "undefined" && "wakeLock" in navigator;

export function useWakeLock() {
  const [isActive, setIsActive] = useState(false);
  const sentinelRef = useRef<WakeLockSentinel | null>(null);
  const wakeLockEnabled = useStore((s) => s.settings.wakeLockEnabled);

  const request = async () => {
    if (!isWakeLockSupported) return;
    try {
      sentinelRef.current = await navigator.wakeLock.request("screen");
      sentinelRef.current.addEventListener("release", () => setIsActive(false));
      setIsActive(true);
    } catch {
      setIsActive(false);
    }
  };

  const release = () => {
    sentinelRef.current?.release();
    sentinelRef.current = null;
    setIsActive(false);
  };

  // Re-acquire when tab becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && wakeLockEnabled) {
        request();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [wakeLockEnabled]);

  // React to store toggle
  useEffect(() => {
    if (wakeLockEnabled) {
      request();
    } else {
      release();
    }
  }, [wakeLockEnabled]);

  return { isActive, isSupported: isWakeLockSupported, request, release };
}
