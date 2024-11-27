const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Restaurant = require('./restaurant');

const Plat = sequelize.define('Plat', {
  nom: { type: DataTypes.STRING, allowNull: false },
  photo: { type: DataTypes.STRING },
  prixUnitaire: { type: DataTypes.FLOAT, allowNull: false },
  restaurantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Restaurant, // nom du modèle
      key: 'id', // clé du restaurant
    },
    onDelete: 'CASCADE', // optionnel, pour supprimer les plats si le restaurant est supprimé
  }
});

module.exports = Plat;
