const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

module.exports.login = async (req, res, next) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errors.array() });
    }

    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ msg: "Incorrect Username or Password", status: false });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: "Incorrect Username or Password", status: false });
    }

    delete user.password; // Remove password before sending response
    return res.status(200).json({ status: true, user });
  } catch (ex) {
    console.error("Login error:", ex);
    return res.status(500).json({ msg: "Internal Server Error", status: false });
  }
};

module.exports.register = async (req, res, next) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errors.array() });
    }

    const { username, email, password } = req.body;

    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      return res.status(400).json({ msg: "Username already used", status: false });
    }

    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.status(400).json({ msg: "Email already used", status: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    
    delete user.password; // Remove password before sending response
    return res.status(201).json({ status: true, user });
  } catch (ex) {
    console.error("Registration error:", ex);
    return res.status(500).json({ msg: "Internal Server Error", status: false });
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.status(200).json(users);
  } catch (ex) {
    console.error("Error retrieving users:", ex);
    return res.status(500).json({ msg: "Internal Server Error", status: false });
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;

    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );

    if (!userData) {
      return res.status(404).json({ msg: "User not found", status: false });
    }

    return res.status(200).json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    console.error("Error setting avatar:", ex);
    return res.status(500).json({ msg: "Internal Server Error", status: false });
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.status(400).json({ msg: "User id is required " });

    // Assuming onlineUsers is defined and accessible
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    console.error("Error during logout:", ex);
    return res.status(500).json({ msg: "Internal Server Error", status: false });
  }
};
