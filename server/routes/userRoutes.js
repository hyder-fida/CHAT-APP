const { register, login, setavatar } = require("../controllers/usersController");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/setavatar/:id",setavatar);

module.exports = router;