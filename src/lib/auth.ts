import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "./firebase";

export interface AdminSession {
  user: {
    uid: string;
    email: string | null;
    emailVerified: boolean;
  };
}

function parseAdminEmails(): string[] {
  const raw = import.meta.env.VITE_ADMIN_EMAILS ?? "fgwaro@kabarak.ac.ke,admin@goldtribe.co.ke";

  return raw
    .split(",")
    .map((e: string) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminUser(user: FirebaseUser | { email?: string | null } | null | undefined): boolean {
  if (!user?.email) return false;

  const allowed = parseAdminEmails();
  if (allowed.length === 0) return false;

  return allowed.includes(user.email.toLowerCase());
}

function toAdminSession(user: FirebaseUser): AdminSession {
  return {
    user: {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
    },
  };
}

export async function signInAdmin(email: string, password: string): Promise<{ user: FirebaseUser; session: AdminSession }> {
  const cleanEmail = email.trim().toLowerCase();

  if (!auth) {
    throw new Error("Firebase Authentication is not initialized. Check environment configuration.");
  }

  const credential = await signInWithEmailAndPassword(auth, cleanEmail, password);
  const firebaseUser = credential.user;

  if (!firebaseUser) {
    throw new Error("Unable to authenticate admin user.");
  }

  if (!isAdminUser(firebaseUser)) {
    await signOut(auth);
    throw new Error("This account is not authorized for admin access.");
  }

  const session = toAdminSession(firebaseUser);
  return { user: firebaseUser, session };
}

export async function signOutAdmin(): Promise<void> {
  try {
    localStorage.removeItem("goldtribe_admin_session");
  } catch {}

  if (auth) {
    await signOut(auth);
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  if (!auth) {
    return null;
  }

  const currentUser = auth.currentUser;
  if (currentUser && isAdminUser(currentUser)) {
    return toAdminSession(currentUser);
  }

  return new Promise((resolve) => {
    if (!auth) {
      resolve(null);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user && isAdminUser(user)) {
        resolve(toAdminSession(user));
      } else {
        resolve(null);
      }
    });
  });
}

export function onAdminAuthChange(
  callback: (session: AdminSession | null) => void
): { unsubscribe: () => void } {
  if (!auth) {
    return { unsubscribe: () => {} };
  }

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user && !isAdminUser(user)) {
      signOut(auth!).catch(() => {});
      callback(null);
      return;
    }

    callback(user ? toAdminSession(user) : null);
  });

  return { unsubscribe };
}
