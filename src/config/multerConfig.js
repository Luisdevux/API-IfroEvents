import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

// Define os tipos de mídias aceitos e seus respectivos dirtórios
const tiposDiretorios = {
  capa: 'uploads/capa',
  carrossel: 'uploads/carrossel',
  video: 'uploads/video',
}

// Define as extensões permitidas por tipo
const extensoesPermitidas = {
  capa: ['.jpg', '.jpeg', '.png'],
  carrossel: ['.jpg', '.jpeg', '.png'],
  video: ['.mp4']
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tipo = req.params.tipo;
    const diretorio = tiposDiretorios[tipo];

    if(!diretorio) {
      return cb(new Error("Tipo de mídia inválido."), false);
    }

    if(!fs.existsSync(diretorio)) {
      fs.mkdirSync(diretorio, { recursive: true });
    }

    cb(null, diretorio);
  },

  filename: (req, file, cb) => {
    const extensao = path.extname(file.originalname).toLowerCase();
    const nomeArquivo = `${uuidv4()}${extensao}`;
    cb(null, nomeArquivo);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // Equivalente para 25 MB
  },
  fileFilter: (req, file, cb) => {
    const tipo = req.params.tipo;
    const extensao = path.extname(file.originalname).toLowerCase();

    const tiposPermitidos = extensoesPermitidas[tipo];
    if(!tiposPermitidos || !tiposPermitidos.includes(extensao)) {
      return cb(new Error(`Extensão inválida para o tipo de mídia '${tipo}.`));
    }

    cb(null, true);
  }
});

export default upload;