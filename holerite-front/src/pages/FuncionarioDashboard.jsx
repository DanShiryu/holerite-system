import { useEffect, useState } from 'react';
import api from '../services/api';

function FuncionarioDashboard() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const [holerites, setHolerites] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

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
    const fetchHolerites = async () => {
      try {
        const response = await api.get('/holerites');
        setHolerites(response.data);
      } catch (error) {
        console.error('Erro ao carregar holerites:', error);
        setErro('Não foi possível carregar os holerites.');
      }
    };

    fetchHolerites();
  }, []);

  const visualizarHolerite = async (id) => {
    setMensagem('');
    setErro('');

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
    setMensagem('');
    setErro('');

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

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Painel do Funcionário</h1>
            <p style={styles.subtitle}>Bem-vindo, {usuario?.nome}</p>
          </div>

          <button onClick={sair} style={styles.logoutButton}>
            Sair
          </button>
        </div>

        {mensagem && <div style={styles.successBox}>{mensagem}</div>}
        {erro && <div style={styles.errorBox}>{erro}</div>}

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Meus Holerites</h2>

          {holerites.length === 0 ? (
            <p style={styles.emptyText}>Nenhum holerite encontrado.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
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
                          style={styles.primaryButton}
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
    maxWidth: '1100px',
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
  primaryButton: {
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
};

export default FuncionarioDashboard;