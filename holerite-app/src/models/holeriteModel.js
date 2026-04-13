const { readJsonFile, writeJsonFile } = require('../utils/jsonStorage');

const FILE_NAME = 'holerites.json';

const getAllHolerites = () => {
  return readJsonFile(FILE_NAME);
};

const saveAllHolerites = (holerites) => {
  writeJsonFile(FILE_NAME, holerites);
};

module.exports = {
  getAllHolerites,
  saveAllHolerites
};