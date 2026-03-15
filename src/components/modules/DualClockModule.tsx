import { useState, useEffect } from "react";
import { Clock, Globe, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useClockStore } from "@/store/useStore";

const DEFAULT_TIMEZONES = [
  { name: "New York",  tz: "America/New_York",          emoji: "🗽" },
  { name: "London",   tz: "Europe/London",              emoji: "🇬🇧" },
  { name: "Paris",    tz: "Europe/Paris",               emoji: "🇫🇷" },
  { name: "Tokyo",    tz: "Asia/Tokyo",                 emoji: "🗾" },
  { name: "Sydney",   tz: "Australia/Sydney",           emoji: "🇦🇺" },
  { name: "Dubai",    tz: "Asia/Dubai",                 emoji: "🏜️" },
];

const ALL_TIMEZONES = [
  { name: "New York",       tz: "America/New_York",                    emoji: "🗽" },
  { name: "Chicago",        tz: "America/Chicago",                     emoji: "🌆" },
  { name: "Denver",         tz: "America/Denver",                      emoji: "⛰️" },
  { name: "Los Angeles",    tz: "America/Los_Angeles",                 emoji: "🎬" },
  { name: "São Paulo",      tz: "America/Sao_Paulo",                   emoji: "🇧🇷" },
  { name: "Mexico City",    tz: "America/Mexico_City",                 emoji: "🇲🇽" },
  { name: "Toronto",        tz: "America/Toronto",                     emoji: "🇨🇦" },
  { name: "Buenos Aires",   tz: "America/Argentina/Buenos_Aires",      emoji: "🇦🇷" },
  { name: "London",         tz: "Europe/London",                       emoji: "🇬🇧" },
  { name: "Paris",          tz: "Europe/Paris",                        emoji: "🇫🇷" },
  { name: "Berlin",         tz: "Europe/Berlin",                       emoji: "🇩🇪" },
  { name: "Madrid",         tz: "Europe/Madrid",                       emoji: "🇪🇸" },
  { name: "Lisbon",         tz: "Europe/Lisbon",                       emoji: "🇵🇹" },
  { name: "Moscow",         tz: "Europe/Moscow",                       emoji: "🇷🇺" },
  { name: "Istanbul",       tz: "Europe/Istanbul",                     emoji: "🇹🇷" },
  { name: "Dubai",          tz: "Asia/Dubai",                          emoji: "🏜️" },
  { name: "Mumbai",         tz: "Asia/Kolkata",                        emoji: "🇮🇳" },
  { name: "Bangkok",        tz: "Asia/Bangkok",                        emoji: "🇹🇭" },
  { name: "Singapore",      tz: "Asia/Singapore",                      emoji: "🇸🇬" },
  { name: "Shanghai",       tz: "Asia/Shanghai",                       emoji: "🇨🇳" },
  { name: "Tokyo",          tz: "Asia/Tokyo",                          emoji: "🗾" },
  { name: "Seoul",          tz: "Asia/Seoul",                          emoji: "🇰🇷" },
  { name: "Hong Kong",      tz: "Asia/Hong_Kong",                      emoji: "🇭🇰" },
  { name: "Sydney",         tz: "Australia/Sydney",                    emoji: "🇦🇺" },
  { name: "Melbourne",      tz: "Australia/Melbourne",                 emoji: "🇦🇺" },
  { name: "Auckland",       tz: "Pacific/Auckland",                    emoji: "🇳🇿" },
  { name: "Cairo",          tz: "Africa/Cairo",                        emoji: "🇪🇬" },
  { name: "Johannesburg",   tz: "Africa/Johannesburg",                 emoji: "🇿🇦" },
];

// Backwards-compat: old store values were display names, not IANA names
const LEGACY_NAME_MAP: Record<string, string> = {
  "New York": "America/New_York",
  "London":   "Europe/London",
  "Paris":    "Europe/Paris",
  "Tokyo":    "Asia/Tokyo",
  "Sydney":   "Australia/Sydney",
  "Dubai":    "Asia/Dubai",
};

function getTZOffset(tz: string): number {
  try {
    const now = new Date();
    const inTZ  = new Date(now.toLocaleString("en-US", { timeZone: tz }));
    const inUTC = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }));
    return (inTZ.getTime() - inUTC.getTime()) / 3600000;
  } catch {
    return 0;
  }
}

function tzEntryFromIANA(tz: string) {
  return (
    ALL_TIMEZONES.find((t) => t.tz === tz) ?? {
      name: tz.split("/").pop()?.replace(/_/g, " ") ?? tz,
      tz,
      emoji: "🌐",
    }
  );
}

const DEFAULT_TZ_SET = new Set(DEFAULT_TIMEZONES.map((t) => t.tz));

