import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

// Define os tipos de mídias aceitos e seus respectivos diretórios
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

// Define os MIME types permitidos por tipo
const mimeTypesPermitidos = {
  capa: ['image/jpeg', 'image/jpg', 'image/png'],
  carrossel: ['image/jpeg', 'image/jpg', 'image/png'],
  video: ['video/mp4']
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

// Storage para upload múltiplo
const storageMultiplo = multer.diskStorage({
  destination: (req, file, cb) => {
    let diretorio;
    
    // Determinar diretório baseado no fieldname do arquivo
    if (file.fieldname === 'midiaVideo') {
      diretorio = 'uploads/video';
    } else if (file.fieldname === 'midiaCapa') {
      diretorio = 'uploads/capa';
    } else if (file.fieldname === 'midiaCarrossel') {
      diretorio = 'uploads/carrossel';
    } else {
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
    const mimeType = file.mimetype;

    // Valida se o tipo é permitido
    const tiposPermitidos = extensoesPermitidas[tipo];
    const mimeTypesPermitidosTipo = mimeTypesPermitidos[tipo];
    
    if(!tiposPermitidos || !tiposPermitidos.includes(extensao)) {
      return cb(new Error(`Extensão inválida para o tipo de mídia '${tipo}'.`));
    }

    // Valida MIME type para segurança adicional
    if(!mimeTypesPermitidosTipo || !mimeTypesPermitidosTipo.includes(mimeType)) {
      return cb(new Error(`Tipo de arquivo inválido para '${tipo}'. MIME type não permitido.`));
    }

    cb(null, true);
  }
});

// Upload múltiplo para cadastro
const uploadMultiplo = multer({
  storage: storageMultiplo,
  limits: {
    fileSize: 25 * 1024 * 1024,
    files: 12 // Limita o número de arquivos a 12 na requisição
  },
  fileFilter: (req, file, cb) => {
    const extensao = path.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype;
    
    // Determinar tipo baseado no fieldname
    let tipo;
    if (file.fieldname === 'midiaVideo') {
      tipo = 'video';
    } else if (file.fieldname === 'midiaCapa') {
      tipo = 'capa';
    } else if (file.fieldname === 'midiaCarrossel') {
      tipo = 'carrossel';
    } else {
      return cb(new Error("Campo de mídia inválido."));
    }

    // Validar extensão e MIME type
    const tiposPermitidos = extensoesPermitidas[tipo];
    const mimeTypesPermitidosTipo = mimeTypesPermitidos[tipo];
    
    if(!tiposPermitidos || !tiposPermitidos.includes(extensao)) {
      return cb(new Error(`Extensão inválida para ${file.fieldname}.`));
    }

    if(!mimeTypesPermitidosTipo || !mimeTypesPermitidosTipo.includes(mimeType)) {
      return cb(new Error(`Tipo de arquivo inválido para ${file.fieldname}.`));
    }

    cb(null, true);
  }
});

// Middleware condicional que só processa upload se for multipart/form-data
const uploadCondicional = (fields) => {
  return (req, res, next) => {
    if (req.is('multipart/form-data')) {
      return uploadMultiplo.fields(fields)(req, res, next);
    } else {
      next();
    }
  };
};

export { uploadMultiplo, uploadCondicional };
export default upload;