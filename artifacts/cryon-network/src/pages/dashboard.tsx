import { useState, useCallback } from "react";
import { Link } from "wouter";
import {
  Wallet, ShieldCheck, Copy, Check, ExternalLink, Activity,
  Clock, Hash, ArrowLeft, User, Star, AlertTriangle
} from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useSolanaStatus } from "@/hooks/useSolanaStatus";
import { TransactionToast, useTransactionToast } from "@/components/TransactionToast";
import { WalletButton } from "@/components/WalletButton";

const PROGRAM_ID = "DbXQctgDjcERBX9PitvBUsY18gAvNLKnfHwiU4DfvDF5";

function CopyField({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex items-center gap-2 bg-[rgba(0,245,255,0.03)] border border-[rgba(0,245,255,0.1)] rounded-xl px-4 py-3">
      <div className="flex-1 min-w-0">
        <div className="text-xs text-[rgba(255,255,255,0.35)] mb-1 uppercase tracking-wider">{label}</div>
        <code className="text-[#00f5ff] text-sm font-mono break-all" data-testid={`field-${label.toLowerCase().replace(/ /g, "-")}`}>
          {value}
        </code>
      </div>
      <button
        onClick={handleCopy}
        className="flex-shrink-0 p-2 rounded-lg hover:bg-[rgba(0,245,255,0.1)] text-[rgba(0,245,255,0.5)] hover:text-[#00f5ff] transition-all"
        data-testid={`button-copy-${label.toLowerCase().replace(/ /g, "-")}`}
      >
        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
      </button>
    </div>
  );
}

