
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI(
//   process.env.GEMINI_API_KEY
// );

// async function getAIResponse(prompt) {
//   try {
//     let parsed;

//     try {
//       parsed =
//         typeof prompt === "string"
//           ? JSON.parse(prompt)
//           : prompt;
//     } catch {
//       parsed = { messagetext: prompt };
//     }

//     const model = genAI.getGenerativeModel({
//       model: "gemini-2.0-flash-lite",
//     });

//     const result = await model.generateContent(
//       parsed.messagetext
//     );

//     return result.response.text();
//   } catch (err) {
//     console.error("Gemini API Error:", err);

//     if (err.status === 429) {
//       return "⚠️ Gemini quota exceeded.";
//     }

//     if (err.status === 403) {
//       return "⚠️ Gemini access denied.";
//     }

//     return "⚠️ Error generating response.";
//   }
// }

// module.exports = { getAIResponse };

// 🆕 New Gemini Integration using Groq SDK
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function getAIResponse(prompt) {
  try {
    let parsed;

    try {
      parsed =
        typeof prompt === "string"
          ? JSON.parse(prompt)
          : prompt;
    } catch {
      parsed = { messagetext: prompt };
    }

    const userMessage =
      parsed.messagetext || "Hello";

    const completion =
      await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: String(userMessage),
          },
        ],
        model: "llama-3.1-8b-instant",
      });

    return completion.choices[0].message.content;
  } catch (err) {
    console.error("Groq Error:", err);

    return "⚠️ Error generating AI response.";
  }
}

module.exports = { getAIResponse };