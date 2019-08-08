import * as Yup from 'yup'; // importa o Yup para fazer a validação dos campos
import Appointment from '../models/Appointment'; // importa a model de agendamentos
import User from '../models/User'; // importa a model de usuários

// classe para criação de sessão, que não são inseridas no banco de dados
// 1º -> realiza a validação através do Yup
// 2º -> verifica se o schema do Yup é válido
// 3º -> recebe as informações do corpo (body) da requisição
// 4º -> verifica se o usuário está criando um appointment com um provider
// 5º -> caso não seja, retorna um erro ao usuário
// 6º -> cria o appointment e retorna as informações
class AppointmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date } = req.body;

    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!checkIsProvider) {
      return res.json({
        error: 'You can only make appointments with proividers',
      });
    }

    const appointment = await Appointment.create({
      user_id: req.user_id,
      provider_id,
      date,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
