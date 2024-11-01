const User = require("../model/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ mesg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ mesg: "Username already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (err) {
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({
        mesg: "incorrect username or password",
        status: false,
      });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({
        mesg: "incorrect username or password",
        status: false,
      });
    delete user.password;
    return res.json({ status: true, user });
  } catch (err) {
    next(err);
  }
};

module.exports.setavatar = async (req, res) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;

    const userData = await User.findOneAndUpdate(
      { _id: userId }, 
      { isAvatarImageSet: true, avatarImage }, 
      { new: true } 
    );

    if (!userData) {
      return res.status(404).json({ msg: 'User not found' });
    }

    return res.json({
      isSet: userData.isAvatarImageSet, // Fixed property name
      image: userData.avatarImage,
    });
  } catch (error) {
    console.error("Error setting avatar:", error); // Log the error for debugging
    return res.status(500).json({ msg: 'Internal server error', error: error.message });
  }
};


module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find ({_id: { $ne: req.params.id }}).select([
      "email",
      "username",
      "avatarImage",
      "_id",

    ]);
     
    return res.json(users);
  } catch (error) {
    next(error);
  }
};
