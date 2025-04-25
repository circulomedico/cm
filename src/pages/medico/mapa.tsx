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
  const [pronome, setPronome] = useState("");
  const [sexo, setSexo] = useState("");
  const [curriculoResumido, setCurriculoResumido] = useState("");
  const [curriculoCompleto, setCurriculoCompleto] = useState("");
  const [conselhoNome, setConselhoNome] = useState("");
  const [conselhoNumero, setConselhoNumero] = useState("");
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
            setPronome(dados.pronome || "");
            setSexo(dados.sexo || "");
            setCurriculoResumido(dados.curriculoResumido || "");
            setCurriculoCompleto(dados.curriculoCompleto || "");
            setConselhoNome(dados.conselhoNome || "");
            setConselhoNumero(dados.conselhoNumero || "");
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
        pronome,
        sexo,
        curriculoResumido,
        curriculoCompleto,
        conselhoNome,
        conselhoNumero,
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
          style={{
            width: "150px",
            height: "200px",
            objectFit: "cover",
            border: "1px solid #ccc",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        />
      ) : (
        <p style={{ marginBottom: "1rem" }}>Foto não encontrada ou ainda não enviada.</p>
      )}

      {carregando ? (
        <p>Carregando dados...</p>
      ) : (
        <>
          <div style={{ marginBottom: "1rem" }}>
            <label>Pronome de tratamento:</label><br />
            <select value={pronome} onChange={(e) => setPronome(e.target.value)}>
              <option value="">Nenhum</option>
              <option value="Dr.">Dr.</option>
              <option value="Dra.">Dra.</option>
            </select>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Sexo:</label><br />
            <select value={sexo} onChange={(e) => setSexo(e.target.value)}>
              <option value="">Selecione</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </select>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Nome:</label><br />
            <input value={nome} onChange={(e) => setNome(e.target.value)} style={{ width: "300px" }} />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Profissão:</label><br />
            <input value={profissao} onChange={(e) => setProfissao(e.target.value)} style={{ width: "300px" }} />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Especialidade:</label><br />
            <input value={especialidade} onChange={(e) => setEspecialidade(e.target.value)} style={{ width: "300px" }} />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Currículo resumido (até 100 palavras):</label><br />
            <textarea
              value={curriculoResumido}
              onChange={(e) => setCurriculoResumido(e.target.value)}
              style={{ width: "400px", height: "100px" }}
              maxLength={1000}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Currículo completo (até 1000 palavras):</label><br />
            <textarea
              value={curriculoCompleto}
              onChange={(e) => setCurriculoCompleto(e.target.value)}
              style={{ width: "600px", height: "200px" }}
              maxLength={10000}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Nome do conselho profissional (até 20 letras):</label><br />
            <input
              value={conselhoNome}
              onChange={(e) => setConselhoNome(e.target.value)}
              maxLength={20}
              style={{ width: "300px" }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Número do conselho profissional (até 20 dígitos):</label><br />
            <input
              value={conselhoNumero}
              onChange={(e) => setConselhoNumero(e.target.value)}
              maxLength={20}
              style={{ width: "300px" }}
            />
          </div>

          <button onClick={salvarDados} disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar Dados"}
          </button>
        </>
      )}
    </div>
  );
}
