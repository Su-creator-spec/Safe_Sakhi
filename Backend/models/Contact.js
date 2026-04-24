const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  userId: String,
  name: String,
  phone: String
});

module.exports = mongoose.model("Contact", contactSchema);