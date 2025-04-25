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
  const [areasDestaque, setAreasDestaque] = useState<string[]>([]);
  const [novaArea, setNovaArea] = useState("");
  const [locaisAtendimento, setLocaisAtendimento] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const sugestoesFixas = ["epilepsia", "Parkinson", "tumor cerebral", "AVC", "microcirurgia", "cirurgia funcional", "hospital HC", "Unifesp", "neuroimagem", "coluna cervical"];
  const planosSaude = ["Amil", "Unimed", "Bradesco", "SulAmérica", "NotreDame"];
  const paises = ["Brasil"];
  const estados = ["SP", "RJ", "MG"];
  const cidades = {
    SP: ["São Paulo", "Campinas"],
    RJ: ["Rio de Janeiro", "Niterói"],
    MG: ["Belo Horizonte", "Uberlândia"],
  };
  const bairros = {
    "São Paulo": ["Moema", "Pinheiros", "Itaim Bibi"],
    "Rio de Janeiro": ["Copacabana", "Barra", "Tijuca"],
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user?.email) {
        setUserEmail(user.email);
        try {
          const storage = getStorage();
          const fotoRef = ref(storage, `fotos-perfil/${user.email}.jpg`);
          const url = await getDownloadURL(fotoRef);
          setFotoUrl(url);
        } catch (err) {
          console.log("Foto não encontrada.");
        }

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
            setAreasDestaque(dados.areasDestaque || []);
            setLocaisAtendimento(dados.locaisAtendimento || []);
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
        areasDestaque,
        locaisAtendimento,
      });
      alert("Dados salvos com sucesso!");
    } catch (err) {
      alert("Erro ao salvar dados.");
      console.error(err);
    }
    setSalvando(false);
  };

  const adicionarLocal = () => {
    if (locaisAtendimento.length < 5) {
      setLocaisAtendimento([
        ...locaisAtendimento,
        {
          tipo: "",
          pais: "",
          estado: "",
          cidade: "",
          cep: "",
          endereco: "",
          complemento: "",
          telefone: "",
          whatsapp: "",
          email: "",
          bairros: [],
          atendimento: [],
          planos: [],
        },
      ]);
    }
  };

  const removerLocal = (index: number) => {
    const novos = [...locaisAtendimento];
    novos.splice(index, 1);
    setLocaisAtendimento(novos);
  };

  const atualizarLocal = (index: number, campo: string, valor: any) => {
    const atualizados = [...locaisAtendimento];
    atualizados[index][campo] = valor;
    setLocaisAtendimento(atualizados);
  };

  const alternarPlano = (index: number, plano: string) => {
    const atual = locaisAtendimento[index];
    const novos = [...locaisAtendimento];
    const lista = atual.planos || [];
    if (lista.includes(plano)) {
      novos[index].planos = lista.filter((p: string) => p !== plano);
    } else {
      novos[index].planos = [...lista, plano];
    }
    setLocaisAtendimento(novos);
  };

  const alternarBairro = (index: number, bairro: string) => {
    const atual = locaisAtendimento[index];
    const novos = [...locaisAtendimento];
    const lista = atual.bairros || [];
    if (lista.includes(bairro)) {
      novos[index].bairros = lista.filter((b: string) => b !== bairro);
    } else {
      novos[index].bairros = [...lista, bairro];
    }
    setLocaisAtendimento(novos);
  };

  const alternarAtendimento = (index: number, tipo: string) => {
    const atual = locaisAtendimento[index];
    const novos = [...locaisAtendimento];
    const lista = atual.atendimento || [];
    if (lista.includes(tipo)) {
      novos[index].atendimento = lista.filter((a: string) => a !== tipo);
    } else {
      novos[index].atendimento = [...lista, tipo];
    }
    setLocaisAtendimento(novos);
  };
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
    <input value={nome} onChange={(e) => setNome(e.target.value)} />
  </div>

  <div style={{ marginBottom: "1rem" }}>
    <label>Profissão:</label><br />
    <input value={profissao} onChange={(e) => setProfissao(e.target.value)} />
  </div>

  <div style={{ marginBottom: "1rem" }}>
    <label>Especialidade:</label><br />
    <input value={especialidade} onChange={(e) => setEspecialidade(e.target.value)} />
  </div>

  <div style={{ marginBottom: "1rem" }}>
    <label>Currículo resumido:</label><br />
    <textarea value={curriculoResumido} onChange={(e) => setCurriculoResumido(e.target.value)} />
  </div>

  <div style={{ marginBottom: "1rem" }}>
    <label>Currículo completo:</label><br />
    <textarea value={curriculoCompleto} onChange={(e) => setCurriculoCompleto(e.target.value)} />
  </div>

  <div style={{ marginBottom: "1rem" }}>
    <label>Nome do Conselho:</label><br />
    <input value={conselhoNome} onChange={(e) => setConselhoNome(e.target.value)} />
  </div>

  <div style={{ marginBottom: "1rem" }}>
    <label>Número do Conselho:</label><br />
    <input value={conselhoNumero} onChange={(e) => setConselhoNumero(e.target.value)} />
  </div>

  <div style={{ marginBottom: "1rem" }}>
    <label>Áreas de Destaque:</label><br />
    <input
      value={novaArea}
      onChange={(e) => setNovaArea(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const nova = novaArea.trim();
          if (
            nova &&
            nova.length <= 15 &&
            !areasDestaque.includes(nova) &&
            areasDestaque.length < 10
          ) {
            setAreasDestaque([...areasDestaque, nova]);
            setNovaArea("");
          }
        }
      }}
    />
    <div>
      {areasDestaque.map((a, i) => (
        <span key={i} style={{ marginRight: "6px" }}>
          {a}
          <button onClick={() => setAreasDestaque(areasDestaque.filter((_, idx) => idx !== i))}>×</button>
        </span>
      ))}
    </div>
  </div>

  <h3>Locais de Atendimento</h3>

  {locaisAtendimento.map((local, i) => (
    <div key={i} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
      <label>Tipo:</label><br />
      <select value={local.tipo} onChange={(e) => atualizarLocal(i, "tipo", e.target.value)}>
        <option value="">Selecione</option>
        <option value="consultório particular">Consultório particular</option>
        <option value="clínica">Clínica</option>
        <option value="hospital">Hospital</option>
        <option value="atendimento domiciliar">Atendimento domiciliar</option>
      </select>

      {["consultório particular", "clínica", "hospital"].includes(local.tipo) && (
        <>
          <div style={{ marginTop: "0.5rem" }}>
            <label>País:</label><br />
            <select value={local.pais} onChange={(e) => atualizarLocal(i, "pais", e.target.value)}>
              <option value="">Selecione</option>
              {paises.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: "0.5rem" }}>
            <label>Estado:</label><br />
            <select value={local.estado} onChange={(e) => atualizarLocal(i, "estado", e.target.value)}>
              <option value="">Selecione</option>
              {estados.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: "0.5rem" }}>
            <label>Cidade:</label><br />
            <select value={local.cidade} onChange={(e) => atualizarLocal(i, "cidade", e.target.value)}>
              <option value="">Selecione</option>
              {(cidades[local.estado] || []).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <input placeholder="CEP" value={local.cep} onChange={(e) => atualizarLocal(i, "cep", e.target.value)} />
          <input placeholder="Rua e número" value={local.endereco} onChange={(e) => atualizarLocal(i, "endereco", e.target.value)} />
          <input placeholder="Complemento" value={local.complemento} onChange={(e) => atualizarLocal(i, "complemento", e.target.value)} />
          <input placeholder="Telefone" value={local.telefone} onChange={(e) => atualizarLocal(i, "telefone", e.target.value)} />
          <input placeholder="Email" value={local.email} onChange={(e) => atualizarLocal(i, "email", e.target.value)} />
        </>
      )}

      {local.tipo === "atendimento domiciliar" && (
        <>
          <select value={local.pais} onChange={(e) => atualizarLocal(i, "pais", e.target.value)}>
            <option value="">País</option>
            {paises.map((p) => <option key={p}>{p}</option>)}
          </select>
          <select value={local.estado} onChange={(e) => atualizarLocal(i, "estado", e.target.value)}>
            <option value="">Estado</option>
            {estados.map((p) => <option key={p}>{p}</option>)}
          </select>
          <select value={local.cidade} onChange={(e) => atualizarLocal(i, "cidade", e.target.value)}>
            <option value="">Cidade</option>
            {(cidades[local.estado] || []).map((c) => <option key={c}>{c}</option>)}
          </select>
          <label>Bairros:</label><br />
          {(bairros[local.cidade] || []).map((b) => (
            <label key={b} style={{ marginRight: "8px" }}>
              <input
                type="checkbox"
                checked={local.bairros?.includes(b)}
                onChange={() => alternarBairro(i, b)}
              />
              {b}
            </label>
          ))}
          <input placeholder="Telefone" value={local.telefone} onChange={(e) => atualizarLocal(i, "telefone", e.target.value)} />
          <input placeholder="WhatsApp" value={local.whatsapp} onChange={(e) => atualizarLocal(i, "whatsapp", e.target.value)} />
          <input placeholder="Email" value={local.email} onChange={(e) => atualizarLocal(i, "email", e.target.value)} />
        </>
      )}

      <label>Tipo de atendimento:</label><br />
      {["particular", "plano de saúde"].map((tipo) => (
        <label key={tipo} style={{ marginRight: "10px" }}>
          <input
            type="checkbox"
            checked={local.atendimento?.includes(tipo)}
            onChange={() => alternarAtendimento(i, tipo)}
          />
          {tipo}
        </label>
      ))}

      {local.atendimento?.includes("plano de saúde") && (
        <div style={{ marginTop: "0.5rem" }}>
          <label>Planos aceitos:</label><br />
          {planosSaude.map((p) => (
            <label key={p} style={{ marginRight: "8px" }}>
              <input
                type="checkbox"
                checked={local.planos?.includes(p)}
                onChange={() => alternarPlano(i, p)}
              />
              {p}
            </label>
          ))}
        </div>
      )}

      <div style={{ marginTop: "1rem" }}>
        <button onClick={() => removerLocal(i)}>Remover local</button>
      </div>
    </div>
  ))}

  {locaisAtendimento.length < 5 && (
    <button onClick={adicionarLocal}>Adicionar local de atendimento</button>
  )}

  <div style={{ marginTop: "2rem" }}>
    <button onClick={salvarDados} disabled={salvando}>
      {salvando ? "Salvando..." : "Salvar dados"}
    </button>
  </div>
</>
