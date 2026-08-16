

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../utils/axioClient";
import Typed from "typed.js";



const EXAMPLES = [
  {
    icon: "☕",
    label: "Coffee Shop",
    prompt: `Create a stunning coffee shop landing page with:
- Full-screen hero with a warm dark background (#1a0a00) and large serif heading "Brewed to Perfection"
- Smooth scroll navigation: Home, Menu, About, Contact
- Menu section with 6 cards (Espresso, Latte, Cappuccino, Cold Brew, Matcha, Mocha) each with price, emoji icon, gradient card bg
- Parallax-style animated hero with floating coffee cup SVG
- Footer with social links and opening hours
- Color palette: deep brown #1a0a00, amber #f59e0b, cream #fdf6ec
- Fully responsive: stacked on mobile, grid on desktop
- CSS animations: fade-in on scroll, hover glow on cards, button shimmer effect`
  },
  {
    icon: "🧑‍💼",
    label: "Portfolio",
    prompt: `Build a world-class developer portfolio website with:
- Dark theme: #0a0a0f background, #6d28d9 accent, white text
- Hero: large name heading with typewriter effect (pure JS), subtitle "Full Stack Developer", CTA buttons "View Work" and "Contact Me"
- Animated gradient orbs in background (CSS keyframes)
- Skills section: animated progress bars for HTML, CSS, JS, React, Node (85-95%)
- Projects grid: 3 cards with title, description, tech stack tags, GitHub + Live buttons
- Timeline: education/experience with left-border line design
- Contact form: name, email, message with glowing focus states
- Smooth scroll + active nav highlight
- Mobile: hamburger menu, single column layout`
  },
  {
    icon: "🧮",
    label: "Calculator",
    prompt: `Design a premium glassmorphism calculator app with:
- Dark bg #0f0f15, glass card with backdrop-filter blur(20px), border rgba(255,255,255,0.1)
- Large display showing current input + previous operation in smaller text above
- Button grid: digits 0-9, operators (+,-,*,/), clear (AC), backspace (⌫), equals (=), decimal (.)
- Color coding: number buttons dark gray, operators purple #7c3aed, equals green #10b981, AC red #ef4444
- Button press animation: scale(0.92) + ripple effect
- Keyboard support (numbers and operators)
- History panel: last 5 calculations shown below the display
- Error handling: "Cannot divide by 0", overflow protection
- Fully centered, works perfectly on mobile and desktop`
  },
  {
    icon: "✅",
    label: "Todo App",
    prompt: `Create a productivity-focused todo list app with:
- Dark theme: #0d0d14 bg, #8b5cf6 accent
- Header with date/time display (live JS clock) and motivational quote
- Add task input with priority selector (High/Medium/Low) and category dropdown (Work/Personal/Health)
- Task cards with: checkbox (animated checkmark on complete), task text, priority badge (colored), delete button
- Filter tabs: All / Active / Completed with task count badges
- Completed tasks show strikethrough + fade to 50% opacity
- Drag visual indicator on hover
- Empty state illustration (SVG rocket with "No tasks yet!")
- Stats bar: X tasks total, Y completed, Z pending
- LocalStorage persistence (tasks survive page refresh)
- Smooth CSS transitions on all interactions`
  },
  {
    icon: "🌤",
    label: "Weather UI",
    prompt: `Build a stunning weather dashboard UI with:
- Dark gradient bg: #0b1120 to #0f1f3d (deep navy)
- Main card: large city name, 72px temperature display, weather condition with animated SVG icon (sun rays rotating, rain drops falling)
- Weather details row: Humidity, Wind Speed, UV Index, Visibility — each in a glass card with icon
- 5-day forecast strip: day name, weather icon, high/low temps — horizontal scroll on mobile
- Hourly chart: SVG polyline graph showing temperature curve for next 12 hours
- Background changes by condition: clear=navy, rainy=dark gray-blue, stormy=dark purple
- Hardcode city as "New York" with realistic sample data (72°F, Partly Cloudy etc)
- Animated floating clouds in background using CSS keyframes
- Fully responsive: 1 column mobile, 2 column tablet, dashboard grid desktop`
  },
];

