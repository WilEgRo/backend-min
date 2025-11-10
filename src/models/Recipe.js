const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, minlength: 5 },
    name: { type: String, required: true, minlength: 3 },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
