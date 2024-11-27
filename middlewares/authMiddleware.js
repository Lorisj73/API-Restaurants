// authMiddleware.js
const jwt = require('jsonwebtoken');

const Restaurant = require('../models/restaurant');

// Middleware pour vérifier le token JWT
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('Token manquant');
    return res.status(403).json({ message: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token décodé :', decoded); // Log du token décodé
    req.user = decoded; // Stocke les informations de l'utilisateur dans `req.user`
    next();
  } catch (error) {
    console.error('Erreur de vérification du token :', error.message);
    return res.status(401).json({ message: 'Token invalide' });
  }
};


// Middleware pour vérifier si l'utilisateur est un administrateur
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé : Administrateur requis' });
  }
  next();
};

// Middleware pour vérifier si l'utilisateur est un restaurateur ou un administrateur
exports.isRestaurateur = (req, res, next) => {
  if (req.user.role !== 'restaurateur' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé : Restaurateur requis' });
  }
  next();
};

// Middleware pour vérifier si l'utilisateur est un utilisateur standard ou un administrateur
exports.isUser = (req, res, next) => {
  if (req.user.role !== 'user' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé : Utilisateur requis' });
  }
  next();
};

exports.isOwnerOfRestaurant = async (req, res, next) => {
  try {
    console.log('Utilisateur dans req.user :', req.user); // Log des informations utilisateur
    const { id } = req.user; // Récupère l'id depuis req.user

    if (!id) {
      return res.status(403).json({ message: 'Utilisateur non authentifié.' });
    }

    const restaurant = await Restaurant.findOne({ where: { userId: id } });
    if (!restaurant) {
      return res.status(403).json({ message: "Accès refusé : Vous n'êtes pas propriétaire de ce restaurant" });
    }

    req.restaurant = restaurant; // Ajoutez les détails du restaurant dans la requête
    next();
  } catch (error) {
    console.error('Erreur dans isOwnerOfRestaurant :', error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Utilisateur non authentifié." });
  }
  next();
};
