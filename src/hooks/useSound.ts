import { useRef } from "react";
import { useStore } from "@/store/useStore";

export type SoundType = "beep" | "chime" | "alert" | "click";

export function useSound() {
  const isSupported = typeof window !== "undefined" && "AudioContext" in window;
  const ctxRef = useRef<AudioContext | null>(null);
  const soundEnabled = useStore((s) => s.settings.soundEnabled);

  const getCtx = (): AudioContext | null => {
    if (!isSupported) return null;
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  };

  const tone = (
    ctx: AudioContext,
    frequency: number,
    startTime: number,
    duration: number,
    gain = 0.25
  ) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = frequency;
    gainNode.gain.setValueAtTime(gain, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.01);
  };

  const whiteNoise = (ctx: AudioContext) => {
    const bufferSize = Math.floor(ctx.sampleRate * 0.02); // 20ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) * 0.2;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start();
  };

  const play = (sound: SoundType) => {
    if (!soundEnabled) return;
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;

    switch (sound) {
      case "beep":
        tone(ctx, 880, now, 0.1);
        break;
      case "chime":
        tone(ctx, 660, now, 0.15);
        tone(ctx, 880, now + 0.15, 0.15);
        break;
      case "alert":
        tone(ctx, 440, now, 0.1);
        tone(ctx, 440, now + 0.15, 0.1);
        tone(ctx, 440, now + 0.30, 0.1);
        break;
      case "click":
        whiteNoise(ctx);
        break;
    }
  };

  return { play, isSupported };
}
