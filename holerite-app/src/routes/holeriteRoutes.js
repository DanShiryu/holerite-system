const express = require('express');
const router = express.Router();

const upload = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

const {
  uploadHolerite,
  listarHolerites,
  visualizarHolerite
} = require('../controllers/holeriteController');

router.post('/upload', authMiddleware, upload.single('holerite'), uploadHolerite);
router.get('/', authMiddleware, listarHolerites);
router.get('/:id', authMiddleware, visualizarHolerite);

module.exports = router;