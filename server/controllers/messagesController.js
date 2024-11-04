const Messages = require("../models/messageModel");
const { validationResult } = require("express-validator");

module.exports.getMessages = async (req, res, next) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errors.array() });
    }

    const { from, to } = req.body;

    const messages = await Messages.find({
      users: { $all: [from, to] },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => ({
      fromSelf: msg.sender.toString() === from,
      message: msg.message.text,
    }));

    return res.status(200).json({ status: true, messages: projectedMessages });
  } catch (ex) {
    console.error("Error retrieving messages:", ex);
    return res.status(500).json({ status: false, msg: "Internal Server Error." });
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errors.array() });
    }

    const { from, to, message } = req.body;

    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) {
      return res.status(201).json({ status: true, msg: "Message added successfully." });
    } else {
      return res.status(400).json({ status: false, msg: "Failed to add message to the database." });
    }
  } catch (ex) {
    console.error("Error adding message:", ex);
    return res.status(500).json({ status: false, msg: "Internal Server Error." });
  }
};
