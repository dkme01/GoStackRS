import File from '../models/File'; // importa o model de arquivo

// controller de ARQUIVOS
// 1º -> recebe os dados do arquivo (nome e path)
// 2º -> cria o arquivo no banco de dados
// 3º -> retorna as informações do arquivo criado
class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    return res.json(file);
  }
}

export default new FileController();
