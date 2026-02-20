import { useState, useEffect } from "react";
import { Clock, Globe } from "lucide-react";
import { Button } from "../ui/button";

const timezones = [
  { name: "Portugal", region: "Lisboa", iana: "Europe/Lisbon", flag: "PT" },
  { name: "Espanha", region: "Madrid", iana: "Europe/Madrid", flag: "ES" },
  { name: "Fran\u00e7a", region: "Paris", iana: "Europe/Paris", flag: "FR" },
  { name: "Alemanha", region: "Berlim", iana: "Europe/Berlin", flag: "DE" },
  { name: "Reino Unido", region: "Londres", iana: "Europe/London", flag: "GB" },
  { name: "Canad\u00e1", region: "Qu\u00e9bec", iana: "America/Montreal", flag: "CA" },
  { name: "India", region: "Karnataka", iana: "Asia/Kolkata", flag: "IN" },
  { name: "USA", region: "Alabama", iana: "America/Chicago", flag: "US" },
];

const LOCAL_TZ = timezones[0]; // Portugal

export function DualClockModule() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimezone, setSelectedTimezone] = useState(timezones[5]); // Canada by default
  const [is24Hour, setIs24Hour] = useState(true);
  const [showTimezoneSelector, setShowTimezoneSelector] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date, iana: string) => {
    return date.toLocaleTimeString("pt-PT", {
      hour12: !is24Hour,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: iana,
    });
  };

  const formatDate = (date: Date, iana: string) => {
    return date.toLocaleDateString("pt-PT", {
      weekday: "short",
      month: "short",
      day: "numeric",
      timeZone: iana,
    });
  };

  const getOffsetHours = (date: Date, iana: string) => {
    const str = date.toLocaleString("en-US", { timeZone: iana, timeZoneName: "shortOffset" });
    const match = str.match(/GMT([+-]\d+(?::\d+)?)/);
    if (!match) return 0;
    const parts = match[1].split(":");
    return parseInt(parts[0]) + (parts[1] ? parseInt(parts[1]) / 60 : 0);
  };

  const localOffsetH = getOffsetHours(currentTime, LOCAL_TZ.iana);
  const selectedOffsetH = getOffsetHours(currentTime, selectedTimezone.iana);
  const diff = selectedOffsetH - localOffsetH;
  const diffText =
    diff > 0 ? `+${diff}h` : diff < 0 ? `${diff}h` : "SAME";

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

      <div className="flex-1 flex flex-col justify-center gap-3 min-h-0">
        {/* Local Time - Portugal */}
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span className="font-mono text-[10px]">{LOCAL_TZ.flag} {LOCAL_TZ.name.toUpperCase()} &middot; {LOCAL_TZ.region.toUpperCase()}</span>
          </div>
          <div className="text-3xl font-mono font-bold text-primary">
            {formatTime(currentTime, LOCAL_TZ.iana)}
          </div>
          <div className="text-[10px] text-muted-foreground font-mono">
            {formatDate(currentTime, LOCAL_TZ.iana)}
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
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Globe className="w-3 h-3" />
            <button
              onClick={() => setShowTimezoneSelector(!showTimezoneSelector)}
              className="font-mono text-[10px] hover:text-accent transition-colors min-h-0 min-w-0"
            >
              {selectedTimezone.flag} {selectedTimezone.name.toUpperCase()} &middot; {selectedTimezone.region.toUpperCase()}
            </button>
          </div>
          <div className="text-3xl font-mono font-bold text-accent">
            {formatTime(currentTime, selectedTimezone.iana)}
          </div>
          <div className="text-[10px] text-muted-foreground font-mono">
            {formatDate(currentTime, selectedTimezone.iana)}
          </div>
        </div>

        {/* Timezone Selector */}
        {showTimezoneSelector && (
          <div className="absolute inset-x-3 bottom-8 glass rounded p-3 animate-fade-in z-20">
            <div className="grid grid-cols-2 gap-1.5">
              {timezones.filter(tz => tz.iana !== LOCAL_TZ.iana).map((tz) => (
                <Button
                  key={tz.iana}
                  variant={
                    selectedTimezone.iana === tz.iana ? "cockpit" : "outline"
                  }
                  size="sm"
                  onClick={() => {
                    setSelectedTimezone(tz);
                    setShowTimezoneSelector(false);
                  }}
                  className="justify-start h-7 min-h-0"
                >
                  <span className="mr-1 text-[10px]">{tz.flag}</span>
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
