import { format, parseISO } from 'date-fns'; // importa o format e o parseISO do módulo date-fns
import pt from 'date-fns/locale/pt'; // importa a localização de datas para português
import Mail from '../../lib/Mail'; // importa a configuração do envio dos emails

// classe para email de cancelamento
// 1º -> chave única de email de cancelamento
// 2º -> controlador assíncrono que envia o email com as devidas configurações
class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { appointment } = data; // recebe a data do agendamento a ser cancelado

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento Cancelado',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          parseISO(appointment.date),
          " dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new CancellationMail();
