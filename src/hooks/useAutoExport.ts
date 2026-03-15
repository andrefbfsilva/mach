import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { createBridgeExport } from "@/types/bridge";

export function useAutoExport() {
  useEffect(() => {
    const unsubscribe = useStore.subscribe((state) => {
      const bridge = createBridgeExport(state);
      localStorage.setItem("mach-bridge-latest", JSON.stringify(bridge));
    });
    return unsubscribe;
  }, []);
}
