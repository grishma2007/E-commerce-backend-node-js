const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  price: Number,
  discountPrice: Number,
  brand: String,
  category: String,
  description: String,
  image: String
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
