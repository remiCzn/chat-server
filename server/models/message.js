const mongoose = require("mongoose");

const messageScheme = mongoose.Schema(
  {
    userId: { type: String, required: true },
    content: { type: String, required: true },
    convId: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageScheme);
