import { useState, useEffect, useCallback } from "react";

export type NetworkStatus = "online" | "degraded" | "offline" | "checking";

export interface SolanaStatus {
  status: NetworkStatus;
  slot: number | null;
  tps: number | null;
  latency: number | null;
  lastChecked: Date | null;
}

const DEVNET_RPC_DIRECT = "https://api.devnet.solana.com";
const DEVNET_RPC = import.meta.env.DEV ? "/solana-rpc" : DEVNET_RPC_DIRECT;
const PROGRAM_ID = "DbXQctgDjcERBX9PitvBUsY18gAvNLKnfHwiU4DfvDF5";

async function rpcCall(method: string, params: unknown[] = []) {
  const response = await fetch(DEVNET_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  if (!response.ok) throw new Error(`RPC error: ${response.status}`);
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.result;
}

export function useSolanaStatus() {
  const [status, setStatus] = useState<SolanaStatus>({
    status: "checking",
    slot: null,
    tps: null,
    latency: null,
    lastChecked: null,
  });

  const check = useCallback(async () => {
    setStatus((s) => ({ ...s, status: "checking" }));
    const start = performance.now();
    try {
      const [slot, perfResult] = await Promise.all([
        rpcCall("getSlot"),
        rpcCall("getRecentPerformanceSamples", [1]),
      ]);
      const latency = Math.round(performance.now() - start);
      const tps =
        Array.isArray(perfResult) && perfResult.length > 0
          ? Math.round(perfResult[0].numTransactions / perfResult[0].samplePeriodSecs)
          : null;
      const networkStatus: NetworkStatus = latency < 1500 ? "online" : "degraded";
      setStatus({ status: networkStatus, slot, tps, latency, lastChecked: new Date() });
    } catch {
      const latency = Math.round(performance.now() - start);
      setStatus({ status: "offline", slot: null, tps: null, latency, lastChecked: new Date() });
    }
  }, []);

  useEffect(() => {
    check();
    const interval = setInterval(check, 30_000);
    return () => clearInterval(interval);
  }, [check]);

  return { ...status, programId: PROGRAM_ID, devnetRpc: DEVNET_RPC, refresh: check };
}
