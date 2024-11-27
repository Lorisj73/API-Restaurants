const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/add', verifyToken, cartController.addToCart);
router.get('/', verifyToken, cartController.getCart);
router.delete('/clear', verifyToken, cartController.clearCart); // Vider le panier
router.patch('/decrease', verifyToken, cartController.decreaseQuantity); // Réduire quantité
router.delete('/remove', verifyToken, cartController.removeFromCart); // Supprimer un plat


module.exports = router;
