const Cart = require("../models/cart");
const CartItem = require("../models/cartItem");
const Order = require("../models/order");
const OrderItem = require("../models/orderItem");
const Restaurant = require("../models/restaurant");
const Plat = require("../models/plat"); // Importer le modèle Plat

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Récupérer le panier de l'utilisateur
    const cart = await Cart.findOne({
      where: { userId },
      include: {
        model: CartItem,
        include: [Plat], // Inclure les plats dans les CartItems pour validation
      },
    });

    if (!cart || cart.CartItems.length === 0) {
      return res.status(400).json({ message: "Votre panier est vide." });
    }

    // Créer une nouvelle commande
    const order = await Order.create({ userId });

    // Ajouter les articles du panier à la commande
    const orderItems = await Promise.all(
      cart.CartItems.map((item) =>
        OrderItem.create({
          orderId: order.id,
          platId: item.platId,
          quantity: item.quantity,
        })
      )
    );

    // Supprimer les articles du panier
    await CartItem.destroy({ where: { cartId: cart.id } });

    // Supprimer le panier une fois qu'il est vide
    await Cart.destroy({ where: { id: cart.id } });

    res
      .status(201)
      .json({ message: "Commande validée avec succès.", order, orderItems });
  } catch (error) {
    console.error("Erreur lors de la création de la commande :", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user.userId; // Récupérer l'ID de l'utilisateur à partir du token

    // Récupérer toutes les commandes de l'utilisateur
    const orders = await Order.findAll({
      where: { userId },
      include: {
        model: OrderItem,
        include: [Plat], // Inclure les détails des plats pour chaque article de commande
      },
      order: [["createdAt", "DESC"]], // Trier par ordre décroissant de création
    });

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "Aucune commande trouvée pour cet utilisateur." });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des commandes de l'utilisateur :",
      error
    );
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params; // ID de la commande à récupérer

    const order = await Order.findOne({
      where: { id, userId }, // Assurez-vous que la commande appartient à l'utilisateur
      include: {
        model: OrderItem,
        include: ["Plat"], // Inclure les détails des plats dans la commande
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Commande non trouvée." });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des détails de la commande :",
      error
    );
    res.status(500).json({ error: error.message });
  }
};

exports.getOrdersByRestaurant = async (req, res) => {
  try {
    const { userId } = req.user;

    // Vérifier si le restaurateur possède un restaurant
    const restaurant = await Restaurant.findOne({ where: { userId } });

    if (!restaurant) {
      return res
        .status(404)
        .json({ message: "Restaurant non trouvé pour ce restaurateur." });
    }

    // Récupérer les commandes contenant des plats de ce restaurant
    const orders = await Order.findAll({
      include: {
        model: OrderItem,
        include: [
          {
            model: Plat,
            where: { restaurantId: restaurant.id },
          },
        ],
      },
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes :", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrderItemStatus = async (req, res) => {
  try {
    const { id } = req.params; // ID de l'article de commande
    const { status } = req.body;

    const orderItem = await OrderItem.findByPk(id);

    if (!orderItem) {
      return res
        .status(404)
        .json({ message: "Article de commande non trouvé." });
    }

    orderItem.status = status;
    await orderItem.save();

    // Vérifiez si tous les plats de la commande sont validés
    const remainingItems = await OrderItem.findAll({
      where: { orderId: orderItem.orderId, status: "pending" },
    });

    if (remainingItems.length === 0) {
      // Tous les plats validés, mise à jour du statut de la commande
      const order = await Order.findByPk(orderItem.orderId);
      order.status = "completed";
      await order.save();
    }

    res
      .status(200)
      .json({ message: "Statut mis à jour avec succès.", orderItem });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut :", error);
    res.status(500).json({ error: error.message });
  }
};
