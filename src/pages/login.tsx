import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [logado, setLogado] = useState(false);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      setLogado(true);
      setErro('');
    } catch (err: any) {
      if (err.code) {
        setErro(`Erro de autenticação: ${err.code}`);
      } else {
        setErro('Erro desconhecido ao fazer login.');
      }
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Login</h2>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '300px', padding: '0.5rem' }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="password"
          placeholder="Sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          style={{ width: '300px', padding: '0.5rem' }}
        />
      </div>
      <button onClick={handleLogin} style={{ padding: '0.5rem 1rem' }}>
        Entrar
      </button>

      {erro && <p style={{ color: 'red', marginTop: '1rem' }}>{erro}</p>}
      {logado && <p style={{ color: 'green', marginTop: '1rem' }}>Login realizado com sucesso!</p>}
    </div>
  );
}
