// const express = require("express");
// const app = express();
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");  
// const bcrypt = require('bcrypt');
// const cors = require('cors');
// var jwt = require('jsonwebtoken');
// const auth = require("./middleware/auth");  
// const multer = require('multer');
// const sessionStorage = require('sessionstorage-for-nodejs');
// const session = require('express-session');
// const upload = require("./middleware/upload");
// const path = require("path")

// app.use(cors({
//  origin: ["http://localhost:3000", "http://localhost:3001"],
//   credentials: true
// }));

// app.use(session({
//     secret: 'your_super_secret_key',
//     resave: false, 
//     saveUninitialized: true,
//     cookie: { secure: false,
//         httpOnly: true
//     }
// }));
// mongoose.connect('mongodb://localhost:27017/mydb')
//     .then(() => console.log("mongodb is connected"))
//     .catch(() => console.log(err));

// const userschema = new mongoose.Schema(
//     {
//         name: String,
//         email: String,
//         phone: String,
//         password: String
//     }
// );

// const User = mongoose.model('User', userschema);
// // ------------------------------------------------------------------

// const productSchema = new mongoose.Schema(
//   {
//   productId: {
//     type: String,
//     required: true,
//     unique: true,   
//   },

//     name: String,
//     price: Number,
//     discountPrice: Number,
//     brand: String,
//     category: String,
//     description: String,
//     image: String,
//   }
// );

// const Product = mongoose.model("Product", productSchema);

// // ------------------------------------------------------------------
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.post("/register", async (req, res) => {
//   const { name, email, phone, password } = req.body;

//   if (!name || !email || !password) {
//     return res.status(400).json({
//       message: "All fields are required",
//     });
//   }

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         message: "Email already exists",
//       });
//     }

//     bcrypt.hash(password, 10, async (err, hashedPassword) => {
//       if (err) {
//         return res.status(500).json({
//           message: "Error hashing password",
//         });
//       }

//       const newUser = new User({
//         name,
//         email,
//         phone,
//         password: hashedPassword,
//       });

//       await newUser.save();

//       res.status(201).json({
//         message: "User registered successfully",
//       });
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Registration failed",
//     });
//   }
// });
// // auth
// app.post('/login', async (req, res) => {
//     const { email,  password } = req.body;
//     try {
//         const getuser = await User.findOne({ email });
//         if (getuser) {
//             bcrypt.compare(password, getuser.password, function (err, result) {
//                 if (result == true) {
//                     req.session.isLoggedIn = true;
//                     req.session.userId = getuser._id;
//                     console.log("ses",req.session)
//                     // const token = jwt.sign(
//                     //     {data: getuser}, 
//                     //     'abc', { expiresIn: 60 * 60 });

//                     // const data = {
//                     //     getuser,
//                     //     token,
//                     //     msg:"Login successful"
//                     // }

//                     // res.status(200).send(data);
//                     res.status(200).send("login successful");
//                 } else {
//                     res.status(401).send('wrong password');
//                 }
//             })
//         } else {
//             res.status(404).send('User not found');
//         }
    

//     } catch (error) {
//         res.status(500).send('Error logging in');
//     }
// });

// function requireLogin(req, res, next) {
//   if (req.session && req.session.isLoggedIn) {
//     next();
//   } else {
//     res.status(401).json({message : "Unauthorized"});
//   }
// }


// app.get('/info',requireLogin, async (req, res) => {
//     try {
//         const users = await User.find();
//         res.json(users);
//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Error fetching data");
//     }
// });

// app.delete('/info/:_id', requireLogin, async (req, res) => {
//     const id = req.params._id;
//     const getuser = await User.findByIdAndDelete({ _id: id });
//     if (getuser) {
//         const data = {
//             user: getuser,
//             msg: "data deleted successfully"
//         }
//         // res.status(200).send(data)
//         res.status(200).send(data)
//     }
//     else {
//         res.status(500).send('failed to delete data')
//     }

// });
// app.put("/info/:_id",requireLogin, async (req, res) => {
//     const id = req.params._id;

//     try {
//         const updated = await User.findByIdAndUpdate(id, req.body, { new: true });
//         if (!updated) {
//             return res.status(404).send("record not found");
//         }
//         res.status(200).json(updated);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("fail to update");
//     }
// });
// // ----------------------------product--------------------------------------------------
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// app.post("/products", upload.single("image"), async (req, res) => {
//   try {
//     const product = new Product({
//       productId: req.body.productId,
//       name: req.body.name,
//       price: req.body.price,
//       discountPrice: req.body.discountPrice,
//       brand: req.body.brand,
//       category: req.body.category,
//       description: req.body.description,
//       image: req.file ? `uploads/${req.file.filename}` : "",
//     });

//     await product.save();
//     res.status(201).json(product);
//   } 
//    catch (err) {
//      if (err.code === 11000) {
//      return res.status(400).json({
//       message: "This Product ID already exists"
//     });
//   }
//     res.status(500).json({ message: "Failed to add product" });
//   }
// });


// app.get("/products",  async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.status(200).json(products);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch products" });
//   }
// });

// app.get("/products/:id",  async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     res.json(product);
//   } catch (err) {
//     res.status(404).json({ message: "Product not found" });
//   }
// });

// app.put("/products/:id", async (req, res) => {
//   try {
//     const updated = await Product.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ message: "Update failed" });
//   }
// });
// app.delete("/products/:id",  async (req, res) => {
//   try {
//     await Product.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "Product deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Delete failed" });
//   }
// });
// // ------------------------------------------------------------------------------
// app.listen(5000, () => {
//     console.log('server is running on localhost:5000')
// });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const path = require("path");
require("dotenv").config();


const paymentRoutes = require("./routes/paymentRoutes");
const productRoutes = require("./routes/productRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const authRoutes = require("./routes/authRoutes");
const User = require("./models/User");
const orderRoutes = require('./routes/orderRoutes');
const app = express();
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "super_secret_key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,   
    httpOnly: true
  }
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


mongoose.connect("mongodb://127.0.0.1:27017/mydb")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ Mongo error:", err));

app.use("/", authRoutes);


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
app.use('/api/orders', orderRoutes);
app.use("/api/payment", paymentRoutes);



app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
