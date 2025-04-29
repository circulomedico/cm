import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { estadosBrasil, cidadesPorEstado } from "../../utils/cidadesBrasil";



// Listagem de cidades para cada estado (iremos carregar de forma simplificada para exemplo)
// AQUI nesta versão reduzida para envio no chat eu mostro apenas SP, RJ e MG como exemplo. 
// Depois eu te ensino a carregar todas usando um JSON externo, se quiser!


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

  // Função para adicionar novo local
const adicionarLocal = () => {
  if (locaisAtendimento.length >= 5) {
    alert("Você pode adicionar no máximo 5 locais de atendimento.");
    return;
  }
  setLocaisAtendimento([
    ...locaisAtendimento,
    { tipo: "", estado: "", cidade: "", rua: "", numero: "", complemento: "", cep: "", telefone: "", whatsapp: "", email: "" }
  ]);
};

// Função para remover local
const removerLocal = (index: number) => {
  const novosLocais = [...locaisAtendimento];
  novosLocais.splice(index, 1);
  setLocaisAtendimento(novosLocais);
};

// Função para atualizar campo de local
const atualizarLocal = (index: number, campo: string, valor: string) => {
  const novosLocais = [...locaisAtendimento];
  novosLocais[index][campo] = valor;
  setLocaisAtendimento(novosLocais);
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

      <div style={{ marginTop: "2rem" }}>

        <div style={{ marginTop: "2rem" }}>
  <label>Profissão:</label><br />
  <select
    value={profissao}
    onChange={(e) => {
      setProfissao(e.target.value);
      setEspecialidade(""); // limpa a especialidade se mudar a profissão
    }}
  >
    <option value="">Selecione a profissão</option>
    {listaProfissoes.map((profissaoItem, index) => (
      <option key={index} value={profissaoItem}>
        {profissaoItem}
      </option>
    ))}
  </select>
</div>

{profissao && (
  <div style={{ marginTop: "1rem" }}>
    <label>Especialidade:</label><br />
    <select
      value={especialidade}
      onChange={(e) => setEspecialidade(e.target.value)}
    >
      <option value="">Selecione a especialidade</option>
      {listaEspecialidades.map((especialidadeItem, index) => (
        <option key={index} value={especialidadeItem}>
          {especialidadeItem}
        </option>
      ))}
    </select>
  </div>
)}

<div style={{ marginTop: "2rem" }}>
  <label>Nome do Conselho:</label><br />
  <input
    type="text"
    value={nomeConselho}
    onChange={(e) => setNomeConselho(e.target.value)}
    placeholder="Ex: CRM, CRP, CREFITO..."
  />
</div>

<div style={{ marginTop: "1rem" }}>
  <label>Número do Conselho:</label><br />
  <input
    type="text"
    value={numeroConselho}
    onChange={(e) => setNumeroConselho(e.target.value)}
  />
</div>

<div style={{ marginTop: "2rem" }}>
  <label>Currículo Resumido (até 100 palavras):</label><br />
  <textarea
    value={curriculoResumido}
    onChange={(e) => setCurriculoResumido(e.target.value)}
    rows={4}
    style={{ width: "100%" }}
  />
</div>

<div style={{ marginTop: "1rem" }}>
  <label>Currículo Completo (até 1000 palavras):</label><br />
  <textarea
    value={curriculoCompleto}
    onChange={(e) => setCurriculoCompleto(e.target.value)}
    rows={10}
    style={{ width: "100%" }}
  />
</div>

<div style={{ marginTop: "2rem" }}>
  <label>Áreas de Destaque:</label><br />
  <input
    type="text"
    value={inputArea}
    onChange={(e) => setInputArea(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (inputArea.trim() && areasDestaque.length < 10) {
          if (inputArea.length <= 20) {
            setAreasDestaque([...areasDestaque, inputArea.trim()]);
            setInputArea("");
          } else {
            alert("Cada área de destaque pode ter no máximo 20 letras.");
          }
        } else if (areasDestaque.length >= 10) {
          alert("Você pode adicionar no máximo 10 áreas de destaque.");
        }
      }
    }}
    placeholder="Pressione Enter para adicionar"
  />
  <div style={{ marginTop: "0.5rem" }}>
    <strong>Já incluídas:</strong> {areasDestaque.join(", ")}
  </div>
