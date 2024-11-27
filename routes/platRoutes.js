const express = require('express');
const router = express.Router();
const platController = require('../controllers/platController');
const { isOwnerOfRestaurant } = require('../middlewares/authMiddleware');

console.log('platController:', platController);

const { verifyToken, isRestaurateur } = require('../middlewares/authMiddleware');

console.log('verifyToken:', verifyToken);
console.log('isRestaurateur:', isRestaurateur);

// Route pour ajouter un plat (accessible uniquement aux restaurateurs)
router.post('/:restaurantId', verifyToken, isRestaurateur, platController.addPlat);

// Route pour récupérer les plats par restaurant (accessible uniquement aux restaurateurs)
router.get('/:restaurantId', verifyToken, platController.getPlatsByRestaurant);

// Route pour supprimer un plat (accessible uniquement aux restaurateurs)
router.delete('/:id', verifyToken, isRestaurateur, platController.deletePlat);

// Route pour modifier un plat
router.put('/:id', verifyToken, isRestaurateur, platController.updatePlat);


module.exports = router;
