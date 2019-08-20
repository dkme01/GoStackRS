import User from '../models/User'; // importa o model de usuário
import Notification from '../schemas/Notification'; // importa o schema de notificações

// controller para notificações
class NotificationController {
  // classe para listar os agendamentos do provider
  // 1º -> verifica se o usuário é um provider
  // 2º -> caso não seja, retorna um erro
  // 3º -> busca as notificações do usuário logado e retorna com filtragem new->old
  // 4º -> retorna as notificações
  async index(req, res) {
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkIsProvider) {
      return res.status(401).json({
        error: 'Only providers can load notifications',
      });
    }

    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notifications);
  }

  // classe para atualizar o status de "lido" das notificações
  async update(req, res) {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    return res.json(notification);
  }
}

export default new NotificationController();
