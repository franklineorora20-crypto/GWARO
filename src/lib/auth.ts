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

  // No configured admin emails = nobody is an admin
  if (allowed.length === 0) return false;

  return allowed.includes(user.email.toLowerCase());
}

export async function signInAdmin(email: string, password: string) {
  const cleanEmail = email.trim().toLowerCase();

  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured.");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user || !data.session) {
    throw new Error("Unable to create admin session.");
  }

  if (!isAdminUser(data.user)) {
    await supabase.auth.signOut();
    throw new Error("This account is not authorized for admin access.");
  }

  try {
    localStorage.setItem(
      "goldtribe_admin_session",
      JSON.stringify(data.session)
    );
  } catch {}

  return data;
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
  // First check the saved Supabase session
  try {
    const saved = localStorage.getItem("goldtribe_admin_session");

    if (saved) {
      const session = JSON.parse(saved) as Session;

      if (session?.user) {
        if (!isAdminUser(session.user)) {
          localStorage.removeItem("goldtribe_admin_session");
          return null;
        }

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

    if (!session) return null;

    if (!isAdminUser(session.user)) {
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