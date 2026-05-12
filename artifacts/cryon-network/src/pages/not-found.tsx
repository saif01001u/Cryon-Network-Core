import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { CryonLogo } from "@/components/CryonLogo";

export default function NotFound() {
  return (
    <div className="min-h-screen cyber-grid flex items-center justify-center px-4">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(0,245,255,0.05) 0%, transparent 70%)" }} />
      </div>
      <div className="relative text-center">
        <div className="flex justify-center mb-6">
          <CryonLogo size={64} animated />
        </div>
        <div className="text-8xl font-black text-[#00f5ff] mb-4" style={{ textShadow: "0 0 40px rgba(0,245,255,0.4)" }}>
          404
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-[rgba(255,255,255,0.45)] mb-8 max-w-sm mx-auto">
          This route does not exist in the Cryon Network. Please verify the URL and try again.
        </p>
        <Link href="/">
          <button className="neon-btn-solid flex items-center gap-2 px-6 py-3 rounded-xl font-bold mx-auto" data-testid="button-back-home-404">
            <ArrowLeft size={16} />
            Return Home
          </button>
        </Link>
      </div>
    </div>
  );
}
