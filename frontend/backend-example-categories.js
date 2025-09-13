// Contoh implementasi backend untuk categories dan products
// File: routes/categories.js

const express = require("express");
const router = express.Router();

// Dummy data storage (gunakan database di production)
let categories = [
  { id: 1, name: "Makanan" },
  { id: 2, name: "Minuman" },
  { id: 3, name: "Snack" },
  { id: 4, name: "Dessert" },
];

// GET /categories - List all categories
router.get("/", (req, res) => {
  res.json({
    status: "success",
    data: categories,
  });
});

// POST /categories - Create new category
router.post("/", (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      status: "error",
      message: "Name is required",
    });
  }

  const newId = Math.max(...categories.map((c) => c.id), 0) + 1;
  const newCategory = { id: newId, name };
  categories.push(newCategory);

  res.status(201).json({
    status: "success",
    data: newCategory,
  });
});

// PUT /categories/:id - Update category
router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;

  const categoryIndex = categories.findIndex((c) => c.id === id);
  if (categoryIndex === -1) {
    return res.status(404).json({
      status: "error",
      message: "Category not found",
    });
  }

  categories[categoryIndex].name = name;

  res.json({
    status: "success",
    data: categories[categoryIndex],
  });
});

// DELETE /categories/:id - Delete category
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const categoryIndex = categories.findIndex((c) => c.id === id);
  if (categoryIndex === -1) {
    return res.status(404).json({
      status: "error",
      message: "Category not found",
    });
  }

  const deletedCategory = categories.splice(categoryIndex, 1)[0];

  res.json({
    status: "success",
    data: deletedCategory,
  });
});

module.exports = router;
