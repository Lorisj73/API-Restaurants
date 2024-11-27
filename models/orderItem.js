const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Order = require('./order');
const Plat = require('./plat');

const OrderItem = sequelize.define('OrderItem', {
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Order,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  platId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Plat,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  status: {
    type: DataTypes.ENUM('pending', 'validated'),
    defaultValue: 'pending',
  },
});

module.exports = OrderItem;
