const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

const requireLogin = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      message: "Please login to place order"
    });
  }
  next();
};

router.post("/", requireLogin, async (req, res) => {
  console.log("SESSION IN ORDER ROUTE:", req.session);

  try {
    const {
  customer,
  items,
  totalAmount,
  paymentMethod,
  razorpayPayment
} = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const normalizedItems = items.map(item => ({
      productId: item.id || item._id,           
      name: item.name,
      quantity: item.quantity,
      price: Number(
        String(item.price).replace(/[^0-9.]/g, "")
      ),                                        
      image: item.image
    }));

   const newOrder = new Order({
  user: req.session.userId,
  customer,
  items: normalizedItems,
  totalAmount: Number(
    String(totalAmount).replace(/[^0-9.]/g, "")
  ),

  paymentMethod,
  paymentStatus: paymentMethod === "cod" ? "PENDING" : "PAID",
  isPaid: paymentMethod !== "cod",

  razorpay: razorpayPayment || {},

  status: "Processing"
});


    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully"
    });

  } catch (error) {
    console.error("❌ ORDER CREATION ERROR:", error);
    res.status(500).json({ message: "Order failed" });
  }
});


router.get("/my-orders", requireLogin, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.session.userId })
      .populate("user", "name email")  
    .sort({ createdAt: -1 });


    res.json(orders);
  } catch (error) {
    console.error("❌ FETCH ORDERS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch orders"
    });
  }
});
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("❌ ADMIN FETCH ORDERS ERROR:", error);
    res.status(500).json({
      message: "Failed to fetch orders"
    });
  }
});
// 🔐 ADMIN / ORDER DETAILS
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email");
    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("ORDER DETAILS ERROR:", error);
    res.status(500).json({
      message: "Failed to load order"
    });
  }
});

router.put('/:id/cancel', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.status = req.body.status || "Cancelled"; 
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


module.exports = router;
