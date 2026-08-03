import React, { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getAdminSession, onAdminAuthChange } from "../lib/auth";
import { AdminLogin } from "./AdminLogin";
import { AdminDashboard } from "./AdminDashboard";

function adminEmailsConfigured(): boolean {
  const raw = import.meta.env.VITE_ADMIN_EMAILS ?? "";
  return raw.split(",").some((e) => e.trim().length > 0);
}

export default function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    getAdminSession().then((s) => {
      setSession(s);
      setBooting(false);
    });
    const sub = onAdminAuthChange(setSession);
    return () => sub.unsubscribe();
  }, []);

  if (booting) {
    return (
      <div className="min-h-screen bg-[#341168] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#fed65b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <AdminLogin
        adminEmailsConfigured={adminEmailsConfigured()}
        onSuccess={() => {
          getAdminSession().then(setSession);
        }}
      />
    );
  }

  return (
    <AdminDashboard
      session={session}
      onSignedOut={() => setSession(null)}
    />
  );
}
