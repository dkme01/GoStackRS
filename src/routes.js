import { Router } from 'express'; // import o Router de dentro do express
import multer from 'multer'; // importa o multer para manipulação de arquivos

import multerConfig from './config/multer'; // importa a configuração do multer

import UserController from './app/controllers/UserController'; // controller de usuário
import SessionController from './app/controllers/SessionController'; // controller de sessão
import FileController from './app/controllers/FileController'; // controller de arquivos
import ProviderController from './app/controllers/ProviderController'; // controller de providers
import AppointmentController from './app/controllers/AppointmentController'; // controller de agendamentos
import ScheduleController from './app/controllers/ScheduleController'; // controller de agenda do provider
import NotificationController from './app/controllers/NotificationController'; // controller de notificações
import AvailableController from './app/controllers/AvailableController'; // controller de horários disponíveis

import authMiddleware from './app/middlewares/auth'; // middleware de autenticação de sessão

const routes = new Router(); // router para redirecionamento das rotas do programa
const upload = multer(multerConfig); // config do upload de arquivos

routes.post('/users', UserController.store); // post de usuários
routes.post('/sessions', SessionController.store); // post de sessão

routes.use(authMiddleware); // middleware de autenticação

routes.put('/users', UserController.update); // put de usuário

routes.get('/providers', ProviderController.index); // get de providers
routes.get('/providers/:providerId/available', AvailableController.index); // get de horários disponíveis

routes.get('/appointments', AppointmentController.index); // get de agendamentos
routes.post('/appointments', AppointmentController.store); // post de agendamentos
routes.delete('/appointments/:id', AppointmentController.delete); // delete de agendamentos

routes.get('/schedule', ScheduleController.index); // get de agenda do provider

routes.get('/notifications', NotificationController.index); // get de notificações do provider
routes.put('/notifications/:id', NotificationController.update); // put de notificações do provider

routes.post('/files', upload.single('file'), FileController.store); // post de upload de arquivos

export default routes;
