const bcrypt = require('bcryptjs');

const {
  getAllFuncionarios,
  saveAllFuncionarios
} = require('../models/funcionarioModel');

const cadastrarFuncionario = async (req, res) => {
  try {
    const { nome, cpf, email, senha, role } = req.body;

    if (!nome || !cpf || !email || !senha) {
      return res.status(400).json({
        error: 'Nome, CPF, email e senha são obrigatórios.'
      });
    }

    const funcionarios = getAllFuncionarios();

    const funcionarioExistente = funcionarios.find(
      (f) => f.cpf === cpf || f.email === email
    );

    if (funcionarioExistente) {
      return res.status(409).json({
        error: 'Já existe um funcionário com este CPF ou email.'
      });
    }

    const proximoId =
      funcionarios.length > 0
        ? Math.max(...funcionarios.map((f) => f.id)) + 1
        : 1;

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoFuncionario = {
      id: proximoId,
      nome,
      cpf,
      email,
      senha: senhaHash,
      role: role === 'admin' ? 'admin' : 'funcionario'
    };

    funcionarios.push(novoFuncionario);
    saveAllFuncionarios(funcionarios);

    return res.status(201).json({
      message: 'Funcionário cadastrado com sucesso.',
      funcionario: {
        id: novoFuncionario.id,
        nome: novoFuncionario.nome,
        cpf: novoFuncionario.cpf,
        email: novoFuncionario.email,
        role: novoFuncionario.role
      }
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Erro interno ao cadastrar funcionário.'
    });
  }
};

const listarFuncionarios = (req, res) => {
  try {
    const funcionarios = getAllFuncionarios();

    const funcionariosSemSenha = funcionarios.map((funcionario) => ({
      id: funcionario.id,
      nome: funcionario.nome,
      cpf: funcionario.cpf,
      email: funcionario.email,
      role: funcionario.role
    }));

    return res.status(200).json(funcionariosSemSenha);
  } catch (error) {
    return res.status(500).json({
      error: 'Erro interno ao listar funcionários.'
    });
  }
};

module.exports = {
  cadastrarFuncionario,
  listarFuncionarios
};