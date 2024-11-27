const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.post('/register', clientController.register);
router.post('/login', clientController.login);
router.get('/:id', clientController.getClientById);

module.exports = router;