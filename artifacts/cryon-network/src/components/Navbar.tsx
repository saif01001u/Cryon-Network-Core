import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ExternalLink, Copy, Check } from "lucide-react";
import { CryonLogo, CryonWordmark } from "./CryonLogo";
import { SystemStatus } from "./SystemStatus";
import { WalletButton } from "./WalletButton";
import { useWallet } from "@/hooks/useWallet";

const PROGRAM_ID = "DbXQctgDjcERBX9PitvBUsY18gAvNLKnfHwiU4DfvDF5";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Verify", href: "/verify" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [location] = useLocation();
  const wallet = useWallet();

  const handleCopy = () => {
    navigator.clipboard.writeText(PROGRAM_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-card border-b border-[rgba(0,245,255,0.12)] backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 group">
              <CryonLogo size={36} animated />
              <CryonWordmark height={20} />
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    location === link.href
                      ? "text-[#00f5ff] bg-[rgba(0,245,255,0.1)] border border-[rgba(0,245,255,0.2)]"
                      : "text-[rgba(255,255,255,0.6)] hover:text-[#00f5ff] hover:bg-[rgba(0,245,255,0.05)]"
                  }`}
                  data-testid={`nav-link-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <SystemStatus compact />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-[rgba(0,245,255,0.7)] border border-[rgba(0,245,255,0.15)] rounded-md hover:border-[rgba(0,245,255,0.4)] hover:text-[#00f5ff] transition-all duration-200 bg-[rgba(0,245,255,0.03)]"
                title="Copy Program ID"
                data-testid="button-copy-program-id"
              >
                {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                <span className="hidden lg:inline">
                  {PROGRAM_ID.slice(0, 6)}...{PROGRAM_ID.slice(-4)}
                </span>
                <span className="lg:hidden">PID</span>
              </button>
              <a
                href={`https://solscan.io/account/${PROGRAM_ID}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 text-xs text-[rgba(255,255,255,0.5)] hover:text-[#00f5ff] transition-colors"
                data-testid="link-solscan"
              >
                <ExternalLink size={12} />
                Solscan
              </a>
              <WalletButton wallet={wallet} />
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-[rgba(255,255,255,0.7)] hover:text-[#00f5ff] transition-colors"
              data-testid="button-mobile-menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-[rgba(0,245,255,0.1)] px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 text-sm font-medium rounded-md transition-all ${
                  location === link.href
                    ? "text-[#00f5ff] bg-[rgba(0,245,255,0.1)]"
                    : "text-[rgba(255,255,255,0.6)] hover:text-[#00f5ff]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 flex items-center gap-3 flex-wrap">
              <SystemStatus compact />
              <WalletButton wallet={wallet} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
