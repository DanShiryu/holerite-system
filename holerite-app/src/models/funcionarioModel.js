const { readJsonFile, writeJsonFile } = require('../utils/jsonStorage');

const FILE_NAME = 'funcionarios.json';

const getAllFuncionarios = () => {
  return readJsonFile(FILE_NAME);
};

const saveAllFuncionarios = (funcionarios) => {
  writeJsonFile(FILE_NAME, funcionarios);
};

module.exports = {
  getAllFuncionarios,
  saveAllFuncionarios
};