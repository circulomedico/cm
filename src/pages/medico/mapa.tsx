import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function MapaProfissional() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [profissao, setProfissao] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user?.email) {
        setUserEmail(user.email);

        // Foto de perfil
        try {
          const storage = getStorage();
          const fotoRef = ref(storage, `fotos-perfil/${user.email}.jpg`);
          const url = await getDownloadURL(fotoRef);
          setFotoUrl(url);
        } catch (err) {
          console.log("Foto não encontrada.");
        }

        // Dados do Firestore
        try {
          const docRef = doc(db, "profissionais", user.email);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const dados = docSnap.data();
            setNome(dados.nome || "");
            setProfissao(dados.profissao || "");
            setEspecialidade(dados.especialidade || "");
          }
        } catch (err) {
          console.log("Erro ao carregar dados do Firestore:", err);
        }

        setCarregando(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const salvarDados = async () => {
    if (!userEmail) return;
    setSalvando(true);
    try {
      await setDoc(doc(db, "profissionais", userEmail), {
        nome,
        profissao,
        especialidade,
      });
      alert("Dados salvos com sucesso!");
    } catch (err) {
      alert("Erro ao salvar dados.");
      console.error(err);
    }
    setSalvando(false);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>Painel do Profissional</h2>

      {userEmail && <p><strong>E-mail:</strong> {userEmail}</p>}

      {fotoUrl ? (
        <img
          src={fotoUrl}
          alt="Sua foto de perfil"
          style={{ width: "150px", height: "200px", objectFit: "cover", border: "1px solid #ccc", borderRadius: "8px", marginBottom: "1rem" }}
        />
      ) : (
        <p style={{ marginBottom: "1rem" }}>Foto não encontrada ou ainda não enviada.</p>
      )}

      {carregando ? (
        <p>Carregando dados...</p>
      ) : (
        <>
          <div style={{ marginBottom: "1rem" }}>
            <label>Nome: </label><br />
            <input value={nome} onChange={(e) => setNome(e.target.value)} style={{ width: "300px" }} />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Profissão: </label><br />
            <input value={profissao} onChange={(e) => setProfissao(e.target.value)} style={{ width: "300px" }} />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Especialidade: </label><br />
            <input value={especialidade} onChange={(e) => setEspecialidade(e.target.value)} style={{ width: "300px" }} />
          </div>

          <button onClick={salvarDados} disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar Dados"}
          </button>
        </>
      )}
    </div>
  );
}
