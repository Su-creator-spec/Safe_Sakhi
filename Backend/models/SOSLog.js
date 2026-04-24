const mongoose = require("mongoose");

const sosSchema = new mongoose.Schema({
  userId: String,
  location: String,
  time: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SOSLog", sosSchema);