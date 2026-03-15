import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 pt-[env(safe-area-inset-top)] pb-2">
      <div className="text-center space-y-4">
        <div className="text-6xl font-mono font-bold text-destructive">404</div>
        <div className="text-xs font-mono text-muted-foreground tracking-widest">SIGNAL LOST</div>
        <p className="text-sm text-muted-foreground font-mono mt-4">
          Route not found — returning to base.
        </p>
        <Button variant="cockpit" onClick={() => navigate("/")}>
          RETURN TO COCKPIT
        </Button>
      </div>
    </div>
  );
}
