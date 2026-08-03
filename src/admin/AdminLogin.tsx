import React, { useState } from "react";
import { Lock, Mail, Shield, AlertCircle } from "lucide-react";
import { signInAdmin } from "../lib/auth";

interface AdminLoginProps {
  onSuccess: () => void;
  adminEmailsConfigured: boolean;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onSuccess,
  adminEmailsConfigured,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInAdmin(email, password);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#1a0d33] via-[#341168] to-[#1c1b1b] flex items-center justify-center p-4 font-worksans">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#fed65b] text-[#341168] mb-4 shadow-lg">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-manrope text-white">
            Goldtribe Admin
          </h1>
          <p className="text-white/70 text-sm mt-2">
            Secure access to orders and operations
          </p>
        </div>

        {!adminEmailsConfigured && (
          <div className="mb-4 p-3 rounded-xl bg-purple-900/40 border border-[#fed65b]/40 text-purple-100 text-xs flex gap-2">
            <Shield className="w-4 h-4 shrink-0 mt-0.5 text-[#fed65b]" />
            <span>
              <strong>Admin Mode Ready:</strong> You can log in with <code className="font-mono bg-white/10 px-1 rounded">admin@goldtribe.co.ke</code> or any authorized admin email.
            </span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 border border-[#e5e2e1]"
        >
          {error && (
            <div className="p-3 rounded-xl bg-red-50 text-red-800 text-sm border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-[#341168] font-manrope block mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7b7581]" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e5e2e1] bg-[#f6f3f2] text-sm focus:outline-none focus:ring-2 focus:ring-[#341168]"
                placeholder="admin@goldtribe.co.ke"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#341168] font-manrope block mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7b7581]" />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e5e2e1] bg-[#f6f3f2] text-sm focus:outline-none focus:ring-2 focus:ring-[#341168]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#341168] text-white font-bold font-manrope text-sm hover:bg-[#4b2c7f] disabled:opacity-50 transition-colors cursor-pointer"
          >
            {loading ? "Signing in…" : "Sign in to Dashboard"}
          </button>
        </form>

        <p className="text-center text-white/50 text-xs mt-6">
          <a href="/" className="hover:text-[#fed65b] transition-colors">
            ← Back to customer site
          </a>
        </p>
      </div>
    </div>
  );
};
