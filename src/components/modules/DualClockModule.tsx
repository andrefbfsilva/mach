import { useState, useEffect } from "react";
import { Clock, Globe } from "lucide-react";
import { Button } from "../ui/button";

const ALL_TIMEZONES = [
  { name: "Portugal", region: "Lisboa", iana: "Europe/Lisbon", flag: "PT" },
  { name: "Espanha", region: "Madrid", iana: "Europe/Madrid", flag: "ES" },
  { name: "Fran\u00e7a", region: "Paris", iana: "Europe/Paris", flag: "FR" },
  { name: "Alemanha", region: "Berlim", iana: "Europe/Berlin", flag: "DE" },
  { name: "Reino Unido", region: "Londres", iana: "Europe/London", flag: "GB" },
  { name: "Canad\u00e1", region: "Qu\u00e9bec", iana: "America/Montreal", flag: "CA" },
  { name: "India", region: "Karnataka", iana: "Asia/Kolkata", flag: "IN" },
  { name: "USA", region: "Alabama", iana: "America/Chicago", flag: "US" },
];

const COLORS = ["text-primary", "text-accent", "text-success", "text-[hsl(24,100%,56%)]"];

export function DualClockModule() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(true);
  const [slots, setSlots] = useState([
    ALL_TIMEZONES[0], // Portugal
    ALL_TIMEZONES[4], // Reino Unido
    ALL_TIMEZONES[5], // Canad\u00e1
    ALL_TIMEZONES[6], // India
  ]);
  const [editingSlot, setEditingSlot] = useState<number | null>(null);

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
      timeZone: iana,
    });
  };

  const formatDate = (date: Date, iana: string) => {
    return date.toLocaleDateString("pt-PT", {
      weekday: "short",
      day: "numeric",
      month: "short",
      timeZone: iana,
    });
  };

  const handleSelectTimezone = (tz: typeof ALL_TIMEZONES[0]) => {
    if (editingSlot !== null) {
      const newSlots = [...slots];
      newSlots[editingSlot] = tz;
      setSlots(newSlots);
      setEditingSlot(null);
    }
  };

  const usedIanas = slots.map(s => s.iana);
  const availableTimezones = ALL_TIMEZONES.filter(tz => !usedIanas.includes(tz.iana));

  return (
    <div className="module-panel rounded-lg p-3 h-full flex flex-col overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold">WORLD CLOCK</h3>
        <Button
          variant="switch"
          size="sm"
          onClick={() => setIs24Hour(!is24Hour)}
          className="h-6 min-h-0 text-[10px]"
        >
          {is24Hour ? "24H" : "12H"}
        </Button>
      </div>

      {/* 4 Timezone Rows */}
      <div className="flex-1 flex flex-col justify-between min-h-0 py-1">
        {slots.map((tz, i) => (
          <div key={tz.iana} className="flex items-center justify-between">
            <div className="min-w-0">
              <button
                onClick={() => setEditingSlot(editingSlot === i ? null : i)}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-accent transition-colors min-h-0 min-w-0"
              >
                {i === 0 ? <Clock className="w-3 h-3 flex-shrink-0" /> : <Globe className="w-3 h-3 flex-shrink-0" />}
                <span className="font-mono text-[10px] truncate">
                  {tz.flag} {tz.name.toUpperCase()}
                </span>
              </button>
              <div className="text-[10px] text-muted-foreground/60 font-mono pl-[18px]">
                {formatDate(currentTime, tz.iana)}
              </div>
            </div>
            <div className={`text-2xl font-mono font-bold ${COLORS[i]} tabular-nums`}>
              {formatTime(currentTime, tz.iana)}
            </div>
          </div>
        ))}
      </div>

      {/* Timezone Selector Overlay */}
      {editingSlot !== null && (
        <div className="absolute inset-x-3 bottom-8 glass rounded p-3 animate-fade-in z-20">
          <div className="text-[10px] font-mono text-muted-foreground mb-2">SELECT TIMEZONE</div>
          <div className="grid grid-cols-2 gap-1.5">
            {availableTimezones.map((tz) => (
              <Button
                key={tz.iana}
                variant="outline"
                size="sm"
                onClick={() => handleSelectTimezone(tz)}
                className="justify-start h-7 min-h-0"
              >
                <span className="mr-1 text-[10px]">{tz.flag}</span>
                <span className="text-[10px]">{tz.name}</span>
              </Button>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditingSlot(null)}
            className="w-full mt-1.5 h-6 min-h-0 text-[10px]"
          >
            CANCEL
          </Button>
        </div>
      )}

      {/* Status Indicator */}
      <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground mt-1 flex-shrink-0">
        <div className="w-1.5 h-1.5 rounded-full bg-success pulse-glow" />
        TIME SYNC ACTIVE
      </div>
    </div>
  );
}
