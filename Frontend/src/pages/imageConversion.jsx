

import { useState, useRef, useEffect } from "react";

const FORMATS = ["jpg", "jpeg", "png", "webp", "avif"];

const FEATURES = [
  { icon: "ti-bolt", title: "Fast Conversion", desc: "Convert images instantly in your browser — no upload wait." },
  { icon: "ti-shield-lock", title: "Secure & Private", desc: "Images never leave your device. Zero server processing." },
  { icon: "ti-device-desktop", title: "No Install Needed", desc: "Runs entirely in-browser. Nothing to download." },
  { icon: "ti-adjustments", title: "Optimized Output", desc: "Canvas-powered encoding with preserved quality." },
  { icon: "ti-rocket", title: "Multi-Format", desc: "JPG, JPEG, PNG, WEBP, and AVIF — all supported." },
];

const TYPED_STRINGS = [
  "To Your Desired Format",
  "To JPG, PNG, WEBP, AVIF",
  "Fast & Secure Conversion",
  "100% In-Browser",
];

function useTyped(strings, speed = 70) {
  const [text, setText] = useState("");
  const [cursor, setCursor] = useState(true);
  const state = useRef({ si: 0, ci: 0, deleting: false, pause: 0 });

  useEffect(() => {
    const blink = setInterval(() => setCursor(c => !c), 530);
    return () => clearInterval(blink);
  }, []);

  useEffect(() => {
    const s = state.current;
    let timeout;

    function tick() {
      const current = strings[s.si];
      if (s.pause > 0) {
        s.pause -= 1;
        timeout = setTimeout(tick, speed);
        return;
      }
      if (!s.deleting) {
        if (s.ci < current.length) {
          s.ci++;
          setText(current.slice(0, s.ci));
          timeout = setTimeout(tick, speed);
        } else {
          s.pause = 28;
          s.deleting = true;
          timeout = setTimeout(tick, speed);
        }
      } else {
        if (s.ci > 0) {
          s.ci--;
          setText(current.slice(0, s.ci));
          timeout = setTimeout(tick, speed * 0.6);
        } else {
          s.deleting = false;
          s.si = (s.si + 1) % strings.length;
          timeout = setTimeout(tick, speed);
        }
      }
    }
    timeout = setTimeout(tick, speed);
    return () => clearTimeout(timeout);
  }, []);

  return { text, cursor };
}

function Toast({ toast }) {
  if (!toast) return null;
  const colors = {
    success: { bg: "#22c55e", text: "#fff" },
    error: { bg: "#ef4444", text: "#fff" },
    info: { bg: "#8b5cf6", text: "#fff" },
  };
  const c = colors[toast.kind] || colors.info;
  return (
    <div style={{
      position: "fixed", top: 24, right: 24, zIndex: 9999,
      background: c.bg, color: c.text,
      padding: "12px 20px", borderRadius: 10, fontWeight: 500,
      fontSize: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
      animation: "slideIn 0.3s ease",
      display: "flex", alignItems: "center", gap: 8,
    }}>
      <i className={`ti ${toast.kind === "success" ? "ti-circle-check" : toast.kind === "error" ? "ti-circle-x" : "ti-info-circle"}`} style={{ fontSize: 18 }} />
      {toast.message}
    </div>
  );
}

