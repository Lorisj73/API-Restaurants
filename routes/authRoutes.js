const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route de connexion pour tous les utilisateurs
router.post('/login', authController.login);

module.exports = router;
