const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadPath = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const isPDF = file.mimetype === 'application/pdf';
  if (isPDF) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos PDF são permitidos.'));
  }
};

const upload = multer({
  storage,
  fileFilter
});

module.exports = upload;