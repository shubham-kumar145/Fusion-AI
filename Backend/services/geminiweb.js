


// const { GoogleGenerativeAI } = require("@google/generative-ai");
// require("dotenv").config();

// // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const genAI = new GoogleGenerativeAI("AIzaSyD1DiulfL6iyHMbPmtCWRwANknxAka_KdE");

// async function getAIResponse(prompt) {
//   try {
//     let parsed = typeof prompt === "string" ? JSON.parse(prompt) : prompt;

//     const aiIntialInstruction = `
//     You are an expert senior full-stack web developer AI.

// Your ONLY job is to generate complete, production-ready website code.

// ### OUTPUT RULES (VERY IMPORTANT)
// 1. Always return **HTML, CSS, and JavaScript in SEPARATE SECTIONS**:
//    - <html_code> ... </html_code>
//    - <css_code> ... </css_code>
//    - <js_code> ... </js_code>

// 2. DO NOT include explanations, comments, notes, markdown, or descriptions.
//    Your response must ONLY contain raw code snippets.

// 3. The website must be:
//    - fully responsive
//    - mobile-friendly
//    - modern UI
//    - clean layout
//    - professional styling
//    - production-ready

// 4. Use:
//    - HTML
//    - CSS 
//    - JavaScript 

// 5. Include necessary components depending on project:
//    - navbar
//    - hero section
//    - product cards
//    - categories
//    - footer
//    - login/signup UI
//    - cart page (if e-commerce)
//    - multiple sections for large websites

// 6. NEVER output incomplete code.
// 7. ALWAYS close all tags, braces, and functions.

// ### USER REQUEST:
// Generate a full frontend website based on the following requirement:

// "{{USER_MESSAGE_HERE}}"

// Return only the three sections: html_code, css_code, js_code.

//     `;

//     const finalPrompt = `${aiIntialInstruction}\n\nUser request: ${parsed.messagetext}`;

//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
//     const result = await model.generateContent(finalPrompt);

//     return result.response.text();
//   } catch (err) {
//     console.error("Gemini API Error:", err);
//     return "⚠️ Error : Unable to fetch response from Gemini API.";
//   }
// }
