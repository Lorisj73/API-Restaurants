const Client = require('./client');
const Restaurant = require('./restaurant');
const Plat = require('./plat');
const Commande = require('./commande');
const Panier = require('./panier');
const Cart = require('./cart');
const CartItem = require('./cartItem');
const Order = require('./order');
const OrderItem = require('./orderItem');
const User = require('./user');

// Define associations
Restaurant.hasMany(Plat, { foreignKey: 'restaurantId' });
Plat.belongsTo(Restaurant, { foreignKey: 'restaurantId' });

Client.hasMany(Commande, { foreignKey: 'clientId' });
Commande.belongsTo(Client, { foreignKey: 'clientId' });

Client.hasOne(Panier, { foreignKey: 'clientId' });
Panier.belongsTo(Client, { foreignKey: 'clientId' });

Panier.hasMany(Plat, { foreignKey: 'panierId' });
Plat.belongsTo(Panier, { foreignKey: 'panierId' });

Commande.hasMany(Plat, { foreignKey: 'commandeId' });
Plat.belongsTo(Commande, { foreignKey: 'commandeId' });

Cart.belongsTo(User, { foreignKey: 'userId' });
Cart.hasMany(CartItem, { foreignKey: 'cartId' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId' });
CartItem.belongsTo(Plat, { foreignKey: 'platId' });

Order.belongsTo(User, { foreignKey: 'userId' });
Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(Plat, { foreignKey: 'platId' });


module.exports = { Client, Restaurant, Plat, Commande, Panier, Cart, CartItem, Order, OrderItem, User };
