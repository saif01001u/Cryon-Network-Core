import { useCallback } from "react";
import { Link } from "wouter";
import { Shield, Zap, Globe, Lock, ArrowRight, ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";
import { CryonLogo } from "@/components/CryonLogo";
import { SystemStatus } from "@/components/SystemStatus";
import { WalletButton } from "@/components/WalletButton";
import { useWallet } from "@/hooks/useWallet";

const PROGRAM_ID = "DbXQctgDjcERBX9PitvBUsY18gAvNLKnfHwiU4DfvDF5";

const features = [
  {
    icon: <Shield size={22} />,
    title: "Sovereign Identity",
    desc: "Cryptographically verified on-chain identity anchored to your Solana wallet — no middlemen, no custody.",
  },
  {
    icon: <Zap size={22} />,
    title: "Instant Finality",
    desc: "Transactions settle in under 400ms on Solana's proof-of-history chain. Feel the speed of true web3.",
  },
  {
    icon: <Globe size={22} />,
    title: "Decentralized Verification",
    desc: "Every action is verified against our open-source smart contract. Inspect the code on Solscan anytime.",
  },
  {
    icon: <Lock size={22} />,
    title: "Non-Custodial Security",
    desc: "We never touch your private keys. Connect only with public key permissions via Phantom or Solflare.",
  },
];

const stats = [
  { label: "Program Verified", value: "On-Chain" },
  { label: "Network", value: "Solana" },
  { label: "Environment", value: "Devnet" },
  { label: "Key Permission", value: "Public Only" },
];

function ProgramIdBadge() {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(PROGRAM_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <div className="glass-card rounded-2xl p-5 border border-[rgba(0,245,255,0.15)]" data-testid="panel-program-id">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00f5ff]" style={{ boxShadow: "0 0 8px #00f5ff" }} />
          <span className="text-xs font-semibold text-[rgba(255,255,255,0.5)] uppercase tracking-widest">
            Solana Program ID
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`https://solscan.io/account/${PROGRAM_ID}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-[rgba(0,245,255,0.6)] hover:text-[#00f5ff] transition-colors"
            data-testid="link-verify-solscan"
          >
            <ExternalLink size={11} />
            Verify on Solscan
          </a>
        </div>
      </div>
      <div className="flex items-center gap-3 bg-[rgba(0,245,255,0.03)] rounded-xl px-4 py-3 border border-[rgba(0,245,255,0.08)]">
        <code className="text-[#00f5ff] text-sm font-mono flex-1 break-all leading-relaxed" data-testid="text-program-id">
          {PROGRAM_ID}
        </code>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 p-2 rounded-lg hover:bg-[rgba(0,245,255,0.1)] text-[rgba(0,245,255,0.5)] hover:text-[#00f5ff] transition-all"
          data-testid="button-copy-pid"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
        </button>
      </div>
      <p className="text-xs text-[rgba(255,255,255,0.35)] mt-3">
        This smart contract is publicly auditable. Anyone can verify every transaction and instruction on-chain.
      </p>
    </div>
  );
}

export default function Home() {
  const wallet = useWallet();

  return (
    <div className="min-h-screen cyber-grid relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full glow-pulse-slow"
          style={{ background: "radial-gradient(circle, rgba(0,245,255,0.12) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -top-20 -right-40 w-80 h-80 rounded-full glow-pulse"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-64"
          style={{ background: "radial-gradient(ellipse, rgba(0,245,255,0.06) 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        <div className="text-center mb-20">
          <div className="flex justify-center mb-8">
            <div className="float">
              <CryonLogo size={96} animated />
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(0,245,255,0.2)] bg-[rgba(0,245,255,0.05)] text-xs text-[#00f5ff] font-medium mb-6">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f5ff] opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00f5ff]" />
            </span>
            Live on Solana Devnet
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-none">
            <span className="shimmer-text">Cryon Network</span>
          </h1>
          <p className="text-xl sm:text-2xl text-[rgba(255,255,255,0.55)] max-w-2xl mx-auto leading-relaxed mb-10">
            Sovereign identity infrastructure for the decentralized web. Verified on-chain, owned by you.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {wallet.connected ? (
              <Link href="/dashboard">
                <button className="neon-btn-solid flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-bold" data-testid="button-go-dashboard">
                  Open Dashboard
                  <ArrowRight size={18} />
                </button>
              </Link>
            ) : (
              <WalletButton wallet={wallet} />
            )}
            <a
              href={`https://solscan.io/account/${PROGRAM_ID}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="neon-btn flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-semibold"
              data-testid="link-verify-contract"
            >
              <ExternalLink size={16} />
              Verify Contract
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {stats.map((s) => (
            <div
              key={s.label}
              className="glass-card glass-card-hover rounded-xl p-4 text-center"
              data-testid={`stat-${s.label.toLowerCase().replace(/ /g, "-")}`}
            >
              <div className="text-lg font-bold text-[#00f5ff] mb-1">{s.value}</div>
              <div className="text-xs text-[rgba(255,255,255,0.4)] uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col gap-3"
                  data-testid={`feature-card-${i}`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-[#00f5ff]"
                    style={{ background: "rgba(0,245,255,0.1)", border: "1px solid rgba(0,245,255,0.2)" }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1.5">{f.title}</h3>
                    <p className="text-sm text-[rgba(255,255,255,0.5)] leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <ProgramIdBadge />
            <SystemStatus />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-8 text-center border border-[rgba(168,85,247,0.2)]" style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.06), rgba(0,245,255,0.04))" }}>
          <h2 className="text-2xl font-bold text-white mb-3">Ready to claim your sovereign identity?</h2>
          <p className="text-[rgba(255,255,255,0.5)] mb-6 max-w-lg mx-auto">
            Connect your Phantom or Solflare wallet to access the Cryon Network dashboard. Only public key permissions required.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-[rgba(255,255,255,0.35)]">
            {["No private keys", "Non-custodial", "Open-source contract", "Auditable on-chain"].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <Check size={14} className="text-[#00f5ff]" />
                {item}
              </span>
            ))}
          </div>
        </div>

      </div>

      <footer className="relative border-t border-[rgba(0,245,255,0.08)] py-8 px-4 text-center">
        <p className="text-xs text-[rgba(255,255,255,0.3)]">
          Cryon Network &copy; {new Date().getFullYear()} &mdash; Smart contract publicly auditable on Solscan &middot; Solana Devnet
        </p>
      </footer>
    </div>
  );
}
