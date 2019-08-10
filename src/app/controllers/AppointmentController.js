import * as Yup from 'yup'; // importa o Yup para fazer a validação dos campos
import { startOfHour, parseISO, isBefore } from 'date-fns';
import Appointment from '../models/Appointment'; // importa a model de agendamentos
import User from '../models/User'; // importa a model de usuários
import File from '../models/File'; // importa a model de arquivos

// classe para criação de sessão, que não são inseridas no banco de dados
// 1º -> realiza a listagem de todos os agendamentos do usuário
// 2º -> realiza a validação através do Yup
// 3º -> verifica se o schema do Yup é válido
// 4º -> recebe as informações do corpo (body) da requisição
// 5º -> verifica se o usuário está criando um appointment com um provider
// 6º -> caso não seja, retorna um erro ao usuário
// 7º -> verifica se a data do agendamento não é passada (antes do dia/horário atual)
// 8º -> cria o appointment e retorna as informações
class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, cancelled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

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
        error: 'You can only make appointments with providers',
      });
    }

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        cancelled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
