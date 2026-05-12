import { useState, useEffect, useCallback } from "react";

export type WalletProvider = "phantom" | "solflare";

export interface WalletState {
  connected: boolean;
  publicKey: string | null;
  provider: WalletProvider | null;
  connecting: boolean;
  error: string | null;
}

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      isSolflare?: boolean;
      connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      publicKey?: { toString: () => string };
      isConnected?: boolean;
    };
    solflare?: {
      isSolflare?: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      publicKey?: { toString: () => string };
      isConnected?: boolean;
    };
  }
}

function detectWallet(): { provider: WalletProvider; obj: NonNullable<Window["solana"]> } | null {
  if (window.solana?.isPhantom) return { provider: "phantom", obj: window.solana };
  if (window.solana?.isSolflare) return { provider: "solflare", obj: window.solana };
  if (window.solflare?.isSolflare) {
    return { provider: "solflare", obj: window.solflare as NonNullable<Window["solana"]> };
  }
  return null;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    connected: false,
    publicKey: null,
    provider: null,
    connecting: false,
    error: null,
  });

  useEffect(() => {
    const detected = detectWallet();
    if (!detected) return;
    const { obj, provider } = detected;
    if (obj.isConnected && obj.publicKey) {
      setState((s) => ({
        ...s,
        connected: true,
        publicKey: obj.publicKey!.toString(),
        provider,
      }));
    }
    const handleDisconnect = () => {
      setState({ connected: false, publicKey: null, provider: null, connecting: false, error: null });
    };
    (obj as unknown as EventTarget).addEventListener?.("disconnect", handleDisconnect);
    return () => {
      (obj as unknown as EventTarget).removeEventListener?.("disconnect", handleDisconnect);
    };
  }, []);

  const connect = useCallback(async (preferredProvider?: WalletProvider) => {
    setState((s) => ({ ...s, connecting: true, error: null }));
    try {
      const detected = detectWallet();
      if (!detected) {
        let walletUrl = "https://phantom.app";
        if (preferredProvider === "solflare") walletUrl = "https://solflare.com";
        setState((s) => ({
          ...s,
          connecting: false,
          error: `No compatible wallet found. Please install ${preferredProvider === "solflare" ? "Solflare" : "Phantom"} wallet.`,
        }));
        window.open(walletUrl, "_blank");
        return;
      }
      const { obj, provider } = detected;
      const result = await obj.connect();
      const publicKey = result.publicKey.toString();
      setState({ connected: true, publicKey, provider, connecting: false, error: null });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Connection rejected by user.";
      setState((s) => ({ ...s, connecting: false, error: msg }));
    }
  }, []);

  const disconnect = useCallback(async () => {
    const detected = detectWallet();
    if (detected) {
      try {
        await detected.obj.disconnect();
      } catch {
      }
    }
    setState({ connected: false, publicKey: null, provider: null, connecting: false, error: null });
  }, []);

  const truncateKey = (key: string | null) => {
    if (!key) return "";
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  };

  return { ...state, connect, disconnect, truncateKey };
}
