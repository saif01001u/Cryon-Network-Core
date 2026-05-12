import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Loader2, X } from "lucide-react";

export type TxStatus = "processing" | "success" | "error";

interface TransactionToastProps {
  status: TxStatus;
  message?: string;
  txHash?: string;
  onClose: () => void;
}

export function TransactionToast({ status, message, txHash, onClose }: TransactionToastProps) {
  useEffect(() => {
    if (status === "success" || status === "error") {
      const t = setTimeout(onClose, 5000);
      return () => clearTimeout(t);
    }
  }, [status, onClose]);

  const config = {
    processing: {
      icon: <Loader2 size={20} className="animate-spin text-[#00f5ff]" />,
      title: "Processing Transaction",
      border: "rgba(0,245,255,0.3)",
      bg: "rgba(0,245,255,0.06)",
    },
    success: {
      icon: <CheckCircle size={20} className="text-green-400" />,
      title: "Transaction Confirmed",
      border: "rgba(34,197,94,0.3)",
      bg: "rgba(34,197,94,0.06)",
    },
    error: {
      icon: <XCircle size={20} className="text-red-400" />,
      title: "Transaction Failed",
      border: "rgba(239,68,68,0.3)",
      bg: "rgba(239,68,68,0.06)",
    },
  };

  const cfg = config[status];

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-2xl max-w-sm w-full transition-all"
      style={{ background: cfg.bg, borderColor: cfg.border }}
      data-testid="toast-transaction"
    >
      {cfg.icon}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-white">{cfg.title}</div>
        {message && <div className="text-xs text-[rgba(255,255,255,0.55)] mt-0.5">{message}</div>}
        {txHash && (
          <a
            href={`https://solscan.io/tx/${txHash}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#00f5ff] hover:underline mt-1 block truncate"
            data-testid="link-tx-hash"
          >
            {txHash.slice(0, 12)}...{txHash.slice(-8)}
          </a>
        )}
      </div>
      <button onClick={onClose} className="text-[rgba(255,255,255,0.35)] hover:text-white transition-colors flex-shrink-0">
        <X size={14} />
      </button>
    </div>
  );
}

export function useTransactionToast() {
  const [toast, setToast] = useState<{ status: TxStatus; message?: string; txHash?: string } | null>(null);

  const showProcessing = (message?: string) => setToast({ status: "processing", message });
  const showSuccess = (message?: string, txHash?: string) => setToast({ status: "success", message, txHash });
  const showError = (message?: string) => setToast({ status: "error", message });
  const close = () => setToast(null);

  return { toast, showProcessing, showSuccess, showError, close };
}
