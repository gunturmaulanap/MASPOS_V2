const express = require("express");
const router = express.Router();
const ProductController = require("../app/controllers/ProductController");
const { handleUpload } = require("../middleware/upload");
const verifyToken = require("../middleware/verifyToken");
const {
  validateCreateProduct,
  validateUpdateProduct,
  validateProductId,
} = require("../app/validators/product.validator");

router.get("/all", verifyToken, ProductController.getAllProducts);

router.get(
  "/:id",
  verifyToken,
  validateProductId,
  ProductController.getProductById
);

// PROTECTED ROUTES (Token required)
// POST create product with image upload (authenticated users only)
router.post(
  "/create",
  verifyToken,
  handleUpload,
  validateCreateProduct,
  ProductController.createProduct
);

// PUT update product (authenticated users only)
router.put(
  "/:id",
  verifyToken,
  handleUpload,
  validateUpdateProduct,
  ProductController.updateProduct
);

// DELETE product (authenticated users only)
router.delete(
  "/:id",
  verifyToken,
  validateProductId,
  ProductController.deleteProduct
);

// POST upload image only (authenticated users only)
router.post(
  "/upload",
  verifyToken,
  handleUpload,
  ProductController.uploadImage
);

module.exports = router;
