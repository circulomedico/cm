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
  const [locaisAtendimento, setLocaisAtendimento] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
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
    const carregarEspecialidades = async () => {
      if (!profissao) {
        setListaEspecialidades([]);
        return;
      }
      const nomeDocumento = "especialidades_" + profissao.replace(/\s/g, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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
    carregarEspecialidades();
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

  const adicionarLocal = () => {
    if (locaisAtendimento.length >= 5) {
      alert("Máximo de 5 locais atingido");
      return;
    }
    setLocaisAtendimento([
      ...locaisAtendimento,
      { tipo: "", pais: "", estado: "", cidade: "", rua: "", numero: "", complemento: "", cep: "", bairros: [], telefone: "", whatsapp: "", email: "", tipoAtendimento: "", planosSaude: [] }
    ]);
  };

  const removerLocal = (index: number) => {
    const novos = [...locaisAtendimento];
    novos.splice(index, 1);
    setLocaisAtendimento(novos);
  };

  const atualizarLocal = (index: number, campo: string, valor: any) => {
    const novos = [...locaisAtendimento];
    novos[index][campo] = valor;
    setLocaisAtendimento(novos);
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
        <label>Currículo Resumido:</label><br />
        <textarea value={curriculoResumido} onChange={(e) => setCurriculoResumido(e.target.value)} />
      </div>

      <div>
        <label>Currículo Completo:</label><br />
        <textarea value={curriculoCompleto} onChange={(e) => setCurriculoCompleto(e.target.value)} />
      </div>

      <div style={{ marginTop: "2rem" }}>
        <label>Áreas de Destaque:</label><br />
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

      <div style={{ marginTop: "2rem" }}>
        <h3>Locais de Atendimento</h3>
        <button onClick={adicionarLocal}>Adicionar Local</button>
        {locaisAtendimento.map((local, idx) => (
          <div key={idx} style={{ marginTop: "1rem", border: "1px solid #ccc", padding: "10px" }}>
            <label>Tipo de Local:</label><br />
            <select value={local.tipo} onChange={(e) => atualizarLocal(idx, "tipo", e.target.value)}>
              <option value="">Selecione</option>
              <option value="Consultório">Consultório Particular</option>
              <option value="Clínica">Clínica</option>
              <option value="Hospital">Hospital</option>
              <option value="Domiciliar">Atendimento Domiciliar</option>
            </select>

            {["Consultório", "Clínica", "Hospital"].includes(local.tipo) && (
              <>
                <div>
                  <label>País:</label><br />
                  <input value={local.pais} onChange={(e) => atualizarLocal(idx, "pais", e.target.value)} />
                </div>
                <div>
                  <label>Estado:</label><br />
                  <input value={local.estado} onChange={(e) => atualizarLocal(idx, "estado", e.target.value)} />
                </div>
                <div>
                  <label>Cidade:</label><br />
                  <input value={local.cidade} onChange={(e) => atualizarLocal(idx, "cidade", e.target.value)} />
                </div>
                <div>
                  <label>Rua:</label><br />
                  <input value={local.rua} onChange={(e) => atualizarLocal(idx, "rua", e.target.value)} />
                </div>
                <div>
                  <label>Número:</label><br />
                  <input value={local.numero} onChange={(e) => atualizarLocal(idx, "numero", e.target.value)} />
                </div>
                <div>
                  <label>Complemento:</label><br />
                  <input value={local.complemento} onChange={(e) => atualizarLocal(idx, "complemento", e.target.value)} />
                </div>
                <div>
                  <label>CEP:</label><br />
                  <input value={local.cep} onChange={(e) => atualizarLocal(idx, "cep", e.target.value)} />
                </div>
              </>
            )}

            {local.tipo === "Domiciliar" && (
              <>
                <div>
                  <label>País:</label><br />
                  <input value={local.pais} onChange={(e) => atualizarLocal(idx, "pais", e.target.value)} />
                </div>
                <div>
                  <label>Estado:</label><br />
                  <input value={local.estado} onChange={(e) => atualizarLocal(idx, "estado", e.target.value)} />
                </div>
                <div>
                  <label>Cidade:</label><br />
                  <input value={local.cidade} onChange={(e) => atualizarLocal(idx, "cidade", e.target.value)} />
                </div>
              </>
            )}

            <button onClick={() => removerLocal(idx)} style={{ marginTop: "10px", backgroundColor: "#f44336", color: "#fff" }}>Remover Local</button>
          </div>
        ))}
      </div>
    </div>
  );
}
