const mongoose = require("mongoose");

const userScheme = mongoose.Schema({
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  mood: { type: String, required: false },
  isAdmin: { type: Boolean, required: true },
});

module.exports = mongoose.model("User", userScheme);
