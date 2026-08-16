
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: { type: String }, // ✅ for auth refresh

  chats: [
    {
      title: { type: String, default: "New Chat" }, // ✅ placeholder
      messages: [
        {
          question: { type: String, required: true },
          answer: { type: String, required: true },
        },
      ],
    },
  ],

}, { timestamps: true });

// ✅ Auto-generate title after first question if it's "New Chat"
userSchema.pre("save", function (next) {
  this.chats.forEach((chat) => {
    if (
      (!chat.title || chat.title.trim() === "" || chat.title === "New Chat") &&
      chat.messages.length > 0
    ) {
      const question = chat.messages[0].question;
      chat.title =
        question.split(" ").slice(0, 5).join(" ") +
        (question.split(" ").length > 5 ? "..." : "");
    }
  });
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
