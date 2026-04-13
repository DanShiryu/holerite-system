const express = require('express');
const router = express.Router();

const {
  cadastrarFuncionario,
  listarFuncionarios
} = require('../controllers/funcionarioController');

router.post('/', cadastrarFuncionario);
router.get('/', listarFuncionarios);

module.exports = router;