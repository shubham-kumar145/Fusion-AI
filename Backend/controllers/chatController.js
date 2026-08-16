

const User = require("../models/User");
const { getAIResponse } = require("../services/gemini");

// Create new chat
exports.createChat = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const newChat = {
      title: req.body.title,
      messages: [],
    };

    user.chats.push(newChat);
    await user.save();

    res.status(201).json(user.chats[user.chats.length - 1]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ask question
exports.askQuestion = async (req, res) => {
  try {
    const { chatId, question } = req.body;
    const user = await User.findById(req.user._id);

    const chat = user.chats.id(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    // ✅ Use the service function
    const answer = await getAIResponse({ messagetext: question });

    const message = { question, answer };
    chat.messages.push(message);

    await user.save();

    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all chats
exports.getChats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single chat
exports.getChatById = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const chat = user.chats.id(req.params.chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete chat
exports.deleteChat = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const chat = user.chats.id(req.params.chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    chat.remove();
    await user.save();

    res.json({ message: "Chat deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



exports.generateWebsite = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const fullPrompt = `You are an expert web developer. Generate a complete, beautiful, modern website based on this description: "${prompt}".

STRICT RULES:
- Return ONLY code blocks, nothing else
- Use exactly these 3 code blocks:

\`\`\`html
<!-- your HTML here (body content only, no <html>/<head>/<body> tags) -->
\`\`\`

\`\`\`css
/* your CSS here */
\`\`\`

\`\`\`javascript
// your JS here
\`\`\`

- Make it visually stunning with modern design
- Use CSS animations and gradients
- Make it fully responsive
- No external libraries, pure HTML/CSS/JS only
- No explanations, no extra text — ONLY the 3 code blocks`;

    // ✅ Use the already-imported getAIResponse from top of file
    const answer = await getAIResponse({ messagetext: fullPrompt });

    return res.json({ answer });

  } catch (err) {
    console.error("generateWebsite error:", err);
    return res.status(500).json({ error: "Failed to generate website" });
  }
};