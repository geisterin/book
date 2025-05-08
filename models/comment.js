'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Комментарий принадлежит пользователю
      Comment.belongsTo(models.User, {
        foreignKey: 'user_id'
      });
    
      // Комментарий относится к одной книге
      Comment.belongsTo(models.Book, {
        foreignKey: 'book_id'
      });
    }
    
  }
  Comment.init({
    body: DataTypes.TEXT,
    user_id: DataTypes.INTEGER,
    book_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};