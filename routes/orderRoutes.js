const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, isRestaurateur } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, orderController.createOrder);

// Route pour récupérer toutes les commandes de l'utilisateur
router.get('/', verifyToken, orderController.getOrdersByUser);

// Route pour récupérer les détails d'une commande spécifique
router.get('/:id', verifyToken, orderController.getOrderDetails);

router.get('/restaurant/orders', verifyToken, isRestaurateur, orderController.getOrdersByRestaurant);

router.put('/order-item/:id', verifyToken, isRestaurateur, orderController.updateOrderItemStatus);


module.exports = router;
