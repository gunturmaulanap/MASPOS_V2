const express = require("express");
const router = express.Router();
const CategoryController = require("../app/controllers/CategoryController");
const verifyToken = require("../middleware/verifyToken");
const {
  validateCreateCategory,
  validateUpdateCategory,
  validateCategoryId,
} = require("../app/validators/category.validator");

router.get("/all", verifyToken, CategoryController.getAllCategories);

router.get(
  "/:id",
  verifyToken,
  validateCategoryId,
  CategoryController.getCategoryById
);

router.post(
  "/create",
  verifyToken,
  validateCreateCategory,
  CategoryController.createCategory
);

router.put(
  "/:id",
  verifyToken,
  validateUpdateCategory,
  CategoryController.updateCategory
);

router.delete(
  "/:id",
  verifyToken,
  validateCategoryId,
  CategoryController.deleteCategory
);

module.exports = router;
