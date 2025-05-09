'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Пользователь относится к одной роли
      User.belongsTo(models.Role, {
        foreignKey: 'role_id'
      });
    
      // Пользователь может оставить много комментариев
      User.hasMany(models.Comment, {
        foreignKey: 'user_id'
      });
    }
    
  }
  User.init({
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    role_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};