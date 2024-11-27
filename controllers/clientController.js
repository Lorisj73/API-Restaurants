const Client = require('../models/client');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { nom, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newClient = await Client.create({ nom, email, password : hashedPassword });
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  // Authentication logic
};

exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (client) {
      res.status(200).json(client);
    } else {
      res.status(404).json({ message: 'Client non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};