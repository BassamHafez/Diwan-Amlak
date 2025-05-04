const mongoose = require("mongoose");

const termSchema = new mongoose.Schema({
  ar: {
    type: [String],
    required: true,
  },
  en: {
    type: [String],
    required: true,
  },
});

const Term = mongoose.model("Term", termSchema);

module.exports = Term;
