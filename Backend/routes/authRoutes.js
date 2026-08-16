

const express = require("express");
const { registerUser, loginUser, refreshToken, logoutUser } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/logout", authMiddleware, logoutUser);

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
  });
});

module.exports = router;
