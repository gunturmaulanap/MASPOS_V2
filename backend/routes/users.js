const express = require("express");
const router = express.Router();
const UserController = require("../app/controllers/UserController");
const UserValidator = require("../app/validators/user.validator");
const verifyToken = require("../middleware/verifyToken");

// ALL USER ROUTES ARE PROTECTED (require authentication)
// Users should only manage their own data when logged in

// GET /users/profile - Get current user profile (token required)
router.get("/profile", verifyToken, UserController.getProfile);

// PUT /users/profile - Update current user profile (token required)
router.put(
  "/profile",
  verifyToken,
  UserValidator.updateProfile,
  UserController.updateProfile
);

// GET /users - Admin only: Get all users (token + admin role required)
router.get("/all", verifyToken, UserController.getAllUsers);

// POST /users - Admin only: Create new user (token + admin role required)
router.post(
  "/create",
  verifyToken,
  UserValidator.createUser,
  UserController.createUser
);

// GET /users/:id - Admin only: Get user by ID (token + admin role required)
router.get(
  "/:id",
  verifyToken,
  UserValidator.getUserById,
  UserController.getUserById
);

// PUT /users/:id - Admin only: Update any user (token + admin role required)
router.put(
  "/:id",
  verifyToken,
  UserValidator.updateUser,
  UserController.updateUser
);

// DELETE /users/:id - Admin only: Delete user (token + admin role required)
router.delete(
  "/:id",
  verifyToken,
  UserValidator.deleteUser,
  UserController.deleteUser
);

module.exports = router;
