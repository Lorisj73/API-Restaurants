const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Route pour ajouter un utilisateur
router.post('/add', (req, res, next) => {
  const { role } = req.body;
  console.log('role:', role);
  // Si le rôle est "user", autoriser sans token
  if (role === 'user') {
    return userController.addUser(req, res);
  }

  // Pour les autres rôles, vérifier le token et appliquer les permissions nécessaires
  verifyToken(req, res, () => {
    if (role === 'restaurateur') {
      return isAdmin(req, res, () => userController.addUser(req, res));
    }

    res.status(403).json({ message: 'Action non autorisée.' });
  });
});

// Route pour lister les restaurateurs (uniquement accessible par un admin)
router.get('/restaurateurs', verifyToken, isAdmin, userController.getAllRestaurateurs);

// Route pour supprimer un utilisateur (admin uniquement)
router.delete('/:id', verifyToken, isAdmin, userController.deleteUser);

// Route pour récupérer les informations de l'utilisateur connecté
router.get('/me', verifyToken, userController.getUserProfile);

// Route pour récupérer le restaurant associé à un restaurateur
router.get('/my-restaurant', verifyToken, userController.getRestaurantByUser);

router.put("/:id", verifyToken, isAdmin, userController.updateUser);


module.exports = router;
