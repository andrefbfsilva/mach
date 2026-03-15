import { useEffect, useRef } from "react";
import { useStore } from "@/store/useStore";
import { createBridgeExport } from "@/types/bridge";

export function useAutoExport() {
  const prevRef = useRef<string>("");

  useEffect(() => {
    const unsubscribe = useStore.subscribe((state) => {
      const bridge = createBridgeExport(state);
      const json = JSON.stringify(bridge);
      if (json !== prevRef.current) {
        prevRef.current = json;
        localStorage.setItem("mach-bridge-latest", json);
      }
    });
    return unsubscribe;
  }, []);
}
