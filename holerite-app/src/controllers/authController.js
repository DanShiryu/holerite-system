const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {
  getAllFuncionarios
} = require('../models/funcionarioModel');

const loginFuncionario = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        error: 'Email e senha são obrigatórios.'
      });
    }

    const funcionarios = getAllFuncionarios();

    const funcionario = funcionarios.find((f) => f.email === email);

    if (!funcionario) {
      return res.status(401).json({
        error: 'Email ou senha inválidos.'
      });
    }

    const senhaCorreta = await bcrypt.compare(senha, funcionario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({
        error: 'Email ou senha inválidos.'
      });
    }

    const token = jwt.sign(
      {
        id: funcionario.id,
        email: funcionario.email,
        role: funcionario.role
      },
      'segredo_super_seguro',
      {
        expiresIn: '1h'
      }
    );

    const { senha: _, ...funcionarioSemSenha } = funcionario;

    return res.status(200).json({
      message: 'Login realizado com sucesso.',
      token,
      funcionario: funcionarioSemSenha
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Erro interno ao realizar login.'
    });
  }
};

module.exports = {
  loginFuncionario
};