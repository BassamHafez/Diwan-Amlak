const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
    unique: true,
  },
  tags: {
    type: [String],
    default: [],
  },
});

const Tag = mongoose.model("Tag", tagSchema);

module.exports = Tag;
