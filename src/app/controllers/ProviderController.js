import User from '../models/User'; // importa o model de usuário
import File from '../models/File'; // importa o model de arquivos

// controller de ARQUIVOS
// 1º -> encontra todos os usuários cadastrados como providers no banco de dados
class ProviderController {
  async index(req, res) {
    const providers = await User.findAll({
      where: { provider: true },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path'],
        },
      ],
    });
    return res.json(providers);
  }
}

export default new ProviderController();
