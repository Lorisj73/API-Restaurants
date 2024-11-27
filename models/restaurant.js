const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Restaurant = sequelize.define('Restaurant', {
  nom: { type: DataTypes.STRING, allowNull: false },
  adresse: { type: DataTypes.STRING, allowNull: false },
  codePostal: { type: DataTypes.STRING, allowNull: false },
  ville: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
});

module.exports = Restaurant;
