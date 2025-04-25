import { useEffect, useState } from "react";
import { auth } from "../../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export default function MapaProfissional() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        setUserEmail(user.email);
        const storage = getStorage();
        const fotoRef = ref(storage, `fotos-perfil/${user.email}.jpg`);
        try {
          const url = await getDownloadURL(fotoRef);
          setFotoUrl(url);
        } catch (err) {
          console.log("Foto não encontrada para:", user.email);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Bem-vindo(a) ao seu painel</h2>
      {userEmail && <p>E-mail: {userEmail}</p>}
      {fotoUrl ? (
        <img
          src={fotoUrl}
          alt="Sua foto de perfil"
          style={{ width: "150px", height: "200px", objectFit: "cover", border: "1px solid #ccc", borderRadius: "8px" }}
        />
      ) : (
        <p>Foto não encontrada ou ainda não enviada.</p>
      )}
    </div>
  );
}
