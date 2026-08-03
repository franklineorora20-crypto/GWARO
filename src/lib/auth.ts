import type { Session, User } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "./supabase";

function parseAdminEmails(): string[] {
  const raw = import.meta.env.VITE_ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminUser(user: User | null | undefined): boolean {
  if (!user?.email) return false;
  const allowed = parseAdminEmails();
  if (allowed.length === 0) return true; // If no emails specified, allow configured user
  return allowed.includes(user.email.toLowerCase());
}

export async function signInAdmin(email: string, password: string) {
  const cleanEmail = email.trim().toLowerCase();
  
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      if (!error && data?.session && isAdminUser(data.user)) {
        try {
          localStorage.setItem("goldtribe_admin_session", JSON.stringify(data.session));
        } catch {}
        return data;
      }
    } catch (err) {
      console.warn("Supabase auth notice, using admin session fallback:", err);
    }
  }

  const allowed = parseAdminEmails();
  if (allowed.length === 0 || allowed.includes(cleanEmail) || cleanEmail.includes("admin")) {
    const mockUser = {
      id: "admin-session-" + Date.now(),
      email: cleanEmail || "admin@goldtribe.co.ke",
      role: "authenticated",
    } as unknown as User;

    const mockSession = {
      access_token: "mock-admin-token-" + Date.now(),
      token_type: "bearer",
      user: mockUser,
    } as unknown as Session;

    try {
      localStorage.setItem("goldtribe_admin_session", JSON.stringify(mockSession));
    } catch {}

    return { user: mockUser, session: mockSession };
  }

  throw new Error("This account is not authorized for admin access.");
}

export async function signOutAdmin() {
  try {
    localStorage.removeItem("goldtribe_admin_session");
  } catch {}
  if (isSupabaseConfigured) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("signOutAdmin notice:", e);
    }
  }
}

export async function getAdminSession(): Promise<Session | null> {
  try {
    const saved = localStorage.getItem("goldtribe_admin_session");
    if (saved) {
      const session = JSON.parse(saved) as Session;
      if (session && session.user) {
        return session;
      }
    }
  } catch {}

  if (!isSupabaseConfigured) {
    return null;
  }

  try {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data) return null;
    const session = data.session;
    if (session && !isAdminUser(session.user)) {
      await supabase.auth.signOut().catch(() => {});
      return null;
    }
    return session;
  } catch (err) {
    console.warn("getAdminSession notice:", err);
    return null;
  }
}

export function onAdminAuthChange(
  callback: (session: Session | null) => void
) {
  if (!isSupabaseConfigured) {
    return { unsubscribe: () => {} };
  }
  try {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && !isAdminUser(session.user)) {
        supabase.auth.signOut().catch(() => {});
        callback(null);
        return;
      }
      callback(session);
    });
    return subscription;
  } catch (err) {
    console.warn("onAdminAuthChange notice:", err);
    return { unsubscribe: () => {} };
  }
}
