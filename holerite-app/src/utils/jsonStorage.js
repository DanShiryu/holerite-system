const fs = require('fs');
const path = require('path');

const readJsonFile = (fileName) => {
  const filePath = path.join(__dirname, '../../data', fileName);

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf-8');
  }

  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

const writeJsonFile = (fileName, data) => {
  const filePath = path.join(__dirname, '../../data', fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

module.exports = {
  readJsonFile,
  writeJsonFile
};