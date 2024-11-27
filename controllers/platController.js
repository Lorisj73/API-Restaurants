const Plat = require('../models/plat');
const Restaurant = require('../models/restaurant');

exports.addPlat = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { nom, photo, prixUnitaire } = req.body;
    const newPlat = await Plat.create({ nom, photo, prixUnitaire, restaurantId });
    res.status(201).json(newPlat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPlatsByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    console.log("Restaurant ID reçu :", restaurantId);
    console.log("Modèle Restaurant :", Restaurant);

    // Vérification si le restaurant existe
    const restaurant = await Restaurant.findByPk(restaurantId);

    if (!restaurant) {
      console.log("Restaurant non trouvé pour l'ID :", restaurantId);
      return res.status(404).json({ message: "Restaurant non trouvé" });
    }

    // Récupération des plats liés au restaurant
    const plats = await Plat.findAll({
      where: { restaurantId },
    });


    res.status(200).json(plats);
  } catch (error) {
    console.error("Erreur dans getPlatsByRestaurant :", error.message);
    res.status(500).json({ error: error.message });
  }
};





exports.deletePlat = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Plat.destroy({ where: { id } });
    if (deleted) {
      res.status(204).json({ message: 'Plat supprimé' });
    } else {
      res.status(404).json({ message: 'Plat non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updatePlat = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, photo, prixUnitaire } = req.body;

    const plat = await Plat.findByPk(id);
    if (!plat) {
      return res.status(404).json({ message: 'Plat non trouvé' });
    }

    plat.nom = nom || plat.nom;
    plat.photo = photo || plat.photo;
    plat.prixUnitaire = prixUnitaire || plat.prixUnitaire;
    await plat.save();

    res.status(200).json(plat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