export default function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [format, setFormat] = useState("png");
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState("");
  const [resultBlob, setResultBlob] = useState(null);
  const [toast, setToast] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [originalSize, setOriginalSize] = useState(null);
  const [convertedSize, setConvertedSize] = useState(null);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const { text: typedText, cursor } = useTyped(TYPED_STRINGS);

  function showToast(message, kind = "info") {
    setToast({ message, kind });
    setTimeout(() => setToast(null), 3500);
  }

  function formatBytes(bytes) {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  function onFileSelect(f) {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      showToast("Please select a valid image file", "error");
      return;
    }
    setFile(f);
    setOriginalSize(f.size);
    setResultUrl("");
    setResultBlob(null);
    setConvertedSize(null);
    const url = URL.createObjectURL(f);
    setPreview(url);
    showToast("Image loaded successfully", "success");
  }

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onFileSelect(f);
  }

  function convertImage() {
    if (!file) {
      showToast("Please choose an image first", "error");
      return;
    }
    setConverting(true);
    setProgress(0);
    setResultUrl("");
    setResultBlob(null);

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const steps = 8;
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setProgress(Math.min(Math.round((step / steps) * 85), 85));
        if (step >= steps) clearInterval(interval);
      }, 60);

      setTimeout(() => {
        const canvas = canvasRef.current;
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (format === "jpg" || format === "jpeg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);

        const mimeMap = {
          jpg: "image/jpeg",
          jpeg: "image/jpeg",
          png: "image/png",
          webp: "image/webp",
          avif: "image/avif",
        };
        const mime = mimeMap[format] || "image/png";

        canvas.toBlob(
          (blob) => {
            clearInterval(interval);
            if (!blob) {
              setProgress(0);
              setConverting(false);
              URL.revokeObjectURL(objectUrl);
              showToast(`${format.toUpperCase()} not supported in this browser. Try PNG or JPG.`, "error");
              return;
            }
            const url = URL.createObjectURL(blob);
            setResultBlob(blob);
            setResultUrl(url);
            setConvertedSize(blob.size);
            setProgress(100);
            setConverting(false);
            URL.revokeObjectURL(objectUrl);
            showToast("Converted successfully!", "success");
          },
          mime,
          0.92
        );
      }, 520);
    };
    img.onerror = () => {
      showToast("Failed to load image", "error");
      setConverting(false);
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  }

  function downloadResult() {
    if (!resultBlob && !resultUrl) return showToast("Convert an image first", "error");
    const a = document.createElement("a");
    a.href = resultUrl || preview;
    a.download = `converted_image.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast("Download started!", "success");
  }

  function clearAll() {
    setFile(null);
    setPreview(null);
    setResultUrl("");
    setResultBlob(null);
    setProgress(0);
    setOriginalSize(null);
    setConvertedSize(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    showToast("Cleared", "info");
  }

  const savings = originalSize && convertedSize
    ? Math.round(((originalSize - convertedSize) / originalSize) * 100)
    : null;

  return (
    <div style={{ background: "#0a0614", minHeight: "100vh", color: "#e2d9f3", fontFamily: "'Sora', 'Segoe UI', sans-serif", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        @keyframes slideIn { from { transform: translateY(-12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #4c1d95; border-radius: 4px; }
        select, button { font-family: inherit; }
        .drop-zone { transition: all 0.2s; }
        .drop-zone:hover { border-color: #8b5cf6 !important; background: rgba(139,92,246,0.06) !important; }
        .convert-btn:hover:not(:disabled) { background: #7c3aed !important; transform: translateY(-1px); }
        .convert-btn:active:not(:disabled) { transform: translateY(0); }
        .convert-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .format-btn { cursor: pointer; transition: all 0.15s; border: 1.5px solid transparent; }
        .format-btn:hover { border-color: #8b5cf6 !important; }
        .feat-card:hover { transform: translateY(-4px); background: rgba(139,92,246,0.12) !important; }
        .feat-card { transition: all 0.25s; }
        .action-btn:hover { background: rgba(139,92,246,0.2) !important; }
        .action-btn { transition: all 0.15s; cursor: pointer; }
      `}</style>

      {/* Navbar */}
      <nav style={{ background: "rgba(15,8,32,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(139,92,246,0.2)", position: "sticky", top: 0, zIndex: 100, padding: "0 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#8b5cf6,#ec4899)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className="ti ti-photo-scan" style={{ fontSize: 18, color: "#fff" }} />
            </div>
            <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: "-0.3px", color: "#e2d9f3" }}>ImgConvert</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["About", "Services", "FAQ"].map(l => (
              <button key={l} style={{ background: "none", border: "none", color: "#a78bfa", cursor: "pointer", fontSize: 14, padding: "6px 12px", borderRadius: 6, transition: "all 0.15s" }}
                onMouseEnter={e => e.target.style.background = "rgba(139,92,246,0.15)"}
                onMouseLeave={e => e.target.style.background = "none"}
              >{l}</button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main */}
      <main style={{ flex: 1, maxWidth: 1200, margin: "0 auto", width: "100%", padding: "40px 20px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 48, alignItems: "flex-start" }}>

          {/* Hero */}
          <div style={{ flex: "1 1 280px", animation: "fadeUp 0.6s ease both" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", borderRadius: 20, padding: "4px 12px", marginBottom: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 12, color: "#a78bfa", fontWeight: 500 }}>100% Browser-Based</span>
            </div>
            <h1 style={{ fontSize: "clamp(28px, 5vw, 46px)", fontWeight: 700, lineHeight: 1.2, margin: "0 0 16px", letterSpacing: "-0.5px", color: "#f3eeff" }}>
              Convert Your Image<br />
              <span style={{ background: "linear-gradient(90deg,#a78bfa,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", minHeight: "1.2em", display: "inline-block" }}>
                {typedText}<span style={{ opacity: cursor ? 1 : 0, color: "#a78bfa", WebkitTextFillColor: "#a78bfa" }}>|</span>
              </span>
            </h1>
            <p style={{ color: "#9d8fc0", fontSize: 15, lineHeight: 1.7, maxWidth: 380, margin: "0 0 28px" }}>
              Convert images between JPG, PNG, WEBP, and AVIF formats instantly — all processing happens in your browser. No server, no uploads, no privacy risks.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {["No Sign-up", "Zero Server", "Lossless Quality"].map(t => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, color: "#c4b5fd", fontSize: 13 }}>
                  <i className="ti ti-check" style={{ fontSize: 15, color: "#22c55e" }} />{t}
                </div>
              ))}
            </div>
          </div>

          {/* Converter Card */}
          <div style={{ flex: "1 1 480px", background: "#120c24", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 20, padding: 24, animation: "fadeUp 0.6s 0.1s ease both", opacity: 0, animationFillMode: "forwards" }}>

            {/* Format selector */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#7c6fa0", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Output Format</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {FORMATS.map(f => (
                  <button key={f} className="format-btn" onClick={() => setFormat(f)}
                    style={{
                      background: format === f ? "rgba(139,92,246,0.25)" : "rgba(255,255,255,0.04)",
                      border: format === f ? "1.5px solid #8b5cf6" : "1.5px solid rgba(139,92,246,0.2)",
                      color: format === f ? "#c4b5fd" : "#9d8fc0",
                      borderRadius: 8, padding: "6px 14px", fontSize: 13, fontWeight: format === f ? 600 : 400,
                    }}>
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Two-panel layout */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>

              {/* Upload panel */}
              <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: 12 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#7c6fa0", textTransform: "uppercase", letterSpacing: 1, margin: 0 }}>Original Image</p>
                <div
                  className="drop-zone"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={onDrop}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  style={{
                    border: `2px dashed ${dragOver ? "#8b5cf6" : "rgba(139,92,246,0.3)"}`,
                    borderRadius: 12,
                    height: 190,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", overflow: "hidden", position: "relative",
                    background: dragOver ? "rgba(139,92,246,0.08)" : "rgba(255,255,255,0.02)",
                  }}>
                  {preview ? (
                    <img src={preview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  ) : (
                    <div style={{ textAlign: "center", padding: 20, pointerEvents: "none" }}>
                      <i className="ti ti-cloud-upload" style={{ fontSize: 36, color: "#6d28d9", display: "block", marginBottom: 8 }} />
                      <p style={{ color: "#9d8fc0", fontSize: 13, margin: 0 }}>Drag & Drop or <span style={{ color: "#a78bfa", fontWeight: 600 }}>Browse</span></p>
                      <p style={{ color: "#5f4d80", fontSize: 11, margin: "4px 0 0" }}>PNG, JPG, WEBP, AVIF</p>
                    </div>
                  )}
                </div>
                {originalSize && (
                  <p style={{ fontSize: 11, color: "#7c6fa0", margin: 0 }}>
                    <i className="ti ti-file" style={{ fontSize: 13, verticalAlign: -2, marginRight: 4 }} />
                    {file?.name?.slice(0, 24)}{file?.name?.length > 24 ? "…" : ""} · {formatBytes(originalSize)}
                  </p>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => onFileSelect(e.target.files?.[0])} />
              </div>

              {/* Result panel */}
              <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#7c6fa0", textTransform: "uppercase", letterSpacing: 1, margin: 0 }}>Converted</p>
                  {savings !== null && (
                    <span style={{ fontSize: 11, background: savings >= 0 ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: savings >= 0 ? "#4ade80" : "#f87171", borderRadius: 6, padding: "2px 8px", fontWeight: 600 }}>
                      {savings >= 0 ? `−${savings}%` : `+${Math.abs(savings)}%`} size
                    </span>
                  )}
                </div>
                <div style={{
                  border: "2px dashed rgba(139,92,246,0.3)", borderRadius: 12, height: 190,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  overflow: "hidden", background: "rgba(255,255,255,0.02)",
                }}>
                  {resultUrl ? (
                    <img src={resultUrl} alt="result" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ textAlign: "center", pointerEvents: "none" }}>
                      <i className="ti ti-photo-off" style={{ fontSize: 32, color: "#4a3870", display: "block", marginBottom: 8 }} />
                      <p style={{ color: "#5f4d80", fontSize: 12, margin: 0 }}>Output preview</p>
                    </div>
                  )}
                </div>
                {convertedSize && (
                  <p style={{ fontSize: 11, color: "#7c6fa0", margin: 0 }}>
                    <i className="ti ti-file-check" style={{ fontSize: 13, verticalAlign: -2, marginRight: 4 }} />
                    converted.{format} · {formatBytes(convertedSize)}
                  </p>
                )}
              </div>
            </div>

            {/* Progress bar */}
            {converting && (
              <div style={{ marginTop: 16, background: "rgba(139,92,246,0.1)", borderRadius: 6, height: 6, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#8b5cf6,#ec4899)", borderRadius: 6, transition: "width 0.2s" }} />
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
              <button className="convert-btn" onClick={convertImage} disabled={converting || !file}
                style={{
                  flex: "1 1 120px", background: "#7c3aed", color: "#fff", border: "none",
                  borderRadius: 10, padding: "11px 20px", fontWeight: 600, fontSize: 14,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.15s",
                }}>
                {converting ? (
                  <><i className="ti ti-loader-2" style={{ fontSize: 16, animation: "pulse 1s infinite" }} /> {progress}%</>
                ) : (
                  <><i className="ti ti-transform" style={{ fontSize: 16 }} /> Convert</>
                )}
              </button>

              <button className="action-btn" onClick={downloadResult} disabled={!resultUrl}
                style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.3)", color: resultUrl ? "#c4b5fd" : "#4a3870", borderRadius: 10, padding: "11px 16px", fontWeight: 500, fontSize: 14, display: "flex", alignItems: "center", gap: 6, opacity: resultUrl ? 1 : 0.4 }}>
                <i className="ti ti-download" style={{ fontSize: 16 }} /> Download
              </button>

              {resultUrl && (
                <button className="action-btn" onClick={() => window.open(resultUrl, "_blank")}
                  style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.3)", color: "#c4b5fd", borderRadius: 10, padding: "11px 14px", display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}>
                  <i className="ti ti-external-link" style={{ fontSize: 16 }} />
               Open </button>
              )}

              <button className="action-btn" onClick={clearAll}
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171", borderRadius: 10, padding: "11px 14px", display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}>
                <i className="ti ti-trash" style={{ fontSize: 16 }} />
              Delete</button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer features */}
      <footer style={{ background: "#0c0820", borderTop: "1px solid rgba(139,92,246,0.15)", padding: "40px 20px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title} className="feat-card" style={{ background: "rgba(139,92,246,0.07)", border: "1px solid rgba(139,92,246,0.18)", borderRadius: 14, padding: "20px 16px", textAlign: "center" }}>
                <i className={`ti ${icon}`} style={{ fontSize: 28, color: "#8b5cf6", display: "block", marginBottom: 10 }} />
                <h4 style={{ fontWeight: 600, fontSize: 14, margin: "0 0 6px", color: "#e2d9f3" }}>{title}</h4>
                <p style={{ fontSize: 12, color: "#7c6fa0", margin: 0, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(139,92,246,0.1)", padding: "16px 0", textAlign: "center", color: "#5f4d80", fontSize: 12 }}>
            © {new Date().getFullYear()} ImgConvert — JPG · PNG · JPEG · WEBP · AVIF
          </div>
        </div>
      </footer>

      {/* Hidden canvas for conversion */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <Toast toast={toast} />
    </div>
  );
}
