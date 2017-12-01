const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  count: { default: 0, type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  deletedAt: { type: Date, default: null }
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
