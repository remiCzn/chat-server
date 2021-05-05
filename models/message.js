const mongoose = require("mongoose");

const messageScheme = mongoose.Schema({
  userId: { type: Number, required: true },
  content: { type: String, required: true },
  convId: { type: Number, required: false },
});

module.exports = mongoose.model("Message", messageScheme);
