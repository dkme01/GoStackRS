import { Router } from 'express';

import UserController from './app/controllers/UserController'; // controller de usuário
import SessionController from './app/controllers/SessionController'; // controller de sessão

import authMiddleware from './app/middlewares/auth'; // middleware de autenticação de sessão

const routes = new Router();

/* rotas post */
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

/* rota do middleware de autenticação */
routes.use(authMiddleware);

/* rotas put */
routes.put('/users', UserController.update);

export default routes;
