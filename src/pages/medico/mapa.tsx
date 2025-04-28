
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
  const [areasDestaque, setAreasDestaque] = useState<string[]>([]);
  const [inputArea, setInputArea] = useState("");
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [listaProfissoes, setListaProfissoes] = useState<string[]>([]);
  const [listaEspecialidades, setListaEspecialidades] = useState<string[]>([]);
  const [listaAreasDestaque, setListaAreasDestaque] = useState<string[]>([]);

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
        const profissoesRef = doc(db, "listas", "profissoes");
        const profissoesSnap = await getDoc(profissoesRef);
        if (profissoesSnap.exists()) {
          setListaProfissoes(profissoesSnap.data().valores || []);
        }

        const areasDestaqueRef = doc(db, "listas", "areasDestaque");
        const areasDestaqueSnap = await getDoc(areasDestaqueRef);
        if (areasDestaqueSnap.exists()) {
          setListaAreasDestaque(areasDestaqueSnap.data().valores || []);
        }
      } catch (error) {
        console.error("Erro ao carregar listas:", error);
      }
    };
    carregarListas();
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
          setListaEspecialidades(snap.data().valores || []);
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

  const adicionarArea = (area: string) => {
    if (areasDestaque.length >= 10) {
      alert("Limite de 10 áreas de destaque atingido.");
      setInputArea("");
      return;
    }
    if (area.length > 20) {
      alert("Cada área de destaque deve ter no máximo 20 letras.");
      return;
    }
    if (!areasDestaque.includes(area)) {
      setAreasDestaque([...areasDestaque, area]);
    }
    setInputArea("");
    setSugestoes([]);
  };

  const removerArea = (area: string) => {
    setAreasDestaque(areasDestaque.filter((a) => a !== area));
  };

  const handleInputAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputArea(value);

    const filtradas = listaAreasDestaque.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );
    setSugestoes(filtradas.slice(0, 5));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (inputArea.trim() !== "") {
        adicionarArea(inputArea.trim());
      }
    }
  };

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

      <div>
        <label>Áreas de Destaque (máximo 10, até 20 letras cada):</label><br />
        <input
          value={inputArea}
          onChange={handleInputAreaChange}
          onKeyDown={handleKeyDown}
          placeholder="Digite e pressione Enter ou vírgula"
        />
        {sugestoes.length > 0 && (
          <div style={{ marginTop: "10px" }}>
            <strong>Sugestões:</strong>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {sugestoes.map((sugestao, idx) => (
                <li key={idx} onClick={() => adicionarArea(sugestao)} style={{ cursor: "pointer", padding: "5px 0" }}>
                  {sugestao}
                </li>
              ))}
            </ul>
          </div>
        )}
        {areasDestaque.length > 0 && (
          <div style={{ marginTop: "10px" }}>
            <strong>Já incluídas:</strong><br />
            {areasDestaque.map((area, idx) => (
              <span key={idx} style={{ marginRight: "10px", background: "#eee", padding: "5px", borderRadius: "5px", display: "inline-block", marginTop: "5px" }}>
                {area} <button onClick={() => removerArea(area)} style={{ marginLeft: "5px" }}>x</button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
