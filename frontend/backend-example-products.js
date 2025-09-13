// Contoh implementasi backend untuk products
// File: routes/products.js

const express = require("express");
const multer = require("multer"); // Untuk file upload
const router = express.Router();

// Setup multer untuk file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Dummy data storage
let products = [
  {
    id: 1,
    name: "Nasi Goreng Spesial",
    price: 25000,
    categoryId: 1,
    img: "/uploads/nasi-goreng.jpg",
  },
  {
    id: 2,
    name: "Es Teh Manis",
    price: 8000,
    categoryId: 2,
    img: "/uploads/es-teh.jpg",
  },
];

// GET /products - List all products
router.get("/", (req, res) => {
  res.json({
    status: "success",
    data: products,
  });
});

// POST /products - Create new product
router.post("/", upload.single("img"), (req, res) => {
  const { name, price, categoryId } = req.body;

  // Validation
  if (!name || !price || !categoryId) {
    return res.status(400).json({
      status: "error",
      message: "Name, price, and categoryId are required",
    });
  }

  const newId = Math.max(...products.map((p) => p.id), 0) + 1;
  const newProduct = {
    id: newId,
    name,
    price: parseInt(price),
    categoryId: parseInt(categoryId),
    img: req.file ? `/uploads/${req.file.filename}` : "/placeholder.jpg",
  };

  products.push(newProduct);

  res.status(201).json({
    status: "success",
    data: newProduct,
  });
});

// PUT /products/:id - Update product
router.put("/:id", upload.single("img"), (req, res) => {
  const id = parseInt(req.params.id);
  const { name, price, categoryId } = req.body;

  const productIndex = products.findIndex((p) => p.id === id);
  if (productIndex === -1) {
    return res.status(404).json({
      status: "error",
      message: "Product not found",
    });
  }

  // Update fields
  if (name) products[productIndex].name = name;
  if (price) products[productIndex].price = parseInt(price);
  if (categoryId) products[productIndex].categoryId = parseInt(categoryId);
  if (req.file) products[productIndex].img = `/uploads/${req.file.filename}`;

  res.json({
    status: "success",
    data: products[productIndex],
  });
});

// DELETE /products/:id - Delete product
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const productIndex = products.findIndex((p) => p.id === id);
  if (productIndex === -1) {
    return res.status(404).json({
      status: "error",
      message: "Product not found",
    });
  }

  const deletedProduct = products.splice(productIndex, 1)[0];

  res.json({
    status: "success",
    data: deletedProduct,
  });
});

module.exports = router;
