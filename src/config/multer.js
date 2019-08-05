import multer from 'multer'; // importa o multer
import crypto from 'crypto'; // biblioteca padrão do node para criar caracteres aleatórios, etc
import { extname, resolve } from 'path'; // serve para encontrar a extenção do arquivo baseado no nome, e para percorrer caminhos dentro da aplicação

// configuração para armazenagem de arquivos upados pelos usuários
// 1º -> seta o destino de armazenagem dos arquivos
// 2º -> configura a criptografia do filename que o usuário fez upload
// 3º -> retorna erro ou o nome do arquivo em exadecimal
export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb;

        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
