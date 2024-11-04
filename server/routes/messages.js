const { addMessage, getMessages } = require("../controllers/messageController");
const express = require("express");
const { check } = require("express-validator"); // For validation
const router = express.Router();

// Validation middleware
const validateMessage = [
    check("from").notEmpty().withMessage("Sender ID is required."),
    check("to").notEmpty().withMessage("Receiver ID is required."),
    check("message").notEmpty().withMessage("Message content is required."),
];

// Routes
router.post("/addmsg", validateMessage, addMessage); // Apply validation for adding a message
router.post("/getmsg", getMessages); // Optionally, you can add validation here too

module.exports = router;
