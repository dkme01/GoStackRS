import nodemailer from 'nodemailer'; // importa o nodemailer para manipulação de emails
import { resolve } from 'path'; // importa o resolve, que trata os caminhos da aplicação
import exphbs from 'express-handlebars'; // importa o handlebars integrado com o express para tratar os layouts
import nodemailerhbs from 'nodemailer-express-handlebars'; // importa o plugin do nodemailer com o handlebars
import mailConfig from '../config/mail'; // importa a configuração do envio de email

// classe para configuração de envio de emails
// 1º -> construtor que inicia as configurações
// 2º -> cria o transporter para o envio dos emails
// 3º -> inicia os templates
// 4º -> configura o uso de template para emails
// 5º -> envia o email
class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });

    this.configureTemplates();
  }

  configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          extname: '.hbs',
        }),
        viewPath,
        extname: '.hbs',
      })
    );
  }

  sendMail(message) {
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();
