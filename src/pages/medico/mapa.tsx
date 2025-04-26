
import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function MapaProfissional() {
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>Página Mapa Profissional funcionando corretamente!</h2>
    </div>
  );
}
