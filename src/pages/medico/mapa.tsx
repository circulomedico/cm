
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
          console.log("Erro ao carregar dados:", err);
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
      setLocaisAtendimento([...locaisAtendimento, {
        tipo: "",
        pais: "",
        estado: "",
        cidade: "",
        endereco: "",
        cep: "",
        complemento: "",
        telefone: "",
        email: "",
        atendimento: [],
        planos: [],
        bairros: []
      }]);
    }
  };

  const atualizarLocal = (index: number, campo: string, valor: any) => {
    const novos = [...locaisAtendimento];
    novos[index][campo] = valor;
    setLocaisAtendimento(novos);
  };

  const removerLocal = (index: number) => {
    const novos = [...locaisAtendimento];
    novos.splice(index, 1);
    setLocaisAtendimento(novos);
  };

  return <div style={{ padding: 20 }}>
    <h2>Painel do Profissional</h2>
    {carregando ? "Carregando..." : <>
      {/* Campos anteriores omitidos para foco no Bloco 4 Parte 2 */}

      <h3>Locais de Atendimento</h3>
      {locaisAtendimento.map((local, i) => (
        <div key={i} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
          <strong>Local {i + 1}</strong><br />
          <label>Tipo:</label><br />
          <select value={local.tipo} onChange={e => atualizarLocal(i, "tipo", e.target.value)}>
            <option value="">Selecione</option>
            <option value="consultório particular">Consultório particular</option>
            <option value="clínica">Clínica</option>
            <option value="hospital">Hospital</option>
            <option value="atendimento domiciliar">Atendimento domiciliar</option>
          </select><br /><br />

          <label>País:</label><br />
          <select value={local.pais} onChange={e => atualizarLocal(i, "pais", e.target.value)}>
            {paises.map(p => <option key={p} value={p}>{p}</option>)}
          </select><br />

          <label>Estado:</label><br />
          <select value={local.estado} onChange={e => atualizarLocal(i, "estado", e.target.value)}>
            {estados.map(e => <option key={e} value={e}>{e}</option>)}
          </select><br />

          <label>Cidade:</label><br />
          <select value={local.cidade} onChange={e => atualizarLocal(i, "cidade", e.target.value)}>
            {(cidades[local.estado] || []).map(c => <option key={c} value={c}>{c}</option>)}
          </select><br />

          {local.tipo === "atendimento domiciliar" ? (
            <>
              <label>Bairros/Regiões:</label><br />
              {(bairros[local.cidade] || []).map(b => (
                <label key={b} style={{ display: "block" }}>
                  <input
                    type="checkbox"
                    checked={local.bairros?.includes(b)}
                    onChange={(e) => {
                      const selecionados = local.bairros || [];
                      const atualizados = e.target.checked
                        ? [...selecionados, b]
                        : selecionados.filter(x => x !== b);
                      atualizarLocal(i, "bairros", atualizados);
                    }}
                  /> {b}
                </label>
              ))}
            </>
          ) : (
            <>
              <label>CEP:</label><br />
              <input value={local.cep} onChange={e => atualizarLocal(i, "cep", e.target.value)} /><br />
              <label>Endereço:</label><br />
              <input value={local.endereco} onChange={e => atualizarLocal(i, "endereco", e.target.value)} /><br />
              <label>Complemento:</label><br />
              <input value={local.complemento} onChange={e => atualizarLocal(i, "complemento", e.target.value)} /><br />
            </>
          )}

          <label>Telefone:</label><br />
          <input value={local.telefone} onChange={e => atualizarLocal(i, "telefone", e.target.value)} /><br />
          <label>Email:</label><br />
          <input value={local.email} onChange={e => atualizarLocal(i, "email", e.target.value)} /><br />

          <label>Atendimento:</label><br />
          <label><input type="checkbox" checked={local.atendimento?.includes("particular")} onChange={(e) => {
            const atual = local.atendimento || [];
            const atualizados = e.target.checked ? [...atual, "particular"] : atual.filter(a => a !== "particular");
            atualizarLocal(i, "atendimento", atualizados);
          }} /> Particular</label><br />
          <label><input type="checkbox" checked={local.atendimento?.includes("plano")} onChange={(e) => {
            const atual = local.atendimento || [];
            const atualizados = e.target.checked ? [...atual, "plano"] : atual.filter(a => a !== "plano");
            atualizarLocal(i, "atendimento", atualizados);
          }} /> Plano de Saúde</label><br />

          {local.atendimento?.includes("plano") && (
            <>
              <label>Planos aceitos:</label><br />
              {planosSaude.map(p => (
                <label key={p} style={{ display: "block" }}>
                  <input type="checkbox" checked={local.planos?.includes(p)} onChange={(e) => {
                    const atual = local.planos || [];
                    const atualizados = e.target.checked ? [...atual, p] : atual.filter(x => x !== p);
                    atualizarLocal(i, "planos", atualizados);
                  }} /> {p}
                </label>
              ))}
            </>
          )}

          <br />
          <button onClick={() => removerLocal(i)} style={{ background: "#fdd" }}>Remover local</button>
        </div>
      ))}
      {locaisAtendimento.length < 5 && (
        <button onClick={adicionarLocal}>Adicionar novo local</button>
      )}

      <br /><br />
      <button onClick={salvarDados} disabled={salvando}>
        {salvando ? "Salvando..." : "Salvar Dados"}
      </button>
    </>}
  </div>;
}
