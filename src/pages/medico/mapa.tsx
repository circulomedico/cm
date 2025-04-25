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

  const sugestoesFixas = [
    "epilepsia",
    "Parkinson",
    "tumor cerebral",
    "AVC",
    "microcirurgia",
    "cirurgia funcional",
    "hospital HC",
    "Unifesp",
    "neuroimagem",
    "coluna cervical"
  ];

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
        { tipo: "", endereco: "", telefone: "", email: "" },
      ]);
    }
  };

  const removerLocal = (index: number) => {
    const novosLocais = [...locaisAtendimento];
    novosLocais.splice(index, 1);
    setLocaisAtendimento(novosLocais);
  };

  const atualizarLocal = (index: number, campo: string, valor: string) => {
    const novosLocais = [...locaisAtendimento];
    novosLocais[index][campo] = valor;
    setLocaisAtendimento(novosLocais);
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

          <div style={{ marginBottom: "1rem" }}>
            <label>Áreas de destaque (máx. 10, até 15 letras cada):</label><br />
            <input
              value={novaArea}
              onChange={(e) => setNovaArea(e.target.value)}
              list="sugestoes"
              placeholder="Digite e pressione Enter"
              style={{ width: "400px" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const nova = novaArea.trim().toLowerCase();
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
            <datalist id="sugestoes">
              {sugestoesFixas.map((s, i) => (
                <option key={i} value={s} />
              ))}
            </datalist>
            <div style={{ marginTop: "0.5rem" }}>
              {areasDestaque.map((item, i) => (
                <span
                  key={i}
                  style={{
                    padding: "4px 8px",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "4px",
                    marginRight: "6px",
                    display: "inline-block",
                    marginBottom: "4px",
                  }}
                >
                  {item}{" "}
                  <button
                    onClick={() => {
                      setAreasDestaque(areasDestaque.filter((_, idx) => idx !== i));
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "red",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <h3 style={{ marginTop: "2rem" }}>Locais de Atendimento</h3>

          {locaisAtendimento.map((local, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                marginBottom: "1rem",
                borderRadius: "8px",
              }}
            >
              <h4>Local {index + 1}</h4>

              <label>Tipo de local:</label><br />
              <select
                value={local.tipo}
                onChange={(e) => atualizarLocal(index, "tipo", e.target.value)}
              >
                <option value="">Selecione</option>
                <option value="consultório particular">Consultório particular</option>
                <option value="clínica">Clínica</option>
                <option value="hospital">Hospital</option>
                <option value="atendimento domiciliar">Atendimento domiciliar</option>
              </select>

              <div style={{ marginTop: "0.5rem" }}>
                <label>Endereço:</label><br />
                <input
                  value={local.endereco}
                  onChange={(e) => atualizarLocal(index, "endereco", e.target.value)}
                  style={{ width: "400px" }}
                />
              </div>

              <div style={{ marginTop: "0.5rem" }}>
                <label>Telefone:</label><br />
                <input
                  value={local.telefone}
                  onChange={(e) => atualizarLocal(index, "telefone", e.target.value)}
                  style={{ width: "300px" }}
                />
              </div>

              <div style={{ marginTop: "0.5rem" }}>
                <label>Email:</label><br />
                <input
                  value={local.email}
                  onChange={(e) => atualizarLocal(index, "email", e.target.value)}
                  style={{ width: "300px" }}
                />
              </div>

              <button
                onClick={() => removerLocal(index)}
                style={{
                  marginTop: "0.5rem",
                  backgroundColor: "#f8d7da",
                  color: "#721c24",
                  border: "1px solid #f5c6cb",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Remover este local
              </button>
            </div>
          ))}

          {locaisAtendimento.length < 5 && (
            <button
              onClick={adicionarLocal}
              style={{
                backgroundColor: "#d4edda",
                color: "#155724",
                border: "1px solid #c3e6cb",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                marginBottom: "1rem"
              }}
            >
              Adicionar novo local
            </button>
          )}

          <button onClick={salvarDados} disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar Dados"}
          </button>
        </>
      )}
    </div>
  );
}
