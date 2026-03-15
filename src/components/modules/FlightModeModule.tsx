import { useState, useEffect, useRef } from "react";
import { Plane, Target } from "lucide-react";
import { Button } from "../ui/button";
import { useFocusStore, useStore } from "@/store/useStore";
import { useHaptic } from "@/hooks/useHaptic";
import { useSound } from "@/hooks/useSound";

function todaysSessions(sessions: { startedAt: string; durationMinutes: number; endedAt: string | null }[], today: string) {
  return sessions.filter(
    (s) => s.endedAt !== null && new Date(s.startedAt).toDateString() === today
  );
}

function thisWeekSessions(sessions: { startedAt: string; durationMinutes: number; endedAt: string | null }[]) {
  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  return sessions.filter(
    (s) => s.endedAt !== null && new Date(s.startedAt).getTime() >= weekAgo
  );
}

function sumMinutes(sessions: { durationMinutes: number }[]) {
  return sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
}

function formatElapsed(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function FlightModeModule() {
  const { focus, addFocusSession, endFocusSession, setDailyGoal } = useFocusStore();
  const { trigger } = useHaptic();
  const { play } = useSound();

  const [isActive, setIsActive] = useState(false);
  const [activeFocusId, setActiveFocusId] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [lastSession, setLastSession] = useState<number | null>(null);
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(String(focus.dailyGoalMinutes));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeFocusIdRef = useRef<string | null>(null);

  // Keep ref in sync with state so unmount cleanup has fresh value
  useEffect(() => {
    activeFocusIdRef.current = activeFocusId;
  }, [activeFocusId]);

  // End any active session on unmount
  useEffect(() => {
    return () => {
      if (activeFocusIdRef.current) {
        useStore.getState().endFocusSession(activeFocusIdRef.current);
      }
    };
  }, []);

  // Keep goalInput in sync if dailyGoalMinutes changes externally
  useEffect(() => {
    if (!editingGoal) setGoalInput(String(focus.dailyGoalMinutes));
  }, [focus.dailyGoalMinutes, editingGoal]);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const handleToggle = () => {
    if (!isActive) {
      // Start session
      const startedAt = new Date().toISOString();
      const id = addFocusSession({ startedAt, endedAt: null, durationMinutes: 0, type: "manual" });
      setActiveFocusId(id);
      setElapsed(0);
      setIsActive(true);
      setLastSession(null);
      trigger("success");
      play("beep");
    } else {
      // End session
      if (activeFocusId) {
        endFocusSession(activeFocusId);
        const durationMinutes = Math.floor(elapsed / 60);
        setLastSession(durationMinutes);
      }
      setIsActive(false);
      setActiveFocusId(null);
      setElapsed(0);
      play("chime");
    }
  };

  const handleGoalSave = () => {
    const val = parseInt(goalInput, 10);
    if (!isNaN(val) && val > 0) setDailyGoal(val);
    setEditingGoal(false);
  };

  const today = new Date().toDateString();
  const todaySess = todaysSessions(focus.sessions, today);
  const weekSess = thisWeekSessions(focus.sessions);
  const todayMin = sumMinutes(todaySess);
  const weekMin = sumMinutes(weekSess);
  const goalMin = focus.dailyGoalMinutes;
  const progress = Math.min((todayMin / goalMin) * 100, 100);
  const goalReached = todayMin >= goalMin;

  return (
    <div className="module-panel rounded-lg p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">FLIGHT MODE</h3>
        <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
          <Target className="w-3 h-3" />
          {editingGoal ? (
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                onBlur={handleGoalSave}
                onKeyDown={(e) => e.key === "Enter" && handleGoalSave()}
                className="w-14 bg-background border border-primary/30 rounded px-1 text-xs text-center"
                min="1"
              />
              <span>min</span>
            </div>
          ) : (
            <button
              onClick={() => setEditingGoal(true)}
              className="hover:text-accent transition-colors"
              title="Click to edit daily goal"
            >
              GOAL: {goalMin}m
            </button>
          )}
        </div>
      </div>

      {/* Main Toggle */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        {/* Guard + Switch */}
        <div className="relative">
          {/* Guard frame */}
          <div
            className={`absolute -inset-3 rounded border-2 transition-colors duration-300 ${
              isActive ? "border-accent/60" : "border-muted/30"
            }`}
          />
          <button
            onClick={handleToggle}
            className={`relative w-28 h-28 rounded-full border-4 font-mono font-bold text-sm tracking-widest transition-all duration-300 ${
              isActive
                ? "bg-accent/20 border-accent text-accent shadow-[0_0_30px_hsl(180_100%_50%_/_0.5)] animate-pulse"
                : "bg-secondary border-muted text-muted-foreground hover:border-primary/50 hover:text-primary"
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <Plane
                className={`w-8 h-8 transition-transform duration-300 ${
                  isActive ? "rotate-0 text-accent" : "rotate-45 text-muted-foreground"
                }`}
              />
              <span className="text-[10px]">{isActive ? "IN FLIGHT" : "STANDBY"}</span>
            </div>
          </button>
        </div>

        {/* Timer / last session */}
        <div className="text-center min-h-[2rem]">
          {isActive ? (
            <div className="text-2xl font-mono font-bold text-accent">
              {formatElapsed(elapsed)}
            </div>
          ) : lastSession !== null ? (
            <div className="text-sm font-mono text-muted-foreground">
              Session: <span className="text-accent">{lastSession} min</span>
            </div>
          ) : null}
        </div>

        {/* Stats */}
        <div className="w-full space-y-2 text-xs font-mono">
          <div className="flex justify-between text-muted-foreground">
            <span>TODAY</span>
            <span className={goalReached ? "text-success" : ""}>
              {todaySess.length} sessions | {todayMin} min
            </span>
          </div>
          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                goalReached
                  ? "bg-success shadow-[0_0_6px_hsl(158_100%_50%_/_0.6)]"
                  : "bg-gradient-to-r from-primary to-accent"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>THIS WEEK</span>
            <span>
              {weekSess.length} sessions | {weekMin} min
            </span>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mt-4">
        <div
          className={`w-2 h-2 rounded-full ${
            isActive ? "bg-accent pulse-glow" : goalReached ? "bg-success pulse-glow" : "bg-muted"
          }`}
        />
        {isActive ? "SESSION ACTIVE" : goalReached ? "DAILY GOAL REACHED" : "READY FOR TAKEOFF"}
      </div>
    </div>
  );
}
