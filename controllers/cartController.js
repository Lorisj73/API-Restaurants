const Cart = require('../models/cart');
const CartItem = require('../models/cartItem');
const Plat = require('../models/plat');

// Ajouter un plat au panier
exports.addToCart = async (req, res) => {
  try {
    const { platId, quantity } = req.body;
    const userId = req.user.userId;

    // Récupérer ou créer le panier
    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      cart = await Cart.create({ userId });
    }

    // Vérifier si l'article existe déjà dans le panier
    let cartItem = await CartItem.findOne({ where: { cartId: cart.id, platId } });
    if (cartItem) {
      // Augmenter la quantité si l'article existe
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // Sinon, ajouter un nouvel article
      cartItem = await CartItem.create({ cartId: cart.id, platId, quantity });
    }

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer le panier
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    console.log('ID utilisateur :', req.user.userId);

    const cart = await Cart.findOne({
      where: { userId },
      include: {
        model: CartItem,
        include: [Plat],
      },
    });

    res.status(200).json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// cartController.js
exports.clearCart = async (req, res) => {
    try {
      const userId = req.user.userId;
  
      // Trouver le panier de l'utilisateur
      const cart = await Cart.findOne({ where: { userId } });
  
      if (!cart) {
        return res.status(404).json({ message: "Panier introuvable." });
      }
  
      // Supprimer tous les items du panier
      await CartItem.destroy({ where: { cartId: cart.id } });
  
      res.status(200).json({ message: "Le panier a été vidé." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  
  // cartController.js
exports.decreaseQuantity = async (req, res) => {
    try {
      const { platId } = req.body;
      const userId = req.user.userId;
  
      // Trouver le panier de l'utilisateur
      const cart = await Cart.findOne({ where: { userId } });
  
      if (!cart) {
        return res.status(404).json({ message: "Panier introuvable." });
      }
  
      // Trouver l'item dans le panier
      const cartItem = await CartItem.findOne({
        where: { cartId: cart.id, platId },
      });
  
      if (!cartItem) {
        return res.status(404).json({ message: "Article introuvable dans le panier." });
      }
  
      // Réduire la quantité ou supprimer l'item si la quantité devient 0
      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
        await cartItem.save();
        return res.status(200).json(cartItem);
      } else {
        await cartItem.destroy();
        return res.status(200).json({ message: "Article supprimé du panier." });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  
  // cartController.js
exports.removeFromCart = async (req, res) => {
    try {
      const { platId } = req.body;
      const userId = req.user.userId;
  
      // Trouver le panier de l'utilisateur
      const cart = await Cart.findOne({ where: { userId } });
  
      if (!cart) {
        return res.status(404).json({ message: "Panier introuvable." });
      }
  
      // Supprimer l'article du panier
      const deleted = await CartItem.destroy({
        where: { cartId: cart.id, platId },
      });
  
      if (!deleted) {
        return res.status(404).json({ message: "Article introuvable dans le panier." });
      }
  
      res.status(200).json({ message: "Article supprimé du panier." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
