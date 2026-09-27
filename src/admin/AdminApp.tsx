import React, { useEffect, useState } from "react";
import { getAdminSession, onAdminAuthChange, type AdminSession } from "../lib/auth";
import { AdminLogin } from "./AdminLogin";
import { AdminDashboard } from "./AdminDashboard";

export default function AdminApp() {
  const [session, setSession] = useState<AdminSession | null>(null);
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
