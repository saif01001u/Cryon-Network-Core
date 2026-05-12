import { RefreshCw, Wifi, WifiOff, Activity } from "lucide-react";
import { useSolanaStatus } from "@/hooks/useSolanaStatus";

interface SystemStatusProps {
  compact?: boolean;
}

export function SystemStatus({ compact = false }: SystemStatusProps) {
  const { status, slot, tps, latency, lastChecked, refresh } = useSolanaStatus();

  const statusConfig = {
    online: {
      color: "#22c55e",
      label: "Online",
      bg: "rgba(34,197,94,0.1)",
      border: "rgba(34,197,94,0.25)",
      icon: <Wifi size={12} />,
    },
    degraded: {
      color: "#f59e0b",
      label: "Degraded",
      bg: "rgba(245,158,11,0.1)",
      border: "rgba(245,158,11,0.25)",
      icon: <Activity size={12} />,
    },
    offline: {
      color: "#ef4444",
      label: "Offline",
      bg: "rgba(239,68,68,0.1)",
      border: "rgba(239,68,68,0.25)",
      icon: <WifiOff size={12} />,
    },
    checking: {
      color: "#00f5ff",
      label: "Checking",
      bg: "rgba(0,245,255,0.08)",
      border: "rgba(0,245,255,0.2)",
      icon: <RefreshCw size={12} className="animate-spin" />,
    },
  };

  const cfg = statusConfig[status];

  if (compact) {
    return (
      <div
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-all cursor-pointer"
        style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
        onClick={refresh}
        title={`Solana Devnet — ${cfg.label}${latency ? ` (${latency}ms)` : ""}`}
        data-testid="status-system"
      >
        <span className="relative flex items-center justify-center" style={{ width: 8, height: 8 }}>
          {status === "online" && (
            <span
              className="absolute inset-0 rounded-full animate-ping"
              style={{ background: cfg.color, opacity: 0.5 }}
            />
          )}
          <span className="relative rounded-full" style={{ width: 6, height: 6, background: cfg.color }} />
        </span>
        <span className="hidden sm:inline">Devnet</span>
        <span className="sm:hidden">{cfg.label}</span>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-5 space-y-4" data-testid="panel-system-status">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[rgba(255,255,255,0.8)]">System Status</h3>
        <button
          onClick={refresh}
          className="p-1.5 rounded-md hover:bg-[rgba(0,245,255,0.08)] text-[rgba(255,255,255,0.4)] hover:text-[#00f5ff] transition-all"
          data-testid="button-refresh-status"
        >
          <RefreshCw size={14} className={status === "checking" ? "animate-spin" : ""} />
        </button>
      </div>

      <div
        className="flex items-center gap-3 p-3 rounded-lg border"
        style={{ background: cfg.bg, borderColor: cfg.border }}
      >
        <span className="relative flex items-center justify-center" style={{ width: 12, height: 12 }}>
          {status === "online" && (
            <span
              className="absolute inset-0 rounded-full animate-ping"
              style={{ background: cfg.color, opacity: 0.4 }}
            />
          )}
          <span className="relative rounded-full" style={{ width: 10, height: 10, background: cfg.color }} />
        </span>
        <div>
          <div className="text-sm font-semibold" style={{ color: cfg.color }}>
            Solana Devnet — {cfg.label}
          </div>
          {lastChecked && (
            <div className="text-xs text-[rgba(255,255,255,0.35)] mt-0.5">
              Updated {lastChecked.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Slot", value: slot != null ? slot.toLocaleString() : "—", unit: "" },
          { label: "TPS", value: tps != null ? tps.toLocaleString() : "—", unit: "" },
          { label: "Latency", value: latency != null ? latency : "—", unit: latency != null ? "ms" : "" },
        ].map(({ label, value, unit }) => (
          <div key={label} className="bg-[rgba(0,245,255,0.03)] border border-[rgba(0,245,255,0.08)] rounded-lg p-3 text-center">
            <div className="text-sm font-bold text-[#00f5ff]" data-testid={`stat-${label.toLowerCase()}`}>
              {value}{unit}
            </div>
            <div className="text-[10px] text-[rgba(255,255,255,0.35)] mt-1 uppercase tracking-wider">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
