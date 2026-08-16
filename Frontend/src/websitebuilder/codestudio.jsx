import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function CodeStudio() {
  const location = useLocation();
  const navigate = useNavigate();
  const answer = location.state?.answer || "";

  const [tab, setTab] = useState("html");
  const [viewMode, setViewMode] = useState("preview");

  // Redirect back if no answer
  useEffect(() => {
    if (!answer) navigate("/website-builder");
  }, [answer]);

  const extractCode = (lang) => {
    const regex = new RegExp("```" + lang + "([\\s\\S]*?)```", "i");
    return answer.match(regex)?.[1]?.trim() || "";
  };

  const previewSrcDoc = useMemo(() => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${extractCode("css")}</style>
      </head>
      <body>
        ${extractCode("html")}
        <script>${extractCode("javascript")}<\/script>
      </body>
    </html>
  `, [answer]);

  const handleExport = async () => {
    const zip = new JSZip();
    const folder = zip.folder("website");
    folder.file("index.html", `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${extractCode("css")}</style>
</head>
<body>
  ${extractCode("html")}
  <script>${extractCode("javascript")}<\/script>
</body>
</html>`);
    folder.file("style.css", extractCode("css"));
    folder.file("script.js", extractCode("javascript"));
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "website.zip");
  };

  if (!answer) return null;

  return (
    <div className="h-screen flex flex-col bg-[#0A0A14] text-white">

      {/* TOP BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-4 sm:px-6 py-3 border-b border-[#1a1a2e]">

        {/* Back + Tabs */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => navigate("/website-builder")}
            className="text-gray-400 hover:text-white text-sm px-3 py-1.5 rounded-lg bg-[#1a1a2e] hover:bg-[#252540] transition"
          >
            ← Back
          </button>

          {["html", "css", "javascript"].map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setViewMode("code"); }}
              className={`px-3 py-1.5 rounded-full text-sm transition ${
                tab === t && viewMode === "code"
                  ? "bg-purple-600 text-white"
                  : "bg-[#1A1A2E] text-gray-400 hover:text-white"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <div className="flex bg-[#1A1A2E] rounded-full p-1">
            {["code", "preview"].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-full text-sm transition ${
                  viewMode === mode
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {mode === "code" ? "💻 Code" : "👁 Preview"}
              </button>
            ))}
          </div>

          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-full bg-green-600 hover:bg-green-500 text-white text-sm transition"
          >
            ⬇ Export
          </button>
        </div>
      </div>

      {/* MAIN VIEW */}
      <div className="flex-1 overflow-hidden">
        {viewMode === "code" ? (
          <div className="h-full overflow-y-auto p-4">
            <SyntaxHighlighter
              language={tab}
              style={materialDark}
              customStyle={{ fontSize: "13px", background: "transparent", margin: 0 }}
            >
              {extractCode(tab) || `/* No ${tab} code generated */`}
            </SyntaxHighlighter>
          </div>
        ) : (
          <iframe
            title="preview"
            className="w-full h-full border-0"
            sandbox="allow-scripts"
            srcDoc={previewSrcDoc}
          />
        )}
      </div>
    </div>
  );
}