import { startOfDay, endOfDay, parseISO } from 'date-fns'; // importa o date-fns para manipulação de datas
import { Op } from 'sequelize'; // importa o operador do sequelize

import Appointment from '../models/Appointment'; // importa a model de agendamentos
import User from '../models/User'; // importa a model de usuários

class ScheduleController {
  // classe para listagem de agendamentos dos providers
  // 1º -> verifica se o usuário é um provider
  // 2º -> caso não seja, retorna um erro
  // 3º -> formata a data para realizar a busca
  // 4º -> busca todos os agendamentos do provider no periodo de 24 horas
  // 5º -> retorna os agendamentos para o provider
  async index(req, res) {
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkUserProvider) {
      return res.status(401).json({ error: 'User is not a provider' });
    }

    const { date } = req.query;
    const parsedDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        cancelled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
      order: ['date'],
    });

    return res.json(appointments);
  }
}

export default new ScheduleController();
