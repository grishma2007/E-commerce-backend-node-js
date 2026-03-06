
const express = require("express");

const cors = require("cors");

const paymentRoutes = require("../routes/paymentRoutes");
const productRoutes = require("../routes/productRoutes");
const reviewRoutes = require("../routes/reviewRoutes");
const authRoutes = require("../routes/authRoutes");
const User = require("../models/User");
const orderRoutes = require('../routes/orderRoutes');
const app = express();

const session = require("express-session");
const {MongoStore }= require('connect-mongo');


app.use(cors({
  origin: "https://e-commerce-site-admin-page.vercel.app",
  credentials: true
}));
app.get("/", (req, res) => {
  res.json({ message: "Backend running successfully 🚀" });
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI, 
    collectionName: 'sessions', 
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',       
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'    
  }
}));


// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: true,       
//     httpOnly: true,
//     sameSite: "none"    
//   }
// }));
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: false,   
//     httpOnly: true
//   }
// }));

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// mongoose.connect("mongodb://127.0.0.1:27017/mydb")
const connectDB = require("../lib/db");
connectDB();
const requireLogin = (req, res, next) => {
  if (req.session && req.session.isLoggedIn) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

app.get("/info", requireLogin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

app.delete("/info/:id", requireLogin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

app.put("/info/:id", requireLogin, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});


app.use("/products", productRoutes);
app.use("/reviews", reviewRoutes);
app.use("/register", authRoutes);
app.use("/login", authRoutes);
app.use("/me", authRoutes);
app.use('/api/orders', orderRoutes);
app.use("/api/payment", paymentRoutes);

const PORT = process.env.PORT || 5000;
module.exports = app;