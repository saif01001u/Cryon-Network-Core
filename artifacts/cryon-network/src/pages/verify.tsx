import { useState, useCallback } from "react";
import { ExternalLink, Search, CheckCircle, AlertTriangle, Loader2, Copy, Check } from "lucide-react";

const PROGRAM_ID = "DbXQctgDjcERBX9PitvBUsY18gAvNLKnfHwiU4DfvDF5";
const DEVNET_RPC = import.meta.env.DEV ? "/solana-rpc" : "https://api.devnet.solana.com";

type VerifyState = "idle" | "loading" | "found" | "not-found" | "error";

function isValidBase58(address: string) {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

async function rpcCall(method: string, params: unknown[] = []) {
  const response = await fetch(DEVNET_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  if (!response.ok) throw new Error(`RPC ${response.status}`);
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

export default function Verify() {
  const [address, setAddress] = useState("");
  const [verifyState, setVerifyState] = useState<VerifyState>("idle");
  const [accountInfo, setAccountInfo] = useState<{
    lamports: number;
    owner: string;
    executable: boolean;
    dataLen: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const handleVerify = useCallback(async () => {
    const trimmed = address.trim();
    if (!trimmed) return;
    if (!isValidBase58(trimmed)) {
      setErrorMsg("Invalid Solana address format. Must be a valid base58 public key (32-44 chars).");
      setVerifyState("error");
      return;
    }
    setVerifyState("loading");
    setAccountInfo(null);
    setErrorMsg("");
    try {
      const result = await rpcCall("getAccountInfo", [trimmed, { encoding: "base64" }]);
      if (result && result.value) {
        const info = result.value;
        setAccountInfo({
          lamports: info.lamports,
          owner: info.owner,
          executable: info.executable,
          dataLen: Array.isArray(info.data) ? info.data[0].length : 0,
        });
        setVerifyState("found");
      } else {
        setVerifyState("not-found");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error. Try again.";
      setErrorMsg(`Could not reach Solana Devnet: ${msg}`);
      setVerifyState("error");
    }
  }, [address]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleVerify();
  };

  const handleCopyPid = () => {
    navigator.clipboard.writeText(PROGRAM_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const prefillProgram = () => {
    setAddress(PROGRAM_ID);
    setVerifyState("idle");
    setAccountInfo(null);
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen cyber-grid relative">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-0 w-96 h-96" style={{ background: "radial-gradient(circle at 100% 0%, rgba(0,245,255,0.06) 0%, transparent 60%)" }} />
        <div className="absolute bottom-0 left-1/3 w-80 h-80" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%)" }} />
      </div>

      <div className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">On-Chain Verification</h1>
          <p className="text-[rgba(255,255,255,0.5)] text-base">
            Look up any Solana account or verify the Cryon Network smart contract on Devnet.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 mb-6 border border-[rgba(0,245,255,0.15)]" data-testid="panel-program-id-verify">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00f5ff]" style={{ boxShadow: "0 0 8px #00f5ff" }} />
              <span className="text-xs font-semibold text-[rgba(255,255,255,0.5)] uppercase tracking-widest">
                Official Cryon Network Program ID
              </span>
            </div>
            <button
              onClick={prefillProgram}
              className="text-xs text-[rgba(0,245,255,0.6)] hover:text-[#00f5ff] transition-colors"
              data-testid="button-prefill-program"
            >
              Look up &rarr;
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 flex-1 bg-[rgba(0,245,255,0.03)] border border-[rgba(0,245,255,0.1)] rounded-xl px-4 py-3">
              <code className="text-[#00f5ff] text-sm font-mono flex-1 break-all" data-testid="text-official-pid">
                {PROGRAM_ID}
              </code>
              <button onClick={handleCopyPid} className="flex-shrink-0 text-[rgba(0,245,255,0.5)] hover:text-[#00f5ff] transition-colors" data-testid="button-copy-pid-verify">
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
            </div>
            <a
              href={`https://solscan.io/account/${PROGRAM_ID}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="neon-btn flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap"
              data-testid="link-verify-official"
            >
              <ExternalLink size={14} />
              Open on Solscan
            </a>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-[rgba(0,245,255,0.15)]" data-testid="panel-custom-lookup">
          <h2 className="text-base font-bold text-white mb-4">Lookup Any Address</h2>
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a Solana public key..."
              className="flex-1 bg-[rgba(0,245,255,0.03)] border border-[rgba(0,245,255,0.15)] rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-[rgba(255,255,255,0.25)] focus:outline-none focus:border-[rgba(0,245,255,0.4)] focus:bg-[rgba(0,245,255,0.05)] transition-all"
              data-testid="input-address-lookup"
            />
            <button
              onClick={handleVerify}
              disabled={!address.trim() || verifyState === "loading"}
              className="neon-btn-solid flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="button-verify-address"
            >
              {verifyState === "loading" ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              Verify
            </button>
          </div>

          {verifyState === "found" && accountInfo && (
            <div className="p-4 rounded-xl bg-[rgba(0,245,255,0.05)] border border-[rgba(0,245,255,0.2)]" data-testid="result-found">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={16} className="text-green-400" />
                <span className="text-sm font-semibold text-green-400">Account Found on Solana Devnet</span>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Balance", value: `${(accountInfo.lamports / 1e9).toFixed(6)} SOL` },
                  { label: "Owner Program", value: accountInfo.owner },
                  { label: "Executable", value: accountInfo.executable ? "Yes — Smart Contract" : "No — Wallet / Data Account" },
                  { label: "Data Size", value: `${accountInfo.dataLen} bytes` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start gap-3 text-sm">
                    <span className="text-[rgba(255,255,255,0.4)] w-28 flex-shrink-0">{label}</span>
                    <code className="text-[#00f5ff] font-mono break-all">{value}</code>
                  </div>
                ))}
              </div>
              <a
                href={`https://solscan.io/account/${address.trim()}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center gap-1.5 text-xs text-[rgba(0,245,255,0.6)] hover:text-[#00f5ff] transition-colors"
                data-testid="link-open-solscan-result"
              >
                <ExternalLink size={11} />
                View full account on Solscan
              </a>
            </div>
          )}

          {verifyState === "not-found" && (
            <div className="p-4 rounded-xl bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.2)]" data-testid="result-not-found">
              <div className="flex items-center gap-2 text-sm text-amber-400">
                <AlertTriangle size={15} />
                Account not found on Solana Devnet. The address may be on Mainnet or have zero balance.
              </div>
            </div>
          )}

          {verifyState === "error" && errorMsg && (
            <div className="p-4 rounded-xl bg-[rgba(239,68,68,0.05)] border border-[rgba(239,68,68,0.2)]" data-testid="result-error">
              <div className="flex items-start gap-2 text-sm text-red-400">
                <AlertTriangle size={15} className="mt-0.5 flex-shrink-0" />
                {errorMsg}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 glass-card rounded-xl p-4 border border-[rgba(168,85,247,0.15)]" style={{ background: "rgba(168,85,247,0.04)" }}>
          <p className="text-xs text-[rgba(255,255,255,0.4)] text-center">
            All lookups query the Solana Devnet RPC directly. Cryon Network does not log or store any address you enter.
          </p>
        </div>
      </div>
    </div>
  );
}