</div>

        
        <h3>Locais de Atendimento</h3>
  <button onClick={adicionarLocal} style={{ marginBottom: "1rem" }}>
    Adicionar Local
  </button>

  {locaisAtendimento.map((local, idx) => (
    <div key={idx} style={{ marginBottom: "2rem", border: "1px solid #ccc", padding: "1rem" }}>
      <div>
        <label>Tipo de Local:</label><br />
        <select
          value={local.tipo}
          onChange={(e) => atualizarLocal(idx, "tipo", e.target.value)}
        >
          <option value="">Selecione</option>
          <option value="Consultório">Consultório Particular</option>
          <option value="Clínica">Clínica</option>
          <option value="Hospital">Hospital</option>
          <option value="Domiciliar">Atendimento Domiciliar</option>
        </select>
      </div>

      {local.tipo && (
        <>
          <div style={{ marginTop: "1rem" }}>
            <label>Estado:</label><br />
            <select
              value={local.estado}
              onChange={(e) => {
                atualizarLocal(idx, "estado", e.target.value);
                atualizarLocal(idx, "cidade", ""); // Reseta cidade se mudar estado
              }}
            >
              <option value="">Selecione o Estado</option>
              {estadosBrasil.map((estado) => (
                <option key={estado.sigla} value={estado.sigla}>
                  {estado.nome}
                </option>
              ))}
            </select>
          </div>

          {local.estado && (
            <div style={{ marginTop: "1rem" }}>
              <label>Cidade:</label><br />
              <select
                value={local.cidade}
                onChange={(e) => atualizarLocal(idx, "cidade", e.target.value)}
              >
                <option value="">Selecione a Cidade</option>
                {(cidadesPorEstado[local.estado] || []).map((cidade, index) => (
                  <option key={index} value={cidade}>
                    {cidade}
                  </option>
                ))}
              </select>
            </div>
          )}
        </>
      )}

      {["Consultório", "Clínica", "Hospital"].includes(local.tipo) && (
        <>
          <div style={{ marginTop: "1rem" }}>
            <label>Rua:</label><br />
            <input
              type="text"
              value={local.rua}
              onChange={(e) => atualizarLocal(idx, "rua", e.target.value)}
            />
          </div>
          <div>
            <label>Número:</label><br />
            <input
              type="text"
              value={local.numero}
              onChange={(e) => atualizarLocal(idx, "numero", e.target.value)}
            />
          </div>
          <div>
            <label>Complemento:</label><br />
            <input
              type="text"
              value={local.complemento}
              onChange={(e) => atualizarLocal(idx, "complemento", e.target.value)}
            />
          </div>
          <div>
            <label>CEP:</label><br />
            <input
              type="text"
              value={local.cep}
              onChange={(e) => atualizarLocal(idx, "cep", e.target.value)}
            />
          </div>
        </>
      )}

      <div style={{ marginTop: "1rem" }}>
        <label>Telefone:</label><br />
        <input
          type="text"
          value={local.telefone}
          onChange={(e) => atualizarLocal(idx, "telefone", e.target.value)}
        />
      </div>

      <div>
        <label>Whatsapp:</label><br />
        <input
          type="text"
          value={local.whatsapp}
          onChange={(e) => atualizarLocal(idx, "whatsapp", e.target.value)}
        />
      </div>

      <div>
        <label>Email:</label><br />
        <input
          type="email"
          value={local.email}
          onChange={(e) => atualizarLocal(idx, "email", e.target.value)}
        />
      </div>

      <button
        onClick={() => removerLocal(idx)}
        style={{ marginTop: "1rem", backgroundColor: "#f44336", color: "#fff" }}
      >
        Remover Local
      </button>
    </div>
  ))}
</div>

    </div>
  );
}
