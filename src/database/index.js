import Sequelize from 'sequelize'; // importa o sequelize, que cuida das migrations do banco de dados

import User from '../app/models/User'; // importa a model de usuário

import databaseConfig from '../config/database'; // importa a configuração de database

const models = [User]; // define a model usuário como um(a) objeto/variável

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
  }
}

export default new Database();
