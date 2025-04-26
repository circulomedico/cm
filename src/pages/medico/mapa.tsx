
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

  const [listaProfissoes, setListaProfissoes] = useState<string[]>([]);
  const [listaEspecialidades, setListaEspecialidades] = useState<string[]>([]);
  const [listaPlanos, setListaPlanos] = useState<string[]>([]);
  const [sugestoesDestaque, setSugestoesDestaque] = useState<string[]>([]);

  useEffect(() => {
    const carregarListas = async () => {
      const pegarValores = async (nomeDoc: string) => {
        const snap = await getDoc(doc(db, "listas", nomeDoc));
        return snap.exists() ? snap.data().valores || [] : [];
      };
      setListaProfissoes(await pegarValores("profissoes"));
      setListaPlanos(await pegarValores("planosSaude"));
      setListaEspecialidades(await pegarValores("especialidades_Medicina"));
      setSugestoesDestaque(await pegarValores("areasDestaque"));
    };

    carregarListas();
  }, []);

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

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>Painel do Profissional</h2>
      {carregando ? <p>Carregando...</p> : (
        <div>
          <div>
            <label>Pronome:</label><br />
            <select value={pronome} onChange={(e) => setPronome(e.target.value)}>
              <option value="">Nenhum</option>
              <option value="Dr.">Dr.</option>
              <option value="Dra.">Dra.</option>
            </select>
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
            <label>Nome:</label><br />
            <input value={nome} onChange={(e) => setNome(e.target.value)} />
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
              {listaEspecialidades.map((e, idx) => (
                <option key={idx} value={e}>{e}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Currículo resumido:</label><br />
            <textarea value={curriculoResumido} onChange={(e) => setCurriculoResumido(e.target.value)} />
          </div>

          <div>
            <label>Currículo completo:</label><br />
            <textarea value={curriculoCompleto} onChange={(e) => setCurriculoCompleto(e.target.value)} />
          </div>

          <div>
            <label>Nome do conselho:</label><br />
            <input value={conselhoNome} onChange={(e) => setConselhoNome(e.target.value)} />
          </div>

          <div>
            <label>Número do conselho:</label><br />
            <input value={conselhoNumero} onChange={(e) => setConselhoNumero(e.target.value)} />
          </div>

          <div>
            <label>Áreas de Destaque:</label><br />
            <input
              value={novaArea}
              onChange={(e) => setNovaArea(e.target.value)}
              list="sugestoes"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const nova = novaArea.trim();
                  if (nova && !areasDestaque.includes(nova)) {
                    setAreasDestaque([...areasDestaque, nova]);
                    setNovaArea("");
                  }
                }
              }}
            />
            <datalist id="sugestoes">
              {sugestoesDestaque.map((s, idx) => (
                <option key={idx} value={s} />
              ))}
            </datalist>
            <div>
              {areasDestaque.map((a, idx) => (
                <span key={idx}>{a} <button onClick={() => setAreasDestaque(areasDestaque.filter((_, i) => i !== idx))}>x</button></span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
