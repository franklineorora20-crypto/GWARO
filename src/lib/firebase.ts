import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import firebaseConfigData from "../../firebase-applet-config.json";

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

try {
  if (firebaseConfigData && firebaseConfigData.apiKey) {
    if (!getApps().length) {
      app = initializeApp({
        apiKey: firebaseConfigData.apiKey,
        authDomain: firebaseConfigData.authDomain,
        projectId: firebaseConfigData.projectId,
        storageBucket: firebaseConfigData.storageBucket,
        messagingSenderId: firebaseConfigData.messagingSenderId,
        appId: firebaseConfigData.appId,
      });
    } else {
      app = getApp();
    }

    if (firebaseConfigData.firestoreDatabaseId) {
      db = getFirestore(app, firebaseConfigData.firestoreDatabaseId);
    } else {
      db = getFirestore(app);
    }

    auth = getAuth(app);
  }
} catch (error) {
  console.warn("Firebase initialization notice:", error);
}

export { app, db, auth };
export const isFirebaseConfigured = Boolean(db);
