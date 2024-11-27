const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Panier = sequelize.define('Panier', {
  // No specific attributes, managed via associations
});

module.exports = Panier;