const {
    login,
    register,
    getAllUsers,
    setAvatar,
    logOut,
} = require("../controllers/userController");

const express = require("express");
const { check } = require("express-validator"); // For validation
const router = express.Router();

// Validation middleware
const validateUser = [
    check("username").isLength({ min: 3 }).withMessage("Username must be at least 3 characters long."),
    check("email").isEmail().withMessage("Must be a valid email."),
    check("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long."),
];

// Routes
router.post("/login", login);
router.post("/register", validateUser, register); // Apply validation
router.get("/allusers/:id", getAllUsers);
router.post("/setavatar/:id", setAvatar);
router.get("/logout/:id", logOut);

module.exports = router;
