const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const { verifyToken, isRestaurateur } = require('../middlewares/authMiddleware');
const { isOwnerOfRestaurant } = require('../middlewares/authMiddleware');


router.get('/', verifyToken,  restaurantController.getAllRestaurants);
router.post('/', verifyToken, isRestaurateur, restaurantController.addRestaurant);
router.delete('/:id', verifyToken, isRestaurateur,isOwnerOfRestaurant, restaurantController.deleteRestaurant);

module.exports = router;
