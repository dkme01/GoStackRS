import { Router } from 'express';
import User from './app/models/User';

const routes = new Router();

routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Bryan Alexandre',
    email: 'bryan@email.com.br',
    password_hash: '1234567890',
  });

  return res.json(user);
});

export default routes;
