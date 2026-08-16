import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../utils/axioClient";
import Typed from "typed.js";

export default function WebsiteBuilder({ user }) {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const typedRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: [
        "Live Studio",
        "AI Powered Builder",
        "Design • Build • Deploy",
        "Websites in Seconds",
      ],
      typeSpeed: 100,
      backSpeed: 100,
      backDelay: 1500,
      loop: true,
      showCursor: true,
      cursorChar: "|",
    });
    return () => typed.destroy();
  }, []);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    const res = await axiosClient.get("/chats");
    setChats(res.data);
    if (res.data.length > 0) setCurrentChat(res.data[0]);
  };

  const handleSend = async () => {
    if (!input.trim() || !currentChat) return;
    const question = input.trim();
    setLoading(true);

    const res = await axiosClient.post("/chats/ask", {
      chatId: currentChat._id,
      question,
    });


    //  const res = await axiosClient.post("/builder/generate", {
    //   prompt: input,
    // });

    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, res.data],
    };

    setCurrentChat(updatedChat);
    setChats(chats.map(c => (c._id === updatedChat._id ? updatedChat : c)));

    navigate(`/website-builder/studio/${updatedChat._id}`);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b0f1a] via-[#0a0d17] to-[#070a12] text-white px-4 sm:px-6 md:px-10 lg:px-16">

      {/* HEADER */}
      <div className="relative text-center pt-12 sm:pt-14 pb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide">
          AI Website Builder{" "}
          <span ref={typedRef} className="text-[#b84cff]"></span>
        </h1>

        <p className="mt-4 text-gray-400 max-w-xl sm:max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
          Experience the power of AI-driven web development. Describe your vision
          and watch as our AI creates beautiful, functional websites in seconds.
        </p>

        {/* HISTORY BUTTON */}
        {/* <button
          className="absolute top-6 sm:top-6 right-2 sm:right-6 md:right-8
                     bg-[#a855f7]/20 border border-[#a855f7]/40
                     text-[#c084fc]
                     px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium
                     hover:bg-[#a855f7]/30 transition"
        >
          ⏱ History (2)
        </button> */}
      </div>

      {/* MAIN CARD */}
      <div className="flex justify-center px-0 sm:px-2 md:px-6 pb-20">
        <div
          className="w-full max-w-full sm:max-w-3xl md:max-w-5xl lg:max-w-6xl min-h-[500px]
                     bg-[#0f1324]/80 backdrop-blur-xl
                     rounded-2xl border border-[#2a2f55]
                     p-4 sm:p-6 md:p-8 lg:p-10
                     shadow-[0_0_50px_rgba(168,85,247,0.18)]
                     flex flex-col"
        >
          <label className="block text-sm sm:text-base text-gray-300 mb-2">
            Describe your website idea:
          </label>

          <textarea
            rows={5}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., Create a modern portfolio website with dark theme, hero section, about me, projects gallery, and contact form..."
            className="w-full p-3 sm:p-4 rounded-xl
                       bg-[#0b0f1f]
                       text-gray-100 placeholder-gray-500
                       border border-[#2a2f55]
                       focus:outline-none focus:ring-2 focus:ring-[#a855f7]
                       resize-none"
          />

          {/* EXAMPLES */}
          <div className="mt-5">
            <p className="text-xs sm:text-sm text-gray-400 mb-3">Try these examples:</p>

            <div className="flex flex-wrap gap-2">
              {[
                "Create a modern landing page for a coffee shop with hero section and menu with dark theme",
                "Build a responsive portfolio website with dark theme and animations",
                "Design a calculator app with modern UI and full functionality",
                "Create a todo list app with add, delete, and mark complete features",
                "Build a weather dashboard with cards and modern design",
              ].map((example, i) => (
                <button
                  key={i}
                  onClick={() => setInput(example)}
                  className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full
                             bg-[#151a33]
                             border border-[#2a2f55]
                             text-gray-300
                             hover:bg-[#1d2350]
                             hover:text-white
                             transition"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* GENERATE BUTTON */}
          <div className="mt-6 sm:mt-8 flex justify-center">
            <button
              onClick={handleSend}
              disabled={loading}
              className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5
                         rounded-2xl text-md sm:text-lg font-semibold tracking-wide
                         bg-gradient-to-r from-[#641095] via-[#891a9a] to-[#7f1aa1]
                         text-white
                         shadow-[0_0_25px_rgba(124,58,237,0.45)]
                         hover:shadow-[0_0_45px_rgba(168,85,247,0.7)]
                         hover:scale-[1.04]
                         active:scale-95
                         transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              ✨ Generate Website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
