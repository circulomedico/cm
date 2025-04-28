
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
  const [nomeConselho, setNomeConselho] = useState("");
  const [numeroConselho, setNumeroConselho] = useState("");
  const [curriculoResumido, setCurriculoResumido] = useState("");
  const [curriculoCompleto, setCurriculoCompleto] = useState("");
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
    const carregarListaProfissoes = async () => {
      try {
        const docRef = doc(db, "listas", "profissoes");
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const valoresProfissoes = snap.data().valores || [];
          setListaProfissoes(valoresProfissoes);
        }
      } catch (error) {
        console.error("Erro ao carregar profissões:", error);
      }
    };
    carregarListaProfissoes();
  }, []);

  useEffect(() => {
    const carregarListaEspecialidades = async () => {
      if (!profissao) {
        setListaEspecialidades([]);
        return;
      }

      const nomeDocumento = "especialidades_" + profissao.replace(/\s/g, "").replace(/ç/g, "c").replace(/ã/g, "a").replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú/g, "u");

      try {
        const docRef = doc(db, "listas", nomeDocumento);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const valoresEspecialidades = snap.data().valores || [];
          setListaEspecialidades(valoresEspecialidades);
        } else {
          setListaEspecialidades([]);
        }
      } catch (error) {
        console.error("Erro ao carregar especialidades:", error);
        setListaEspecialidades([]);
      }
    };
    carregarListaEspecialidades();
  }, [profissao]);

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
        <select value={profissao} onChange={(e) => { setProfissao(e.target.value); setEspecialidade(""); }}>
          <option value="">Selecione</option>
          {listaProfissoes.map((p, idx) => (
            <option key={idx} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Especialidade:</label><br />
        <select value={especialidade} onChange={(e) => setEspecialidade(e.target.value)} disabled={!listaEspecialidades.length}>
          <option value="">Selecione</option>
          {listaEspecialidades.map((esp, idx) => (
            <option key={idx} value={esp}>{esp}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Nome do Conselho Profissional:</label><br />
        <input value={nomeConselho} maxLength={20} onChange={(e) => setNomeConselho(e.target.value)} />
      </div>

      <div>
        <label>Número do Conselho Profissional:</label><br />
        <input value={numeroConselho} maxLength={20} onChange={(e) => setNumeroConselho(e.target.value)} />
      </div>

      <div>
        <label>Currículo Resumido (até 100 palavras):</label><br />
        <textarea
          value={curriculoResumido}
          onChange={(e) => setCurriculoResumido(e.target.value)}
          rows={5}
        />
      </div>

      <div>
        <label>Currículo Completo (até 1000 palavras):</label><br />
        <textarea
          value={curriculoCompleto}
          onChange={(e) => setCurriculoCompleto(e.target.value)}
          rows={10}
        />
      </div>
    </div>
  );
}
