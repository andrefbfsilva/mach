import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Timer, SkipForward, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";

type PomodoroPhase = "work" | "shortBreak" | "longBreak";

export function PomodoroModule() {
  // Timer settings (in minutes)
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);

  // Timer state
  const [minutes, setMinutes] = useState(workDuration);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Pomodoro cycle state
  const [phase, setPhase] = useState<PomodoroPhase>("work");
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const [cycleCount, setCycleCount] = useState(0); // 0-3, resets after 4

  // Settings
  const [autoStart, setAutoStart] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Update minutes when phase changes
  useEffect(() => {
    if (!isActive) {
      switch (phase) {
        case "work":
          setMinutes(workDuration);
          break;
        case "shortBreak":
          setMinutes(shortBreakDuration);
          break;
        case "longBreak":
          setMinutes(longBreakDuration);
          break;
      }
      setSeconds(0);
    }
  }, [phase, workDuration, shortBreakDuration, longBreakDuration, isActive]);

  // Timer countdown logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer completed
            handlePhaseComplete();
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

  const handlePhaseComplete = () => {
    setIsActive(false);

    if (phase === "work") {
      // Work session completed
      const newPomodorosCompleted = pomodorosCompleted + 1;
      setPomodorosCompleted(newPomodorosCompleted);

      const newCycleCount = cycleCount + 1;
      setCycleCount(newCycleCount);

      // Decide next phase
      if (newCycleCount >= 4) {
        // Time for long break
        setPhase("longBreak");
        setCycleCount(0);
      } else {
        // Time for short break
        setPhase("shortBreak");
      }
    } else {
      // Break completed, back to work
      setPhase("work");
    }

    if (autoStart) {
      setTimeout(() => setIsActive(true), 1000);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setPhase("work");
    setMinutes(workDuration);
    setSeconds(0);
  };

  const skipBreak = () => {
    if (phase !== "work") {
      setIsActive(false);
      setPhase("work");
    }
  };

  const resetCycle = () => {
    setIsActive(false);
    setPhase("work");
    setMinutes(workDuration);
    setSeconds(0);
    setCycleCount(0);
    setPomodorosCompleted(0);
  };

  const getTotalSeconds = () => {
    switch (phase) {
      case "work":
        return workDuration * 60;
      case "shortBreak":
        return shortBreakDuration * 60;
      case "longBreak":
        return longBreakDuration * 60;
    }
  };

  const totalSeconds = getTotalSeconds();
  const currentSeconds = minutes * 60 + seconds;
  const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 100;

  const getPhaseLabel = () => {
    switch (phase) {
      case "work":
        return "FOCUS TIME";
      case "shortBreak":
        return "SHORT BREAK";
      case "longBreak":
        return "LONG BREAK";
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case "work":
        return "hsl(199 100% 50%)"; // Primary blue
      case "shortBreak":
        return "hsl(158 100% 50%)"; // Success green
      case "longBreak":
        return "hsl(180 100% 50%)"; // Accent cyan
    }
  };

  return (
    <div className="module-panel rounded-lg p-6 h-full flex flex-col items-center justify-between">
      {/* Settings Toggle */}
      <div className="w-full flex justify-end mb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
          className="h-6 px-2"
        >
          <Settings className="w-3 h-3" />
        </Button>
      </div>

      {showSettings ? (
        /* Settings Panel */
        <div className="w-full space-y-4 flex-1 overflow-y-auto">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase">Timer Settings</h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Work Duration (min)</label>
              <input
                type="number"
                value={workDuration}
                onChange={(e) => setWorkDuration(Number(e.target.value))}
                className="w-full bg-background border border-primary/30 rounded px-2 py-1 text-sm"
                min="1"
                max="60"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Short Break (min)</label>
              <input
                type="number"
                value={shortBreakDuration}
                onChange={(e) => setShortBreakDuration(Number(e.target.value))}
                className="w-full bg-background border border-primary/30 rounded px-2 py-1 text-sm"
                min="1"
                max="30"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Long Break (min)</label>
              <input
                type="number"
                value={longBreakDuration}
                onChange={(e) => setLongBreakDuration(Number(e.target.value))}
                className="w-full bg-background border border-primary/30 rounded px-2 py-1 text-sm"
                min="1"
                max="60"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-primary/20">
              <label className="text-xs text-muted-foreground">Auto-start next phase</label>
              <Switch checked={autoStart} onCheckedChange={setAutoStart} />
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={resetCycle}
            className="w-full mt-4"
          >
            Reset All
          </Button>
        </div>
      ) : (
        /* Timer Display */
        <>
          {/* Phase Indicator */}
          <div className="text-center mb-4">
            <div className="text-xs font-mono uppercase tracking-widest" style={{ color: getPhaseColor() }}>
              {getPhaseLabel()}
            </div>
            <div className="text-[10px] font-mono text-muted-foreground mt-1">
              POMODORO {cycleCount + 1}/4
            </div>
          </div>

          {/* Circular Timer */}
          <div className="relative">
            <svg className="w-36 h-36 -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="66"
                stroke="hsl(240 6% 12%)"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="72"
                cy="72"
                r="66"
                stroke={getPhaseColor()}
                strokeWidth="6"
                fill="none"
                strokeDasharray={2 * Math.PI * 66}
                strokeDashoffset={2 * Math.PI * 66 * (1 - progress / 100)}
                className="transition-all duration-1000"
                style={{ filter: `drop-shadow(0 0 6px ${getPhaseColor()})` }}
              />
            </svg>

            {/* Time Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-mono font-bold" style={{ color: getPhaseColor() }}>
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </div>
              <div className="text-[9px] font-mono text-muted-foreground mt-1 uppercase tracking-widest">
                {isActive ? "RUNNING" : currentSeconds === 0 ? "DONE" : "PAUSED"}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2 mt-4">
            <Button
              variant="cockpit"
              size="sm"
              onClick={toggleTimer}
              className="flex-1"
            >
              {isActive ? (
                <>
                  <Pause className="w-4 h-4" />
                  PAUSE
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  START
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetTimer}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            {phase !== "work" && (
              <Button
                variant="outline"
                size="sm"
                onClick={skipBreak}
                title="Skip Break"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Session Counter */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <Timer className="w-3 h-3 text-accent" />
            <span className="text-xs font-mono text-muted-foreground">
              TOTAL: {pomodorosCompleted}
            </span>
            <div className="flex gap-1 ml-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${
                    i < cycleCount ? "bg-success pulse-glow" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
