const express = require('express');
const router = express.Router();

const { loginFuncionario } = require('../controllers/authController');

router.post('/login', loginFuncionario);

module.exports = router;