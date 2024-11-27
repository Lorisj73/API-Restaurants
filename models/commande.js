const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Commande = sequelize.define('Commande', {
  nombreArticles: { type: DataTypes.INTEGER, allowNull: false },
  prixTotal: { type: DataTypes.FLOAT, allowNull: false },
});

module.exports = Commande;