export function DualClockModule() {
  const { clock, setSelectedTimezone, toggleTimeFormat, addCustomTimezone, removeCustomTimezone } =
    useClockStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTimezoneSelector, setShowTimezoneSelector] = useState(false);
  const [showAddTimezone, setShowAddTimezone] = useState(false);

  // Resolve stored value — handles legacy display names
  const resolvedTZ =
    LEGACY_NAME_MAP[clock.selectedTimezone] ?? clock.selectedTimezone ?? "Europe/London";

  const selectedTZ = tzEntryFromIANA(resolvedTZ);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date, timezone?: string) => {
    return date.toLocaleTimeString("en-GB", {
      timeZone: timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
      hour12: !clock.is24Hour,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date, timezone?: string) => {
    return date.toLocaleDateString("en-GB", {
      timeZone: timezone,
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // DST-aware diff using real UTC offsets
  const localTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localOffset = getTZOffset(localTZ);
  const remoteOffset = getTZOffset(resolvedTZ);
  const timeDiff = remoteOffset - localOffset;
  const absDiff = Math.abs(timeDiff);
  const diffHours = Math.floor(absDiff);
  const diffMins = Math.round((absDiff - diffHours) * 60);
  const sign = timeDiff > 0 ? "+" : timeDiff < 0 ? "-" : "";
  const diffText =
    timeDiff === 0
      ? "SAME"
      : diffMins > 0
      ? `${sign}${diffHours}:${diffMins.toString().padStart(2, "0")}h`
      : `${sign}${diffHours}h`;

  // Build selector list: defaults + custom (no duplicates)
  const customTZObjects = clock.customTimezones.map(tzEntryFromIANA);
  const allSelectorTZs = [
    ...DEFAULT_TIMEZONES,
    ...customTZObjects.filter((tz) => !DEFAULT_TZ_SET.has(tz.tz)),
  ];
  const selectorSet = new Set(allSelectorTZs.map((t) => t.tz));
  const availableToAdd = ALL_TIMEZONES.filter((t) => !selectorSet.has(t.tz));

  const handleSelectTZ = (tz: string) => {
    setSelectedTimezone(tz); // store IANA name
    setShowTimezoneSelector(false);
    setShowAddTimezone(false);
  };

  return (
    <div className="module-panel rounded-lg p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">DUAL CLOCK</h3>
        <Button variant="switch" size="sm" onClick={toggleTimeFormat}>
          {clock.is24Hour ? "24H" : "12H"}
        </Button>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-8 relative">
        {/* Local Time */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="font-mono">LISBOA 🏠</span>
          </div>
          <div className="text-5xl font-mono font-bold text-primary">
            {formatTime(currentTime)}
          </div>
          <div className="text-sm text-muted-foreground font-mono">
            {formatDate(currentTime)}
          </div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-primary/30"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-3 text-xs font-mono text-accent">
              {diffText}
            </span>
          </div>
        </div>

        {/* Remote Timezone */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="w-4 h-4" />
            <button
              onClick={() => {
                setShowTimezoneSelector(!showTimezoneSelector);
                setShowAddTimezone(false);
              }}
              className="font-mono hover:text-accent transition-colors cursor-pointer"
            >
              {selectedTZ.name.toUpperCase()} {selectedTZ.emoji}
            </button>
          </div>
          <div className="text-5xl font-mono font-bold text-accent">
            {formatTime(currentTime, resolvedTZ)}
          </div>
          <div className="text-sm text-muted-foreground font-mono">
            {formatDate(currentTime, resolvedTZ)}
          </div>
        </div>

        {/* Timezone Selector */}
        {showTimezoneSelector && !showAddTimezone && (
          <div className="absolute inset-x-6 bottom-6 glass rounded p-4 animate-fade-in">
            <div className="grid grid-cols-2 gap-2">
              {allSelectorTZs.map((tz) => (
                <div key={tz.tz} className="relative">
                  <Button
                    variant={selectedTZ.tz === tz.tz ? "cockpit" : "outline"}
                    size="sm"
                    onClick={() => handleSelectTZ(tz.tz)}
                    className="justify-start w-full"
                  >
                    <span className="mr-2">{tz.emoji}</span>
                    <span className="text-xs">{tz.name}</span>
                  </Button>
                  {!DEFAULT_TZ_SET.has(tz.tz) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCustomTimezone(tz.tz);
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center hover:bg-destructive/80 z-10"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              onClick={() => setShowAddTimezone(true)}
            >
              <Plus className="w-3 h-3 mr-1" />
              ADD TIMEZONE
            </Button>
          </div>
        )}

        {/* Add Timezone Picker */}
        {showTimezoneSelector && showAddTimezone && (
          <div className="absolute inset-x-6 bottom-6 glass rounded p-4 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-muted-foreground">SELECT TIMEZONE</span>
              <button
                onClick={() => setShowAddTimezone(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
              {availableToAdd.map((tz) => (
                <Button
                  key={tz.tz}
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  onClick={() => {
                    addCustomTimezone(tz.tz);
                    setShowAddTimezone(false);
                  }}
                >
                  <span className="mr-1.5">{tz.emoji}</span>
                  <span className="text-xs truncate">{tz.name}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Status Indicator */}
      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mt-4">
        <div className="w-2 h-2 rounded-full bg-success pulse-glow" />
        TIME SYNC ACTIVE
      </div>
    </div>
  );
}
