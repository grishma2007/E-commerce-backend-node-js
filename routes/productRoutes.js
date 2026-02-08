const express = require("express");
const Product = require("../models/Product");
const upload = require("../middleware/upload");
const router = express.Router();

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      image: req.file ? `uploads/${req.file.filename}` : ""
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: "Product ID already exists" });
  }
});

router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

module.exports = router;
