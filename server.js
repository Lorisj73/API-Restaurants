// SERVER INITIALIZATION
// File: server.js

const express = require('express');
const cors = require('cors'); 
const sequelize = require('./config/database');

// Import des routes
const userRoutes = require('./routes/userRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const platRoutes = require('./routes/platRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes'); // Ajout des routes pour le panier
const orderRoutes = require('./routes/orderRoutes'); // Ajout des routes pour les commandes

const models = require('./models'); // Import des modèles pour synchronisation et vérifications

const app = express();

// Configuration CORS
app.use(cors({
  origin: 'http://localhost:5173' // Autorise les requêtes venant de cette origine
}));

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Enregistrement des routes
app.use('/api/users', userRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/plats', platRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes); // Ajout de la route du panier
app.use('/api/orders', orderRoutes); // Ajout de la route des commandes

// Synchronisation avec la base de données et lancement du serveur
sequelize.sync({ force: false }) // Remplacez `force: true` par `false` en production pour éviter la perte de données
  .then(() => {
    console.log('La base de données est synchronisée');
    console.log('Modèles synchronisés :', Object.keys(models));
    app.listen(3000, () => {
      console.log('Le serveur est lancé sur le port 3000');
    });
  })
  .catch((error) => {
    console.error('Erreur de synchronisation :', error);
  });
