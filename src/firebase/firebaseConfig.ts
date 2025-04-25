// src/firebase/firebaseConfig.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD2dr_tE2i8kkKsiSJYujlPIfnCTXp-S-4",
  authDomain: "circulomedico1234.firebaseapp.com",
  projectId: "circulomedico1234",
  storageBucket: "circulomedico1234.appspot.com",
  messagingSenderId: "292572112647",
  appId: "1:292572112647:web:e8b0e70d49c94750d907a2",
  measurementId: "G-26Q6QB985F"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
