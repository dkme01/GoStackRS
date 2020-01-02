import * as Yup from 'yup'; // importa o Yup para fazer a validação dos campos
import User from '../models/User'; // importa o model de usuário
import File from '../models/File'; // importa o model de files

class UserController {
  // classe para criação de usuários
  // 1º -> realiza a validação através do Yup
  // 2º -> verifica se o schema do Yup é válido
  // 3º -> verifica se o usuário já existe, caso sim, retorna erro
  // 4º -> armazena o usuário no banco de dados e retorna os valores inseridos (exceto password)
  async store(req, res) {
    const schema = Yup.object({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists!' });
    }

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  // classe para atualização das informações do usuário
  // 1º -> realiza a validação através do Yup (é necessário validar o password, caso seja alterado)
  // 2º -> verifica se o schema do Yup é válido
  // 3º -> procura o usuário no banco de dados
  // 4º -> verifica o email a ser alterado, caso o mesmo esteja cadastrado em outra conta, retorna o erro
  // 5º -> verifica se a senha antiga (atual) confere com o banco de dados
  // 6º -> atualiza as informações no banco de dados e retorna o usuário que foi alterado
  async update(req, res) {
    const schema = Yup.object({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({
        where: { email },
      });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists!' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    await user.update(req.body);

    const { id, name, avatar } = await User.findByPk(req.userId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({
      id,
      name,
      email,
      avatar,
    });
  }
}

export default new UserController();
