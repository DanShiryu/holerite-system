const express = require('express');
const cors = require('cors');

const holeriteRoutes = require('./routes/holeriteRoutes');
const funcionarioRoutes = require('./routes/funcionarioRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API de Holerites rodando 🚀');
});

app.use('/holerites', holeriteRoutes);
app.use('/funcionarios', funcionarioRoutes);
app.use('/auth', authRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});