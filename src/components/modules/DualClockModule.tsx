import { useState, useEffect } from "react";
import { Clock, Globe } from "lucide-react";
import { Button } from "../ui/button";

const timezones = [
  { name: "New York", offset: -5, emoji: "🗽" },
  { name: "London", offset: 0, emoji: "🇬🇧" },
  { name: "Paris", offset: 1, emoji: "🇫🇷" },
  { name: "Tokyo", offset: 9, emoji: "🗾" },
  { name: "Sydney", offset: 11, emoji: "🇦🇺" },
  { name: "Dubai", offset: 4, emoji: "🏜️" },
];

export function DualClockModule() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimezone, setSelectedTimezone] = useState(timezones[0]);
  const [is24Hour, setIs24Hour] = useState(true);
  const [showTimezoneSelector, setShowTimezoneSelector] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date, offset: number = 0) => {
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    const localTime = new Date(utc + 3600000 * offset);
    
    return localTime.toLocaleTimeString("en-US", {
      hour12: !is24Hour,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const localOffset = -new Date().getTimezoneOffset() / 60;
  const timeDiff = selectedTimezone.offset - localOffset;
  const diffText =
    timeDiff > 0 ? `+${timeDiff}h` : timeDiff < 0 ? `${timeDiff}h` : "SAME";

  return (
    <div className="module-panel rounded-lg p-3 h-full flex flex-col overflow-hidden relative">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">DUAL CLOCK</h3>
        <Button
          variant="switch"
          size="sm"
          onClick={() => setIs24Hour(!is24Hour)}
          className="h-6 min-h-0 text-[10px]"
        >
          {is24Hour ? "24H" : "12H"}
        </Button>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-4 min-h-0">
        {/* Local Time */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span className="font-mono text-[10px]">LISBOA</span>
          </div>
          <div className="text-3xl font-mono font-bold text-primary">
            {formatTime(currentTime)}
          </div>
          <div className="text-[10px] text-muted-foreground font-mono">
            {formatDate(currentTime)}
          </div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-primary/30"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-2 text-[10px] font-mono text-accent">
              {diffText}
            </span>
          </div>
        </div>

        {/* Selected Timezone */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Globe className="w-3 h-3" />
            <button
              onClick={() => setShowTimezoneSelector(!showTimezoneSelector)}
              className="font-mono text-[10px] hover:text-accent transition-colors min-h-0 min-w-0"
            >
              {selectedTimezone.name.toUpperCase()} {selectedTimezone.emoji}
            </button>
          </div>
          <div className="text-3xl font-mono font-bold text-accent">
            {formatTime(currentTime, selectedTimezone.offset)}
          </div>
          <div className="text-[10px] text-muted-foreground font-mono">
            {formatDate(currentTime)}
          </div>
        </div>

        {/* Timezone Selector */}
        {showTimezoneSelector && (
          <div className="absolute inset-x-3 bottom-8 glass rounded p-3 animate-fade-in z-20">
            <div className="grid grid-cols-2 gap-1.5">
              {timezones.map((tz) => (
                <Button
                  key={tz.name}
                  variant={
                    selectedTimezone.name === tz.name ? "cockpit" : "outline"
                  }
                  size="sm"
                  onClick={() => {
                    setSelectedTimezone(tz);
                    setShowTimezoneSelector(false);
                  }}
                  className="justify-start h-7 min-h-0"
                >
                  <span className="mr-1">{tz.emoji}</span>
                  <span className="text-[10px]">{tz.name}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Status Indicator */}
      <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground mt-2 flex-shrink-0">
        <div className="w-1.5 h-1.5 rounded-full bg-success pulse-glow" />
        TIME SYNC ACTIVE
      </div>
    </div>
  );
}
