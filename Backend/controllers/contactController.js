const Contact = require("../models/Contact");

const addContact = async (req, res) => {
  const contact = await Contact.create(req.body);
  res.json(contact);
};

const getContacts = async (req, res) => {
  const contacts = await Contact.find({ userId: req.params.userId });
  res.json(contacts);
};

module.exports = { addContact, getContacts };