import jwt from 'jsonwebtoken';
import { promisify } from 'util'; // biblioteca para decodificação do token de sessão

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // retorna erro caso o token não seja recebido
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }
  // desestrutura o array, ficando apenas com o token
  const [, token] = authHeader.split(' ');
  // verifica se o token é valido, fazendo a decodificação do mesmo através do
  // promisify, que é importado das bibliotecas padrões do Node (util)
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
