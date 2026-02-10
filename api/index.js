
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// // const session = require("express-session");
// const path = require("path");
// // require("dotenv").config();


// const paymentRoutes = require("./../routes/paymentRoutes");
// const productRoutes = require("./../routes/productRoutes");
// const reviewRoutes = require("./../routes/reviewRoutes");
// const authRoutes = require("./../routes/authRoutes");
// const User = require("./../models/User");
// const orderRoutes = require('./../routes/orderRoutes');
// const app = express();
// app.use(cors({
//   origin: ["http://localhost:3000", "https://eyecore.vercel.app"],
//   credentials: true
// }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // app.use(session({
// //   secret: process.env.SESSION_SECRET,
// //   resave: false,
// //   saveUninitialized: false,
// //   cookie: {
// //     secure: false,   
// //     httpOnly: true
// //   }
// // }));

// // app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// // mongoose.connect("mongodb://127.0.0.1:27017/mydb")
// const connectDB = require("../lib/db");
// connectDB();
// const requireLogin = (req, res, next) => {
//   if (req.session && req.session.isLoggedIn) {
//     next();
//   } else {
//     res.status(401).json({ message: "Unauthorized" });
//   }
// };

// app.get("/", (req, res) => {
//   res.send("Eyecore backend running 🚀");
// });

// app.get("/info", requireLogin, async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching users" });
//   }
// });

// app.delete("/info/:id", requireLogin, async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     res.json({ user });
//   } catch (err) {
//     res.status(500).json({ message: "Delete failed" });
//   }
// });

// app.put("/info/:id", requireLogin, async (req, res) => {
//   try {
//     const updated = await User.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ message: "Update failed" });
//   }
// });


// app.use("/products", productRoutes);
// app.use("/reviews", reviewRoutes);
// app.use('/api/orders', orderRoutes);
// app.use("/api/payment", paymentRoutes);



// // const PORT = process.env.PORT || 5000;

// // app.listen(PORT, () => {
// //   console.log("Server running on port", PORT);
// // });

// const PORT = process.env.PORT || 5000;



// module.exports = app;
const express = require("express");
const cors = require("cors");
const connectDB = require("../lib/db");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Eyecore backend running 🚀");
});

module.exports = app;
