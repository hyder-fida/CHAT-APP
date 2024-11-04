const {
  login,
  register,
  getAllUsers,
  setAvatar,
  logOut,
} = require("../controllers/userController");

const router = require("express").Router();

// Route for user login
router.post("/login", login);

// Route for user registration
router.post("/register", register);

// Route to get all users except the one with the provided ID
router.get("/users/:id", getAllUsers); // Changed to plural 'users'

// Route to set the avatar for a user
router.post("/avatar/:id", setAvatar); // Changed to a more concise endpoint

// Route to log out a user
router.get("/logout/:id", logOut);

// Export the router
module.exports = router;
