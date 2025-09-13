const express = require("express");
const router = express.Router();

const AuthController = require("../app/controllers/AuthController");
const AuthValidator = require("../app/validators/auth.validator");
const verifyToken = require("../middleware/verifyToken");

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// Authentication routes dengan validation
router.post("/signup", AuthValidator.register, AuthController.signUp);
router.post("/login", AuthValidator.login, AuthController.login);

// Protected routes (membutuhkan token)
router.post(
  "/change-password",
  verifyToken,
  AuthValidator.changePassword,
  AuthController.changePassword
);
router.post("/logout", verifyToken, AuthController.logout);

module.exports = router;
