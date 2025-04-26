import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function MapaProfissional() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [pronome, setPronome] = useState("");
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [sexo, setSexo] = useState("");
  const [profissao, setProfissao] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [listaProfissoes, setListaProfissoes] = useState<string[]>([]);
  const [listaEspecialidades, setListaEspecialidades] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user?.email) {
        setUserEmail(user.email);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const carregarListas = async () => {
      try {
        const docRef = doc(db, "listas", "profissoes");
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const valoresProfissoes = snap.data().valores || [];
          console.log("Profissões carregadas do Firestore:", valoresProfissoes);
          setListaProfissoes(valoresProfissoes);
        } else {
          console.log("Documento de profissões não encontrado no Firestore.");
        }

        const especialidadesRef = doc(db, "listas", "especialidades_Medicina");
        const snapEsp = await getDoc(especialidadesRef);
        if (snapEsp.exists()) {
          const valoresEspecialidades = snapEsp.data().valores || [];
          console.log("Especialidades carregadas do Firestore:", valoresEspecialidades);
          setListaEspecialidades(valoresEspecialidades);
        } else {
          console.log("Documento de especialidades não encontrado no Firestore.");
        }
      } catch (error) {
        console.error("Erro ao carregar listas do Firestore:", error);
      }
    };
    carregarListas();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>Painel do Profissional</h2>

      <div>
        <label>Pronome:</label><br />
        <select value={pronome} onChange={(e) => setPronome(e.target.value)}>
          <option value="">Nenhum</option>
          <option value="Dr.">Dr.</option>
          <option value="Dra.">Dra.</option>
        </select>
      </div>

      <div>
        <label>Nome:</label><br />
        <input value={nome} onChange={(e) => setNome(e.target.value)} />
      </div>

      <div>
        <label>Sobrenome:</label><br />
        <input value={sobrenome} onChange={(e) => setSobrenome(e.target.value)} />
      </div>

      <div>
        <label>Sexo:</label><br />
        <select value={sexo} onChange={(e) => setSexo(e.target.value)}>
          <option value="">Selecione</option>
          <option value="Masculino">Masculino</option>
          <option value="Feminino">Feminino</option>
        </select>
      </div>

      <div>
        <label>Profissão:</label><br />
        <select value={profissao} onChange={(e) => setProfissao(e.target.value)}>
          <option value="">Selecione</option>
          {listaProfissoes.map((p, idx) => (
            <option key={idx} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Especialidade:</label><br />
        <select value={especialidade} onChange={(e) => setEspecialidade(e.target.value)}>
          <option value="">Selecione</option>
          {listaEspecialidades.map((esp, idx) => (
            <option key={idx} value={esp}>{esp}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
