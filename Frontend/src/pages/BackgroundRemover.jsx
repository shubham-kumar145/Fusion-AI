

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Typed from "typed.js";

export default function BackgroundRemover() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState("");
  const [toast, setToast] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const typedRef = useRef(null);
 
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: [
        "Remove Backgrounds Instantly",
        "Get Transparent PNG in Seconds",
        "AI-Powered & Lightning Fast",
      ],
      typeSpeed: 70,
      backSpeed: 50,
      backDelay: 2000,
      loop: true,
    });
    return () => typed.destroy();
  }, []);

  function showToast(message, kind = "info") {
    setToast({ message, kind });
    setTimeout(() => setToast(null), 5000);
  }

  const onFileChange = (f) => {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResultUrl("");
    setProgress(0);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) onFileChange(f);
  };

  const handleUpload = async () => {
    if (!file) return showToast("Please choose an image first", "error");

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      setProgress(0);
      setResultUrl("");

      const res = await axios.post(`${BACKEND_URL}/api/background/remove`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });

      if (res.data.success) {
        setResultUrl(res.data.url);
        showToast("Background removed successfully!", "success");
      } else {
        showToast(res.data.error || "Something went wrong.", "error");
      }
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.error || "Background removal failed. Try again.";
      showToast(msg, "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async () => {
    if (!resultUrl) return;
    try {
      const res = await fetch(resultUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "background-removed.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      showToast("Download failed. Try opening the image directly.", "error");
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setResultUrl("");
    setProgress(0);
  };

  // Checkerboard pattern to show transparency
  const checkerboardStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Crect width='8' height='8' fill='%23222233'/%3E%3Crect x='8' y='8' width='8' height='8' fill='%23222233'/%3E%3Crect x='8' y='0' width='8' height='8' fill='%23181825'/%3E%3Crect x='0' y='8' width='8' height='8' fill='%23181825'/%3E%3C/svg%3E")`,
  };

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white flex flex-col">

      {/* ── TOP BAR ── */}
      <header className="flex items-center justify-between px-5 md:px-8 h-14 border-b border-[#1e1e2d] bg-[#0d0d1a] flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#B026FF] to-[#7A1DFF] flex items-center justify-center text-sm">✂</div>
          <span className="font-bold text-white text-base tracking-tight">BgRemover</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-sm text-gray-400">
          <button className="hover:text-white transition">About</button>
          <button className="hover:text-white transition">Services</button>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col lg:flex-row">

        {/* LEFT — HERO */}
        <div className="lg:w-[42%] flex flex-col justify-center px-6 md:px-10 lg:px-12 py-10 lg:py-0 border-b lg:border-b-0 lg:border-r border-[#1e1e2d]">

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B026FF]/10 border border-[#B026FF]/25 text-[#c084fc] text-xs font-medium mb-5 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B026FF] animate-pulse" />
            remove.bg · Cloudinary Powered
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Remove Your<br />Image Background
          </h1>

          <div className="text-xl sm:text-2xl font-bold mb-5 min-h-[2rem]">
            <span ref={typedRef} className="bg-gradient-to-r from-[#B026FF] to-[#e879f9] bg-clip-text text-transparent" />
          </div>

          <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6 max-w-md">
            Upload any image with a clear subject — person, product, or animal — and get a clean transparent PNG instantly.
          </p>

          <div className="flex flex-wrap gap-2">
            {["No Sign-up", "Auto-deleted in 5min", "Transparent PNG", "Free to Use"].map((t) => (
              <span key={t} className="text-xs px-3 py-1 rounded-full border border-[#2a2a40] text-gray-400 bg-[#12121f]">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT — TOOL PANEL */}
        <div className="flex-1 flex flex-col px-4 md:px-8 lg:px-10 py-8">

          {/* Image panels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">

            {/* Original upload */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Original Image</p>
              <div
                onClick={() => document.getElementById("fileInput").click()}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                className={`relative w-full aspect-[4/3] rounded-xl border-2 border-dashed cursor-pointer flex items-center justify-center overflow-hidden transition-all duration-200
                  ${dragOver
                    ? "border-[#B026FF] bg-[#B026FF]/10"
                    : "border-[#2a2a40] bg-[#0f0f1e] hover:border-[#B026FF]/50"
                  }`}
              >
                {preview ? (
                  <img src={preview} alt="Original" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center px-4">
                    <div className="text-3xl mb-2">🖼</div>
                    <p className="text-gray-400 text-sm">
                      Drag & Drop or <span className="text-[#B026FF] font-semibold">Browse</span>
                    </p>
                    <p className="text-gray-600 text-xs mt-1">PNG, JPG, WEBP supported</p>
                  </div>
                )}
                <input
                  id="fileInput"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => onFileChange(e.target.files[0])}
                />
              </div>
            </div>

            {/* Result */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Background Removed</p>
              <div
                className="relative w-full aspect-[4/3] rounded-xl border border-[#2a2a40] flex items-center justify-center overflow-hidden"
                style={resultUrl ? checkerboardStyle : {}}
              >
                {resultUrl ? (
                  <img
                    src={resultUrl}
                    alt="Result"
                    className="w-full h-full object-contain"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="text-center px-4 bg-[#0f0f1e] w-full h-full flex flex-col items-center justify-center">
                    <div className="text-3xl mb-2 opacity-30">✂️</div>
                    <p className="text-gray-600 text-sm">Result appears here</p>
                  </div>
                )}

                {/* Processing overlay */}
                {uploading && (
                  <div className="absolute inset-0 bg-[#0a0a14]/85 flex flex-col items-center justify-center gap-3">
                    <div className="w-9 h-9 border-2 border-[#B026FF] border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-gray-300 font-medium">Removing background...</p>
                    <div className="w-36 h-1.5 bg-[#2a2a40] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#7c3aed] to-[#B026FF] rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">{progress}% uploaded</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleUpload}
              disabled={uploading || !file}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm
                bg-gradient-to-r from-[#7c3aed] to-[#B026FF]
                shadow-[0_0_20px_rgba(176,38,255,0.3)]
                hover:shadow-[0_0_30px_rgba(176,38,255,0.5)]
                hover:scale-[1.02] active:scale-95
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
                transition-all duration-200"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <><span>✂</span> Remove Background</>
              )}
            </button>

            <button
              onClick={handleDownload}
              disabled={!resultUrl}
              className="sm:w-36 py-3 rounded-xl font-semibold text-sm border border-[#2a2a40] text-gray-300
                hover:border-[#B026FF]/50 hover:text-white hover:bg-[#B026FF]/10
                disabled:opacity-30 disabled:cursor-not-allowed
                transition-all duration-200"
            >
              ⬇ Download
            </button>

            <button
              onClick={handleClear}
              disabled={!file && !resultUrl}
              className="sm:w-28 py-3 rounded-xl font-semibold text-sm border border-[#2a2a40] text-gray-400
                hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/10
                disabled:opacity-30 disabled:cursor-not-allowed
                transition-all duration-200"
            >
              Clear
            </button>
          </div>

          {/* Tip */}
          <p className="text-xs text-gray-600 mt-3 text-center">
            💡 Works best with people, products, animals on a distinct background
          </p>
        </div>
      </main>

      {/* ── FEATURE CARDS ── */}
      <div className="border-t border-[#1e1e2d] px-4 md:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 max-w-6xl mx-auto">
          {[
            ["🪄", "AI Removal", "remove.bg powered cutouts"],
            ["⚡", "Instant", "Results in seconds"],
            ["🔒", "Auto-Deleted", "Images deleted after 5 min"],
            ["🎨", "Clean Edges", "Smooth, accurate results"],
            ["☁️", "Cloudinary CDN", "Fast global delivery"],
          ].map(([icon, title, desc]) => (
            <div
              key={title}
              className="bg-[#0f0f1e] border border-[#1e1e2d] hover:border-[#B026FF]/30 rounded-xl p-4 text-center transition-all duration-200 hover:bg-[#14142a]"
            >
              <div className="text-2xl mb-2">{icon}</div>
              <p className="text-sm font-semibold text-white mb-1">{title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#1e1e2d] py-4 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} BgRemover — remove.bg + Cloudinary Powered
      </footer>

      {/* ── TOAST ── */}
      {toast && (
        <div className={`fixed bottom-24 md:bottom-6 right-4 left-4 md:left-auto md:w-80 px-4 py-3 rounded-xl text-sm font-medium shadow-xl z-50 transition-all
          ${toast.kind === "success" ? "bg-green-600" : toast.kind === "error" ? "bg-red-600" : "bg-[#B026FF]"}`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}