const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userFile = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    avatar: {
      type: Array,
    },
  },
  {
    collection: "users",
  }
);

module.exports = mongoose.model("UserFile", userFile);
