


// // web/geminiWebsite.js
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// require("dotenv").config();

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// function buildWebsiteInstruction(userPrompt) {
//   return `
// You are an assistant that RETURNS ONLY A JSON OBJECT (no extra text).
// Return valid JSON with exactly three keys: "html", "css", and "js".
// Each value should be complete source code (strings). No markdown, no backticks, no explanation — only raw JSON.

// User Request:
// ${JSON.stringify(userPrompt)}
//   `;
// }

// async function generateWebsite(userPrompt) {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
// console.log("result");
//     const result = await model.generateContent(buildWebsiteInstruction(userPrompt));
//     console.log(result);
//       console.log("rawText");
//     const rawText = await result.response.text();
//       console.log(rawText);

//     // Try parsing JSON directly
//     try {
//       const parsed = JSON.parse(rawText);
//       return parsed; // expected: { html: "...", css: "...", js: "..." }
//     } catch (e) {
//       // fallback: try to extract JSON from inside code fences or plain text
//       const jsonMatch = rawText.match(/\{[\s\S]*\}/);
//       if (jsonMatch) {
//         try {
//           return JSON.parse(jsonMatch[0]);
//         } catch (e2) {
//           // unable to parse JSON: return raw text in html key
//           return { html: rawText, css: "", js: "" };
//         }
//       }
//       // If no JSON at all, return html as rawText
//       return { html: rawText, css: "", js: "" };
//     }
//   } catch (err) {
//     console.error("🚨 Gemini Website Error:", err);
//     throw err;
//   }
// }

// module.exports = { generateWebsite };
