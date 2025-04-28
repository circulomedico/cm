
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

      {/* ...todos os campos anteriores... */}

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
        <div style={{ marginTop: "10px" }}>
          {areasDestaque.map((area, idx) => (
            <span key={idx} style={{ marginRight: "10px", background: "#eee", padding: "5px", borderRadius: "5px" }}>
              {area} <button onClick={() => removerArea(area)} style={{ marginLeft: "5px" }}>x</button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