function IdentityBadge({ status }: { status: "verified" | "pending" | "none" }) {
  const config = {
    verified: { color: "#00f5ff", bg: "rgba(0,245,255,0.1)", border: "rgba(0,245,255,0.25)", label: "Verified", icon: <ShieldCheck size={16} /> },
    pending: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)", label: "Pending", icon: <Clock size={16} /> },
    none: { color: "rgba(255,255,255,0.35)", bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.1)", label: "Not Registered", icon: <User size={16} /> },
  };
  const cfg = config[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border"
      style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
      data-testid="badge-identity-status"
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

const MOCK_TX_HISTORY = [
  { sig: "3xBvK9mLqP1...fR7t", type: "Identity Init", status: "success", time: "2 mins ago", slot: 312_847_291 },
  { sig: "8hGnW4aQsY2...dC5m", type: "Ownership Claim", status: "success", time: "14 mins ago", slot: 312_846_102 },
  { sig: "1kZpJ3bEwR6...gA9x", type: "Metadata Update", status: "processing", time: "22 mins ago", slot: 312_845_088 },
];

export default function Dashboard() {
  const wallet = useWallet();
  const solana = useSolanaStatus();
  const txToast = useTransactionToast();
  const [identityStatus] = useState<"verified" | "pending" | "none">("verified");
  const [ownershipScore] = useState(94);
  const [copied, setCopied] = useState(false);

  const handleSimulateTx = useCallback(async () => {
    txToast.showProcessing("Submitting micro-payment to Cryon Network...");
    await new Promise((r) => setTimeout(r, 2200));
    const success = Math.random() > 0.15;
    if (success) {
      txToast.showSuccess("Transaction confirmed on Solana Devnet", "5kXmN9pQrT2cBvY4wA8hGjE1dLfZ3uS6iR7oP0eMqC");
    } else {
      txToast.showError("Transaction simulation failed. Check your wallet balance.");
    }
  }, [txToast]);

  if (!wallet.connected) {
    return (
      <div className="min-h-screen cyber-grid flex items-center justify-center px-4">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle, rgba(0,245,255,0.06) 0%, transparent 70%)" }} />
        </div>
        <div className="relative glass-card rounded-3xl p-10 max-w-md w-full text-center border border-[rgba(0,245,255,0.15)]" data-testid="panel-no-wallet">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(0,245,255,0.1)", border: "1px solid rgba(0,245,255,0.2)" }}>
            <Wallet size={28} className="text-[#00f5ff]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Connect Your Wallet</h2>
          <p className="text-[rgba(255,255,255,0.5)] mb-2 text-sm leading-relaxed">
            Access your Sovereign Identity dashboard by connecting a compatible Solana wallet.
          </p>
          <div className="flex flex-col gap-2 mb-6 text-left">
            {[
              { color: "#ab9ff2", name: "Phantom", url: "https://phantom.app" },
              { color: "#ff8c00", name: "Solflare", url: "https://solflare.com" },
            ].map((w) => (
              <div key={w.name} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] text-sm text-[rgba(255,255,255,0.6)]">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: w.color }} />
                {w.name}
                <a href={w.url} target="_blank" rel="noopener noreferrer" className="ml-auto text-[rgba(255,255,255,0.3)] hover:text-[#00f5ff] transition-colors">
                  <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
          {wallet.error && (
            <div className="flex items-start gap-2 p-3 mb-4 rounded-xl bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] text-sm text-red-400 text-left" data-testid="error-no-wallet">
              <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
              {wallet.error}
            </div>
          )}
          <div className="flex justify-center">
            <WalletButton wallet={wallet} />
          </div>
          <Link href="/">
            <button className="mt-4 flex items-center gap-1.5 text-xs text-[rgba(255,255,255,0.35)] hover:text-[rgba(255,255,255,0.6)] transition-colors mx-auto" data-testid="link-back-home">
              <ArrowLeft size={12} />
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cyber-grid relative">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96" style={{ background: "radial-gradient(circle at 100% 0%, rgba(168,85,247,0.08) 0%, transparent 60%)" }} />
        <div className="absolute bottom-0 left-0 w-96 h-96" style={{ background: "radial-gradient(circle at 0% 100%, rgba(0,245,255,0.06) 0%, transparent 60%)" }} />
      </div>

      <div className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Identity Dashboard</h1>
            <p className="text-sm text-[rgba(255,255,255,0.4)] mt-1">Cryon Network &mdash; Sovereign Identity Protocol</p>
          </div>
          <Link href="/">
            <button className="flex items-center gap-1.5 text-sm text-[rgba(255,255,255,0.4)] hover:text-[#00f5ff] transition-colors" data-testid="link-back-home-dash">
              <ArrowLeft size={14} />
              Home
            </button>
          </Link>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-[rgba(0,245,255,0.15)] mb-6" data-testid="panel-wallet-info">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(0,245,255,0.2), rgba(168,85,247,0.2))", border: "1px solid rgba(0,245,255,0.25)" }}>
                  <User size={24} className="text-[#00f5ff]" />
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f5ff] opacity-40" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#22c55e] border-2 border-[hsl(235_45%_7%)]" />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white font-mono">{wallet.truncateKey(wallet.publicKey)}</span>
                  <IdentityBadge status={identityStatus} />
                </div>
                <div className="text-xs text-[rgba(255,255,255,0.4)] mt-1 capitalize">Connected via {wallet.provider}</div>
              </div>
            </div>
            <button
              onClick={handleSimulateTx}
              className="neon-btn-solid flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold self-start sm:self-auto"
              data-testid="button-simulate-tx"
            >
              <Zap size={15} />
              Send Micro-Payment
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          <div className="lg:col-span-2 space-y-4">
            <div className="glass-card rounded-2xl p-6" data-testid="panel-identity-details">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#00f5ff]" />
                Sovereign Identity Details
              </h2>
              <div className="space-y-3">
                <CopyField value={wallet.publicKey!} label="Public Key" />
                <CopyField value={PROGRAM_ID} label="Program ID" />
                <div className="flex items-center gap-2 bg-[rgba(0,245,255,0.03)] border border-[rgba(0,245,255,0.1)] rounded-xl px-4 py-3">
                  <div className="flex-1">
                    <div className="text-xs text-[rgba(255,255,255,0.35)] mb-1 uppercase tracking-wider">Network</div>
                    <div className="text-sm font-semibold text-[#00f5ff]">Solana Devnet</div>
                  </div>
                  <a
                    href={`https://solscan.io/account/${wallet.publicKey}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-[rgba(0,245,255,0.6)] hover:text-[#00f5ff] transition-colors"
                    data-testid="link-view-account"
                  >
                    <ExternalLink size={12} />
                    View Account
                  </a>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6" data-testid="panel-tx-history">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Activity size={16} className="text-[#00f5ff]" />
                Recent Transactions
              </h2>
              <div className="space-y-2">
                {MOCK_TX_HISTORY.map((tx, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[rgba(0,245,255,0.03)] transition-all border border-transparent hover:border-[rgba(0,245,255,0.08)]"
                    data-testid={`tx-row-${i}`}
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        background: tx.status === "success" ? "#22c55e" : tx.status === "processing" ? "#00f5ff" : "#ef4444",
                        boxShadow: `0 0 6px ${tx.status === "success" ? "#22c55e" : tx.status === "processing" ? "#00f5ff" : "#ef4444"}`,
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{tx.type}</span>
                        <span className="text-xs text-[rgba(255,255,255,0.3)] font-mono">{tx.sig}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1 text-xs text-[rgba(255,255,255,0.35)]">
                          <Clock size={10} />
                          {tx.time}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-[rgba(255,255,255,0.35)]">
                          <Hash size={10} />
                          Slot {tx.slot.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <a
                      href={`https://solscan.io/tx/${tx.sig.replace("...", "xxxx")}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[rgba(255,255,255,0.25)] hover:text-[#00f5ff] transition-colors flex-shrink-0"
                    >
                      <ExternalLink size={12} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-6" data-testid="panel-ownership-score">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Star size={16} className="text-[#00f5ff]" />
                Ownership Score
              </h2>
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0,245,255,0.1)" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="40" fill="none"
                      stroke="#00f5ff" strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 40 * ownershipScore / 100} ${2 * Math.PI * 40}`}
                      style={{ filter: "drop-shadow(0 0 6px #00f5ff)" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-black text-[#00f5ff]" data-testid="stat-ownership-score">{ownershipScore}</div>
                      <div className="text-xs text-[rgba(255,255,255,0.4)]">/ 100</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Identity Verified", done: true },
                  { label: "Wallet Linked", done: true },
                  { label: "Smart Contract Signed", done: true },
                  { label: "Mainnet Migration", done: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-sm">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? "bg-[rgba(0,245,255,0.2)] border border-[#00f5ff]" : "bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)]"}`}>
                      {item.done && <Check size={10} className="text-[#00f5ff]" />}
                    </div>
                    <span className={item.done ? "text-[rgba(255,255,255,0.7)]" : "text-[rgba(255,255,255,0.3)]"}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6" data-testid="panel-network-stats">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Activity size={16} className="text-[#00f5ff]" />
                Network
              </h2>
              <div className="space-y-3">
                {[
                  { label: "Current Slot", value: solana.slot != null ? solana.slot.toLocaleString() : "—" },
                  { label: "Network TPS", value: solana.tps != null ? `${solana.tps.toLocaleString()} /s` : "—" },
                  { label: "Latency", value: solana.latency != null ? `${solana.latency}ms` : "—" },
                  { label: "Status", value: solana.status === "online" ? "Healthy" : solana.status === "checking" ? "Checking..." : solana.status },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-[rgba(255,255,255,0.4)]">{label}</span>
                    <span className="font-mono text-[#00f5ff] font-semibold" data-testid={`net-${label.toLowerCase().replace(/ /g, "-")}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {txToast.toast && (
        <TransactionToast
          status={txToast.toast.status}
          message={txToast.toast.message}
          txHash={txToast.toast.txHash}
          onClose={txToast.close}
        />
      )}
    </div>
  );
}

function Zap({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
