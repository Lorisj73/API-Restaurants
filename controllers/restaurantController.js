const Restaurant = require('../models/restaurant');
const bcrypt = require('bcryptjs');

exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addRestaurant = async (req, res) => {
  try {
    const { nom, adresse, codePostal, ville } = req.body;

    // Vérifiez que l'utilisateur connecté est bien un restaurateur
    if (req.user.role !== 'restaurateur') {
      return res.status(403).json({ message: "Seul un restaurateur peut ajouter un restaurant" });
    }

    // Vérifiez si un restaurant existe déjà pour cet utilisateur
    const existingRestaurant = await Restaurant.findOne({ where: { userId: req.user.userId } });
    if (existingRestaurant) {
      return res.status(400).json({ message: "Vous avez déjà un restaurant" });
    }

    // Créez le restaurant
    const newRestaurant = await Restaurant.create({
      nom,
      adresse,
      codePostal,
      ville,
      email: req.user.email, // Email du compte utilisateur
      userId: req.user.userId, // ID de l'utilisateur connecté
    });

    res.status(201).json(newRestaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Restaurant.destroy({ where: { id } });
    if (deleted) {
      res.status(204).json({ message: 'Restaurant supprimé' });
    } else {
      res.status(404).json({ message: 'Restaurant non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


