const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // 1. Link to User (Perfect)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  customer: {
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },

  items: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      image: { type: String }
    }
  ],

  totalAmount: { type: Number, required: true },
  
  paymentMethod: {
    type: String,
    enum: ["cod", "razorpay"],
    required: true
  },
   // Payment status
  paymentStatus: {
    type: String,
    enum: ["PENDING", "PAID", "FAILED"],
    default: "PENDING"
  },

  // Razorpay payment details (only for online payments)
  razorpay: {
    paymentId: { type: String },
    orderId: { type: String },
    signature: { type: String }
  },
isPaid: { type: Boolean, default: false },
  status: { type: String, default: 'Processing' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);