export default function WebsiteBuilder() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeExample, setActiveExample] = useState(null);
  const typedRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: ["Live Studio", "AI Powered Builder", "Design • Build • Deploy", "Websites in Seconds"],
      typeSpeed: 80,
      backSpeed: 50,
      backDelay: 1800,
      loop: true,
      showCursor: true,
      cursorChar: "|",
    });
    return () => typed.destroy();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await axiosClient.post("/chats/generate", { prompt: input.trim() });
      navigate("/website-builder/studio", { state: { answer: res.data.answer } });
    } catch (err) {
      console.error("Generation failed:", err);
      alert("Failed to generate website. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#07080f] text-white overflow-hidden relative">

      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#7c3aed]/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[200px] bg-[#b026ff]/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-10 right-1/4 w-[250px] h-[150px] bg-[#4f1f8a]/15 rounded-full blur-[70px]" />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      {/* HEADER */}
      <div className="relative z-10 text-center pt-8 pb-5 px-4 flex-shrink-0">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#7c3aed]/40 bg-[#7c3aed]/10 text-[#c084fc] text-xs font-medium mb-4 tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7] animate-pulse" />
          Gemini 2.5 Flash Powered
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
          AI Website Builder
          <br />
          <span ref={typedRef} className="bg-gradient-to-r from-[#a855f7] via-[#c084fc] to-[#e879f9] bg-clip-text text-transparent" />
        </h1>

        <p className="mt-2 text-gray-500 text-sm sm:text-base max-w-lg mx-auto">
          Describe your vision — get production-ready HTML, CSS & JS instantly.
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="relative z-10 flex-1 flex items-start justify-center px-4 pb-6 overflow-hidden">
        <div className="w-full max-w-3xl">

          {/* Glowing card */}
          <div className="relative rounded-2xl border border-[#2a1f45] bg-[#0d0d1a]/90 backdrop-blur-xl shadow-[0_0_60px_rgba(124,58,237,0.15)] p-5 sm:p-6">

            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#7c3aed]/10 to-transparent rounded-2xl pointer-events-none" />

            <label className="block text-xs font-semibold text-[#9ca3af] uppercase tracking-widest mb-2">
              Your Idea
            </label>

            <textarea
              rows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && e.ctrlKey && handleSend()}
              placeholder="e.g., A sleek SaaS landing page with pricing table, dark mode, and particle background..."
              className="w-full p-3.5 rounded-xl bg-[#07080f] text-gray-100 placeholder-gray-600 border border-[#1e1b35] focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50 resize-none text-sm transition-all duration-200"
            />

            {/* EXAMPLES */}
            <div className="mt-4">
              <p className="text-[11px] text-gray-600 uppercase tracking-widest mb-2 font-semibold">Quick Start</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => { setInput(ex.prompt); setActiveExample(i); }}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all duration-200
                      ${activeExample === i
                        ? "border-[#7c3aed] bg-[#7c3aed]/20 text-[#c084fc]"
                        : "border-[#1e1b35] bg-[#0f0f1e] text-gray-400 hover:border-[#7c3aed]/50 hover:text-gray-200"
                      }`}
                  >
                    <span>{ex.icon}</span>
                    <span>{ex.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* DIVIDER */}
            <div className="my-4 border-t border-[#1a1730]" />

            {/* GENERATE BUTTON */}
            <div className="flex items-center justify-between gap-4">
              <p className="text-[11px] text-gray-700">Ctrl + Enter to generate</p>

              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="relative flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold tracking-wide
                  bg-gradient-to-r from-[#6d28d9] via-[#7c3aed] to-[#9333ea]
                  text-white
                  shadow-[0_0_20px_rgba(124,58,237,0.4)]
                  hover:shadow-[0_0_35px_rgba(124,58,237,0.65)]
                  hover:scale-[1.03]
                  active:scale-95
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none
                  transition-all duration-200 overflow-hidden group"
              >
                {/* Shimmer */}
                <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none" />

                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Building your site...
                  </>
                ) : (
                  <>
                    <span>✦</span>
                    Generate Website
                  </>
                )}
              </button>
            </div>
          </div>

          {/* BOTTOM STATS */}
          <div className="mt-4 flex justify-center gap-6 sm:gap-10">
            {[
              { val: "100%", label: "Browser-based" },
              { val: "0", label: "Server uploads" },
              { val: "3s", label: "Avg generation" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-base font-black text-[#a855f7]">{s.val}</div>
                <div className="text-[10px] text-gray-600 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}