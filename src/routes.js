import { Router } from 'express'; // import o Router de dentro do express
import multer from 'multer'; // importa o multer para manipulação de arquivos

import multerConfig from './config/multer'; // importa a configuração do multer

import UserController from './app/controllers/UserController'; // controller de usuário
import SessionController from './app/controllers/SessionController'; // controller de sessão

import authMiddleware from './app/middlewares/auth'; // middleware de autenticação de sessão

const routes = new Router();
const upload = multer(multerConfig); // config do upload de arquivos

/* rotas post */
routes.post('/users', UserController.store); // post de usuários
routes.post('/sessions', SessionController.store); // post de sessão
routes.post('/files', upload.single('file'), (req, res) => {
  return res.json({ ok: true });
}); // post de upload de arquivos

/* rotas de middlewares */
routes.use(authMiddleware); // middleware de autenticação

/* rotas put */
routes.put('/users', UserController.update); // put de usuário

export default routes;
