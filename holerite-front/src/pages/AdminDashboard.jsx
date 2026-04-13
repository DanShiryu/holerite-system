import { useEffect, useRef, useState } from 'react';
import api from '../services/api';

function AdminDashboard() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  const [funcionarios, setFuncionarios] = useState([]);
  const [holerites, setHolerites] = useState([]);

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [funcionarioId, setFuncionarioId] = useState('');
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');
  const [arquivo, setArquivo] = useState(null);

  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const formUploadRef = useRef(null);

  const limparMensagens = () => {
    setMensagem('');
    setErro('');
  };

  const buscarFuncionarios = async () => {
    try {
      const response = await api.get('/funcionarios');
      setFuncionarios(response.data);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
      setErro('Não foi possível carregar os funcionários.');
    }
  };

  const buscarHolerites = async () => {
    try {
      const response = await api.get('/holerites');
      setHolerites(response.data);
    } catch (error) {
      console.error('Erro ao carregar holerites:', error);
      setErro('Não foi possível carregar os holerites.');
    }
  };

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const [funcionariosResponse, holeritesResponse] = await Promise.all([
          api.get('/funcionarios'),
          api.get('/holerites'),
        ]);

        setFuncionarios(funcionariosResponse.data);
        setHolerites(holeritesResponse.data);
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
        setErro('Não foi possível carregar os dados iniciais.');
      }
    };

    fetchDados();
  }, []);

  const cadastrarFuncionario = async (e) => {
    e.preventDefault();
    limparMensagens();

    if (!nome || !cpf || !email || !senha) {
      setErro('Preencha todos os campos do cadastro.');
      return;
    }

    try {
      await api.post('/funcionarios', {
        nome,
        cpf,
        email,
        senha,
        role: 'funcionario',
      });

      setMensagem('Funcionário cadastrado com sucesso.');
      setNome('');
      setCpf('');
      setEmail('');
      setSenha('');

      await buscarFuncionarios();
    } catch (error) {
      setErro(error.response?.data?.error || 'Erro ao cadastrar funcionário.');
    }
  };

  const enviarHolerite = async (e) => {
    e.preventDefault();
    limparMensagens();

    if (!funcionarioId || !mes || !ano || !arquivo) {
      setErro('Preencha todos os campos do envio e selecione um PDF.');
      return;
    }

    const formData = new FormData();
    formData.append('holerite', arquivo);
    formData.append('funcionarioId', funcionarioId);
    formData.append('mes', mes);
    formData.append('ano', ano);

    try {
      await api.post('/holerites/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMensagem('Holerite enviado com sucesso.');

      setFuncionarioId('');
      setMes('');
      setAno('');
      setArquivo(null);

      if (formUploadRef.current) {
        formUploadRef.current.reset();
      }

      await buscarHolerites();
    } catch (error) {
      setErro(error.response?.data?.error || 'Erro ao enviar holerite.');
    }
  };

  const visualizarHolerite = async (id) => {
    limparMensagens();

    try {
      const response = await api.get(`/holerites/${id}`, {
        responseType: 'blob',
      });

      const fileURL = window.URL.createObjectURL(
        new Blob([response.data], { type: 'application/pdf' })
      );

      window.open(fileURL, '_blank');

      setMensagem('Holerite aberto com sucesso.');
      await buscarHolerites();
    } catch (error) {
      setErro(error.response?.data?.error || 'Erro ao visualizar holerite.');
    }
  };

  const baixarHolerite = async (id) => {
    limparMensagens();

    try {
      const response = await api.get(`/holerites/${id}`, {
        responseType: 'blob',
      });

      const fileURL = window.URL.createObjectURL(
        new Blob([response.data], { type: 'application/pdf' })
      );

      const link = document.createElement('a');
      link.href = fileURL;
      link.download = `holerite_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(fileURL);

      setMensagem('Download iniciado com sucesso.');
    } catch (error) {
      setErro(error.response?.data?.error || 'Erro ao baixar holerite.');
    }
  };

  const sair = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/';
  };

  const getNomeFuncionario = (id) => {
    const funcionario = funcionarios.find((f) => f.id === id);
    return funcionario ? funcionario.nome : `ID ${id}`;
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Painel do Admin</h1>
            <p style={styles.subtitle}>Bem-vindo, {usuario?.nome}</p>
          </div>

          <button onClick={sair} style={styles.logoutButton}>
            Sair
          </button>
        </div>

        {mensagem && <div style={styles.successBox}>{mensagem}</div>}
        {erro && <div style={styles.errorBox}>{erro}</div>}

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Cadastrar Funcionário</h2>

          <form onSubmit={cadastrarFuncionario} style={styles.form}>
            <div style={styles.formGrid}>
              <input
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                style={styles.input}
              />

              <input
                type="text"
                placeholder="CPF"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                style={styles.input}
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />

              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                style={styles.input}
              />
            </div>

            <button type="submit" style={styles.primaryButton}>
              Cadastrar
            </button>
          </form>
        </div>

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Enviar Holerite</h2>

          <form onSubmit={enviarHolerite} style={styles.form} ref={formUploadRef}>
            <div style={styles.formGrid}>
              <select
                value={funcionarioId}
                onChange={(e) => setFuncionarioId(e.target.value)}
                style={styles.input}
              >
                <option value="">Selecione um funcionário</option>
                {funcionarios
                  .filter((f) => f.role === 'funcionario')
                  .map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nome}
                    </option>
                  ))}
              </select>

              <input
                type="text"
                placeholder="Mês"
                value={mes}
                onChange={(e) => setMes(e.target.value)}
                style={styles.input}
              />

              <input
                type="text"
                placeholder="Ano"
                value={ano}
                onChange={(e) => setAno(e.target.value)}
                style={styles.input}
              />

              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setArquivo(e.target.files[0] || null)}
                style={styles.input}
              />
            </div>

            <button type="submit" style={styles.primaryButton}>
              Enviar Holerite
            </button>
          </form>
        </div>

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Funcionários Cadastrados</h2>

          {funcionarios.length === 0 ? (
            <p style={styles.emptyText}>Nenhum funcionário cadastrado.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Nome</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Perfil</th>
                </tr>
              </thead>
              <tbody>
                {funcionarios.map((f) => (
                  <tr key={f.id}>
                    <td style={styles.td}>{f.id}</td>
                    <td style={styles.td}>{f.nome}</td>
                    <td style={styles.td}>{f.email}</td>
                    <td style={styles.td}>{f.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Holerites Enviados</h2>

          {holerites.length === 0 ? (
            <p style={styles.emptyText}>Nenhum holerite enviado.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Funcionário</th>
                  <th style={styles.th}>Mês</th>
                  <th style={styles.th}>Ano</th>
                  <th style={styles.th}>Visualizado</th>
                  <th style={styles.th}>Visualizado em</th>
                  <th style={styles.th}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {holerites.map((h) => (
                  <tr key={h.id}>
                    <td style={styles.td}>{h.id}</td>
                    <td style={styles.td}>{getNomeFuncionario(h.funcionarioId)}</td>
                    <td style={styles.td}>{h.mes}</td>
                    <td style={styles.td}>{h.ano}</td>
                    <td style={styles.td}>{h.visualizado ? 'Sim' : 'Não'}</td>
                    <td style={styles.td}>
                      {h.visualizadoEm
                        ? new Date(h.visualizadoEm).toLocaleString()
                        : '-'}
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <button
                          onClick={() => visualizarHolerite(h.id)}
                          style={styles.primaryButtonSmall}
                        >
                          Visualizar
                        </button>

                        <button
                          onClick={() => baixarHolerite(h.id)}
                          style={styles.secondaryButton}
                        >
                          Baixar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f4f6f8',
    padding: '32px 16px',
    fontFamily: 'Arial, sans-serif',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    gap: '16px',
  },
  title: {
    margin: 0,
    fontSize: '36px',
  },
  subtitle: {
    marginTop: '8px',
    fontSize: '18px',
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#d9534f',
    color: '#fff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    marginBottom: '24px',
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: '18px',
    fontSize: '26px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '12px',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  primaryButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#0d6efd',
    color: '#fff',
    border: 'none',
    padding: '12px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  primaryButtonSmall: {
    backgroundColor: '#0d6efd',
    color: '#fff',
    border: 'none',
    padding: '10px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#198754',
    color: '#fff',
    border: 'none',
    padding: '10px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  successBox: {
    backgroundColor: '#d1e7dd',
    color: '#0f5132',
    border: '1px solid #badbcc',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  errorBox: {
    backgroundColor: '#f8d7da',
    color: '#842029',
    border: '1px solid #f5c2c7',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  emptyText: {
    margin: 0,
    color: '#666',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    borderBottom: '2px solid #ddd',
    backgroundColor: '#f8f9fa',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #eee',
    verticalAlign: 'middle',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
};

export default AdminDashboard;