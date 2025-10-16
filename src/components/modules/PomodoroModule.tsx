import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";
import { Button } from "../ui/button";

export function PomodoroModule() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            setSessions((prev) => prev + 1);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
  };

  const totalSeconds = 25 * 60;
  const currentSeconds = minutes * 60 + seconds;
  const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 100;

  return (
    <div className="module-panel rounded-lg p-6 h-full flex flex-col items-center justify-center gap-6">
      {/* Timer Display */}
      <div className="relative">
        {/* Circular Progress */}
        <svg className="w-48 h-48 -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="hsl(240 6% 12%)"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="hsl(199 100% 50%)"
            strokeWidth="8"
            fill="none"
            strokeDasharray={2 * Math.PI * 88}
            strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
            className="transition-all duration-1000"
            style={{ filter: "drop-shadow(0 0 8px hsl(199 100% 50% / 0.6))" }}
          />
        </svg>

        {/* Time Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl font-mono font-bold text-primary">
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </div>
          <div className="text-xs font-mono text-muted-foreground mt-2 uppercase tracking-widest">
            {isActive ? "IN PROGRESS" : minutes === 0 && seconds === 0 ? "COMPLETE" : "READY"}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <Button
          variant="cockpit"
          size="lg"
          onClick={toggleTimer}
          className="w-32"
        >
          {isActive ? (
            <>
              <Pause className="w-5 h-5" />
              PAUSE
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              START
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={resetTimer}
          className="w-32"
        >
          <RotateCcw className="w-5 h-5" />
          RESET
        </Button>
      </div>

      {/* Session Counter */}
      <div className="flex items-center gap-3 mt-4">
        <Timer className="w-4 h-4 text-accent" />
        <span className="text-sm font-mono text-muted-foreground">
          SESSIONS: {sessions}
        </span>
        <div className="flex gap-1 ml-2">
          {[...Array(Math.min(sessions, 8))].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-success animate-glow-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
