const mongoose = require("mongoose");
const message = require("./message");

const o2oConv = mongoose.Schema({
  user1: {
    type: String,
    required: true,
  },
  user2: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("o2oConv", o2oConv);
