import Sequelize from 'sequelize'; // importa o sequelize, que cuida das migrations do banco de dados
import mongoose from 'mongoose'; //

import User from '../app/models/User'; // importa a model de usuário
import File from '../app/models/File'; // importa a model de arquivos
import Appointment from '../app/models/Appointment'; // importa a model de appointments

import databaseConfig from '../config/database'; // importa a configuração de database

const models = [User, File, Appointment]; // define as models como objetos/variáveisy

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  // cria a conexão com o banco de dados, e relaciona as informações entre tabelas
  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
    });
  }
}

export default new Database();
