
// import { useEffect, useState, useMemo } from "react";
// import { useParams } from "react-router-dom";
// import axiosClient from "../utils/axioClient";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
// import JSZip from "jszip";
// import { saveAs } from "file-saver";
// import axios from "axios";

// export default function CodeStudio() {
//   const { chatId } = useParams();

//   const [chat, setChat] = useState(null);
//   const [tab, setTab] = useState("html");
//   const [viewMode, setViewMode] = useState("code");

//   useEffect(() => {
//     fetchChat();
//   }, []);

//   const fetchChat = async () => {
//     const res = await axiosClient.get("/chats");
//     const found = res.data.find(c => c._id === chatId);
//     setChat(found);
//   };

//   const extractCode = (lang) => {
//     if (!chat) return "";
//     const lastMsg = chat.messages[chat.messages.length - 1];
//     const regex = new RegExp("```" + lang + "([\\s\\S]*?)```", "i");
//     return lastMsg.answer.match(regex)?.[1] || "";
//   };

//   const previewSrcDoc = useMemo(() => {
//     if (!chat) return "";
//     return `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <style>${extractCode("css")}</style>
//         </head>
//         <body>
//           ${extractCode("html")}
//           <script>${extractCode("javascript")}<\/script>
//         </body>
//       </html>
//     `;
//   }, [chat]);

//   // Export code as zip
//   const handleExport = async () => {
//     if (!chat) return;

//     const htmlCode = extractCode("html");
//     const cssCode = extractCode("css");
//     const jsCode = extractCode("javascript");

//     const zip = new JSZip();
//     const folder = zip.folder("website");
//     folder.file("index.html", htmlCode);
//     folder.file("style.css", cssCode);
//     folder.file("script.js", jsCode);

//     const content = await zip.generateAsync({ type: "blob" });
//     saveAs(content, "website.zip");
//   };

//   // Deploy code to Vercel
//   const handleDeploy = async () => {
//     if (!chat) return;

//     const htmlCode = extractCode("html");
//     const cssCode = extractCode("css");
//     const jsCode = extractCode("javascript");

//     const formData = new FormData();
//     formData.append("project-name", "ai-website-" + Date.now());

//     const files = [
//       { file: "index.html", content: htmlCode },
//       { file: "style.css", content: cssCode },
//       { file: "script.js", content: jsCode },
//     ];

//     files.forEach(f =>
//       formData.append("files", new Blob([f.content]), f.file)
//     );

//     try {
//       const res = await axios.post(
//         "https://api.vercel.com/v13/deployments",
//         formData,
//         {
//           headers: {
//             Authorization: `b34GATjZrEa3idewGaHXvp3R`, // <--- Replace with your actual token
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       alert("Deployment started! URL: " + res.data.url);
//     } catch (err) {
//       console.error(err);
//       alert("Deployment failed! Check console for details.");
//     }
//   };

//   if (!chat) {
//     return (
//       <div className="h-screen flex items-center justify-center text-white">
//         Loading Code Studio...
//       </div>
//     );
//   }

//   const lastMsg = chat.messages[chat.messages.length - 1];

//   return (
//     <div className="h-screen flex flex-col md:flex-row bg-[#0A0A14] text-white">

//       {/* RIGHT PANEL */}
//       <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 mx-auto w-full max-w-[1600px]">

//         {/* TOP BAR */}
//         <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2 sm:gap-0 items-start sm:items-center">

//           {/* Language Tabs */}
//           <div className="flex flex-wrap gap-2 sm:gap-3">
//             {["html", "css", "javascript"].map(t => (
//               <button
//                 key={t}
//                 onClick={() => setTab(t)}
//                 className={`px-3 sm:px-4 py-2 rounded-full text-sm sm:text-md
//                   ${tab === t
//                     ? "bg-purple-600 text-white"
//                     : "bg-[#1A1A2E] text-gray-400"
//                   }`}
//               >
//                 {t.toUpperCase()}
//               </button>
//             ))}
//           </div>

//           {/* Code / Preview Toggle + Export + Deploy */}
//           <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">

//             <div className="flex bg-[#1A1A2E] rounded-full p-1">
//               {["code", "preview"].map(mode => (
//                 <button
//                   key={mode}
//                   onClick={() => setViewMode(mode)}
//                   className={`px-3 sm:px-4 py-2 rounded-full text-sm sm:text-md
//                     ${viewMode === mode
//                       ? "bg-purple-600 text-white"
//                       : "text-gray-400"
//                     }`}
//                 >
//                   {mode.toUpperCase()}
//                 </button>
//               ))}
//             </div>

//             <button
//               onClick={handleExport}
//               className="px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-500 transition text-sm sm:text-md"
//             >
//               Export
//             </button>

//             <button
//               onClick={handleDeploy}
//               className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-500 transition text-sm sm:text-md"
//             >
//               Deploy
//             </button>

//           </div>

//         </div>

//         {/* MAIN VIEW */}
//         <div className="flex-1 bg-[#0f0f1f] rounded-xl border border-[#2a2a40] overflow-hidden">
//           {viewMode === "code" ? (
//             <div className="h-full overflow-y-auto p-3 sm:p-4 code-scroll">
//               <SyntaxHighlighter
//                 language={tab}
//                 style={materialDark}
//                 customStyle={{ fontSize: "13px" }}
//               >
//                 {extractCode(tab)}
//               </SyntaxHighlighter>
//             </div>
//           ) : (
//             <iframe
//               title="preview"
//               className="w-full h-full"
//               sandbox="allow-scripts"
//               srcDoc={previewSrcDoc}
//             />
//           )}
//         </div>

//       </div>
//     </div>
//   );
// }
