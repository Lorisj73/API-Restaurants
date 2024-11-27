const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Cart = sequelize.define('Cart', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
});

module.exports = Cart;
