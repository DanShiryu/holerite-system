import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (token && usuario) {
      if (usuario.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/funcionario', { replace: true });
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');

    if (!email || !senha) {
      setErro('Preencha email e senha.');
      return;
    }

    try {
      const response = await api.post('/auth/login', { email, senha });

      const { token, funcionario } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(funcionario));

      if (funcionario.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/funcionario', { replace: true });
      }
    } catch (error) {
      setErro(error.response?.data?.error || 'Erro ao fazer login.');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Login</h1>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button}>
            Entrar
          </button>
        </form>

        {erro && <div style={styles.errorBox}>{erro}</div>}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f6f8',
    fontFamily: 'Arial, sans-serif',
    padding: '16px',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: '#fff',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
  },
  title: {
    marginTop: 0,
    marginBottom: '24px',
    fontSize: '32px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontWeight: 'bold',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    backgroundColor: '#0d6efd',
    color: '#fff',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  errorBox: {
    marginTop: '16px',
    backgroundColor: '#f8d7da',
    color: '#842029',
    border: '1px solid #f5c2c7',
    padding: '12px 16px',
    borderRadius: '8px',
  },
};

export default Login;