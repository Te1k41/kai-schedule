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
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

// ---- PASTE YOUR CONFIG HERE ----
const firebaseConfig = {
  apiKey: "PASTE_API_KEY",
  authDomain: "PASTE_PROJECT_ID.firebaseapp.com",
  projectId: "PASTE_PROJECT_ID",
  storageBucket: "PASTE_PROJECT_ID.appspot.com",
  messagingSenderId: "PASTE_SENDER_ID",
  appId: "PASTE_APP_ID"
};
// ---------------------------------

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
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
  try {
    const ref = doc(db, "users", user.uid, "data", key);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data().value : null;
  } catch (e) {
    console.error("loadData failed for", key, e);
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
