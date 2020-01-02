import jwt from 'jsonwebtoken'; // importa o jwt, que gera um token (password_hash)
import * as Yup from 'yup'; // importa o Yup para fazer a validação dos campos

import User from '../models/User'; // importa o model de usuário
import File from '../models/File'; // importa o model de usuário
import authConfig from '../../config/auth'; // importa a configuração de autenticação

class SessionController {
  // classe para criação de sessão, que não são inseridas no banco de dados
  // 1º -> realiza a validação através do Yup
  // 2º -> verifica se o schema do Yup é válido
  // 3º -> recebe as informações do corpo (body) da requisição
  // 4º -> verifica se o usuário existe/está correto com base no email informado
  // 5º -> verifica se a senha informada está correta
  // 6º -> cria a seção e gera um token
  async store(req, res) {
    const schema = Yup.object({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: {
        model: File,
        as: 'avatar',
        attributes: ['id', 'path', 'url'],
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, avatar, provider } = user;

    return res.json({
      user: {
        id,
        name,
        email,
        provider,
        avatar,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
