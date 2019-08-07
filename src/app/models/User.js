import Sequelize, { Model } from 'sequelize'; // importa o sequelize
import bcrypt from 'bcryptjs'; // importa o bcrypt

// model de usuário
class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    // antes de salvar no banco de dados, realiza a encriptação da senha e forma o hash
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  // refencia o campo de id do avatar de usuário
  static associate(models) {
    this.belongsTo(models.file, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  // verifica senha
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
