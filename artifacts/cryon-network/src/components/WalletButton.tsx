import { useState } from "react";
import { Wallet, ChevronDown, LogOut, Copy, Check, AlertCircle } from "lucide-react";
import type { WalletState } from "@/hooks/useWallet";

interface WalletButtonProps {
  wallet: WalletState & {
    connect: (provider?: "phantom" | "solflare") => Promise<void>;
    disconnect: () => Promise<void>;
    truncateKey: (key: string | null) => string;
  };
}

export function WalletButton({ wallet }: WalletButtonProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleCopy = () => {
    if (wallet.publicKey) {
      navigator.clipboard.writeText(wallet.publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (wallet.connected && wallet.publicKey) {
    return (
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[rgba(0,245,255,0.3)] bg-[rgba(0,245,255,0.08)] text-[#00f5ff] text-sm font-medium hover:border-[rgba(0,245,255,0.5)] hover:bg-[rgba(0,245,255,0.12)] transition-all"
          data-testid="button-wallet-connected"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f5ff] opacity-40" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f5ff]" />
          </span>
          {wallet.truncateKey(wallet.publicKey)}
          <ChevronDown size={14} />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-2 w-56 z-50 glass-card rounded-xl border border-[rgba(0,245,255,0.2)] p-2 shadow-xl" data-testid="menu-wallet">
              <div className="px-3 py-2 border-b border-[rgba(0,245,255,0.1)] mb-1">
                <div className="text-xs text-[rgba(255,255,255,0.4)] mb-1">Connected via</div>
                <div className="text-sm font-semibold text-[#00f5ff] capitalize">{wallet.provider}</div>
              </div>
              <button
                onClick={handleCopy}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[rgba(255,255,255,0.7)] hover:text-[#00f5ff] hover:bg-[rgba(0,245,255,0.06)] rounded-lg transition-all"
                data-testid="button-copy-address"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy Address"}
              </button>
              <button
                onClick={() => { wallet.disconnect(); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[rgba(255,255,255,0.7)] hover:text-red-400 hover:bg-[rgba(239,68,68,0.06)] rounded-lg transition-all"
                data-testid="button-disconnect"
              >
                <LogOut size={14} />
                Disconnect
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  if (pickerOpen) {
    return (
      <div className="relative">
        <div className="absolute right-0 top-0 w-52 z-50 glass-card rounded-xl border border-[rgba(0,245,255,0.2)] p-2 shadow-xl" data-testid="menu-wallet-picker">
          <div className="px-3 py-2 border-b border-[rgba(0,245,255,0.1)] mb-1">
            <div className="text-xs text-[rgba(255,255,255,0.5)]">Select Wallet</div>
          </div>
          {[
            { id: "phantom" as const, label: "Phantom", color: "#ab9ff2" },
            { id: "solflare" as const, label: "Solflare", color: "#ff8c00" },
          ].map((w) => (
            <button
              key={w.id}
              onClick={() => { wallet.connect(w.id); setPickerOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[rgba(255,255,255,0.8)] hover:text-white hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-all"
              data-testid={`button-wallet-${w.id}`}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: w.color }} />
              {w.label}
            </button>
          ))}
          <button
            onClick={() => setPickerOpen(false)}
            className="w-full px-3 py-1.5 text-xs text-[rgba(255,255,255,0.35)] hover:text-[rgba(255,255,255,0.6)] transition-colors mt-1"
          >
            Cancel
          </button>
        </div>
        <div className="fixed inset-0 z-40" onClick={() => setPickerOpen(false)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={() => setPickerOpen(true)}
        disabled={wallet.connecting}
        className="neon-btn flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        data-testid="button-connect-wallet"
      >
        <Wallet size={15} />
        {wallet.connecting ? "Connecting..." : "Connect Wallet"}
      </button>
      {wallet.error && (
        <div className="flex items-center gap-1 text-xs text-red-400 max-w-48 text-right" data-testid="error-wallet">
          <AlertCircle size={11} />
          <span className="truncate">{wallet.error}</span>
        </div>
      )}
    </div>
  );
}
