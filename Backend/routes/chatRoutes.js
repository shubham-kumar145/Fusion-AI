const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createChat, askQuestion, getChats, getChatById, deleteChat, generateWebsite} = require("../controllers/chatController");

const router = express.Router();

router.post("/new", authMiddleware, createChat);
router.post("/ask", authMiddleware, askQuestion);
router.get("/", authMiddleware, getChats);
router.get("/:chatId", authMiddleware, getChatById);
router.delete("/:chatId", authMiddleware, deleteChat);
router.post("/generate", authMiddleware, generateWebsite);

module.exports = router;
