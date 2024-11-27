const User = require("../models/user");
const Restaurant = require("../models/restaurant");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

exports.addUser = async (req, res) => {
  try {
    const { login, email, password, role } = req.body;

    // Si le rôle est 'admin', refuser la création
    if (role === "admin") {
      return res.status(403).json({ message: "Impossible de créer un compte administrateur via l'API." });
    }

    // Si le rôle est 'restaurateur', vérifier que l'utilisateur est un admin
    if (role === "restaurateur" && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Seul un administrateur peut créer un compte restaurateur." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      login,
      email,
      password: hashedPassword,
      role,
    });

    // Générer un token JWT pour l'utilisateur standard
    if (role === "user") {
      const token = jwt.sign(
        { userId: newUser.id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(201).json({ accessToken: token, user: newUser });
    }

    // Retourner simplement l'utilisateur pour les autres cas (comme 'restaurateur')
    return res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.getAllRestaurateurs = async (req, res) => {
  try {
    const restaurateurs = await User.findAll({
      where: { role: "restaurateur" },
    });
    res.status(200).json(restaurateurs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.destroy({ where: { id } });
    if (deleted) {
      res.status(204).json({ message: "Utilisateur supprimé" });
    } else {
      res.status(404).json({ message: "Utilisateur non trouvé" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Nouvelle méthode pour récupérer le profil de l'utilisateur connecté
exports.getUserProfile = async (req, res) => {
  try {
    // Récupérer l'ID de l'utilisateur depuis le token
    const userId = req.user.userId;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password"] }, // Exclure le mot de passe des données retournées
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRestaurantByUser = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      where: { userId: req.user.userId }, // userId est récupéré depuis le token
    });

    if (!restaurant) {
      return res
        .status(404)
        .json({ message: "Restaurant non trouvé pour cet utilisateur." });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { login, email, password } = req.body;

    const user = await User.findByPk(id);
    if (!user || user.role !== "restaurateur") {
      return res.status(404).json({ message: "Restaurateur non trouvé." });
    }

    if (login) user.login = login;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

