const {
  getAllHolerites,
  saveAllHolerites
} = require('../models/holeriteModel');

const {
  getAllFuncionarios
} = require('../models/funcionarioModel');

const path = require('path');

// =============================
// Upload de holerite
// =============================
const uploadHolerite = (req, res) => {
  try {
    const file = req.file;
    const { funcionarioId, mes, ano } = req.body;

    if (!file) {
      return res.status(400).json({
        error: 'Nenhum arquivo enviado.'
      });
    }

    if (!funcionarioId || !mes || !ano) {
      return res.status(400).json({
        error: 'Funcionário, mês e ano são obrigatórios.'
      });
    }

    const funcionarios = getAllFuncionarios();

    const funcionarioExiste = funcionarios.find(
      (f) => f.id === Number(funcionarioId)
    );

    if (!funcionarioExiste) {
      return res.status(404).json({
        error: 'Funcionário não encontrado.'
      });
    }

    const holerites = getAllHolerites();

    const proximoId =
      holerites.length > 0
        ? Math.max(...holerites.map((h) => h.id)) + 1
        : 1;

    // 🔥 CORREÇÃO DE ENCODING
    const nomeCorrigido = Buffer.from(file.originalname, 'latin1').toString('utf8');

    const novoHolerite = {
      id: proximoId,
      funcionarioId: Number(funcionarioId),
      mes,
      ano,
      arquivo: {
        originalName: nomeCorrigido,
        savedName: file.filename,
        path: file.path
      },
      visualizado: false,
      visualizadoEm: null
    };

    holerites.push(novoHolerite);
    saveAllHolerites(holerites);

    return res.status(201).json({
      message: 'Holerite enviado com sucesso.',
      holerite: novoHolerite
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: 'Erro interno ao enviar holerite.'
    });
  }
};

// =============================
// Listar holerites
// =============================
const listarHolerites = (req, res) => {
  try {
    const holerites = getAllHolerites();

    // Se for admin → retorna todos
    if (req.funcionario.role === 'admin') {
      return res.status(200).json(holerites);
    }

    // Se for funcionário → só os dele
    const meusHolerites = holerites.filter(
      (h) => h.funcionarioId === req.funcionario.id
    );

    return res.status(200).json(meusHolerites);
  } catch (error) {
    return res.status(500).json({
      error: 'Erro ao listar holerites.'
    });
  }
};

// =============================
// Visualizar (abrir PDF)
// =============================
const visualizarHolerite = (req, res) => {
  try {
    const { id } = req.params;

    const holerites = getAllHolerites();

    const holerite = holerites.find((h) => h.id === Number(id));

    if (!holerite) {
      return res.status(404).json({
        error: 'Holerite não encontrado.'
      });
    }

    const ehAdmin = req.funcionario.role === 'admin';
    const ehDono = holerite.funcionarioId === req.funcionario.id;

    if (!ehAdmin && !ehDono) {
      return res.status(403).json({
        error: 'Acesso negado.'
      });
    }

    // 🔥 REGISTRA LEITURA SOMENTE PARA FUNCIONÁRIO DONO
    if (!holerite.visualizado && ehDono) {
      holerite.visualizado = true;
      holerite.visualizadoEm = new Date().toISOString();

      saveAllHolerites(holerites);
    }

    return res.sendFile(path.resolve(holerite.arquivo.path));
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: 'Erro ao abrir holerite.'
    });
  }
};

module.exports = {
  uploadHolerite,
  listarHolerites,
  visualizarHolerite
};