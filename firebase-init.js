// Shared Firebase setup for schedule.html and roadmap.html.
// Fill in firebaseConfig below with the values from:
// Firebase Console > Project settings > General > Your apps > SDK setup and configuration

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  doc,
  getDoc,
  getDocFromCache,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

// ---- PASTE YOUR CONFIG HERE ----
const firebaseConfig = {
  apiKey: "AIzaSyD5FCnhuIRs0egvzGD2O8R1TCQtsvPhe84",
  authDomain: "kai-schedule-731c0.firebaseapp.com",
  projectId: "kai-schedule-731c0",
  storageBucket: "kai-schedule-731c0.firebasestorage.app",
  messagingSenderId: "154363716987",
  appId: "1:154363716987:web:9b12e0e8d5158cfffe49de"
};
// ---------------------------------

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});
const provider = new GoogleAuthProvider();

export function signIn() {
  return signInWithPopup(auth, provider);
}

export function signOutUser() {
  return signOut(auth);
}

// callback receives the Firebase user object, or null if signed out
export function watchAuth(callback) {
  onAuthStateChanged(auth, callback);
}

// Reads a JSON-serializable value stored under `key` for the signed-in user.
// Returns null if nothing is stored yet or no one is signed in.
export async function loadData(key) {
  const user = auth.currentUser;
  if (!user) return null;
  const ref = doc(db, "users", user.uid, "data", key);
  try {
    const cached = await getDocFromCache(ref).catch(() => null);
    if (cached && cached.exists()) return cached.data().value;
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data().value : null;
  } catch (e) {
    console.error("loadData failed for", key, e);
    return null;
  }
}

// Reads a value stored under `key` for a DIFFERENT user (read-only sharing —
// Firestore rules decide whether this is allowed; returns null if not).
export async function loadPartnerData(otherUid, key) {
  try {
    const ref = doc(db, "users", otherUid, "data", key);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data().value : null;
  } catch (e) {
    console.error("loadPartnerData failed for", otherUid, key, e);
    return null;
  }
}

// Saves a JSON-serializable value under `key` for the signed-in user.
export async function saveData(key, value) {
  const user = auth.currentUser;
  if (!user) return false;
  try {
    const ref = doc(db, "users", user.uid, "data", key);
    await setDoc(ref, { value, updatedAt: Date.now() });
    return true;
  } catch (e) {
    console.error("saveData failed for", key, e);
    return false;
  }
}
