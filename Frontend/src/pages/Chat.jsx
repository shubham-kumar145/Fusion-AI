

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../utils/axioClient";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import Typed from "typed.js";

export default function Chat({ user }) {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());

  const chatEndRef = useRef(null);
  const typedRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!typedRef.current) return;
    const typed = new Typed(typedRef.current, {
      strings: ["LOGIXAI - AI INSTRUCTOR"],
      typeSpeed: 120,
      backSpeed: 80,
      loop: true,
      showCursor: false,
    });
    return () => typed.destroy();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => { fetchChats(); }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages]);

  const fetchChats = async () => {
    try {
      const res = await axiosClient.get("/chats");
      const data = res.data || [];
      setChats(data);
      if (data.length > 0) setCurrentChat(data[0]);
    } catch (err) {
      console.error("Failed to fetch chats:", err);
    }
  };

  const handleSend = useCallback(async () => {
    const question = input.trim();
    if (!question || loading) return;

    let activeChat = currentChat;
    if (!activeChat) {
      try {
        const res = await axiosClient.post("/chats/new", { title: "New Chat" });
        activeChat = res.data;
        setChats((prev) => [activeChat, ...prev]);
        setCurrentChat(activeChat);
      } catch (err) {
        console.error("Failed to create chat:", err);
        return;
      }
    }

    setInput("");
    setLoading(true);

    const tempMessage = { question, answer: "loading..." };
    const optimisticChat = {
      ...activeChat,
      messages: [...(activeChat.messages || []), tempMessage],
    };
    setCurrentChat(optimisticChat);
    setChats((prev) => prev.map((c) => (c._id === activeChat._id ? optimisticChat : c)));

    try {
      const res = await axiosClient.post("/chats/ask", {
        chatId: activeChat._id,
        question,
      });

      const realMessage = res.data;
      const updatedMessages = optimisticChat.messages.map((msg, i) =>
        i === optimisticChat.messages.length - 1 ? realMessage : msg
      );

      let title = activeChat.title;
      if (title === "New Chat" && updatedMessages.length === 1) {
        const words = question.split(" ");
        title = words.slice(0, 5).join(" ") + (words.length > 5 ? "..." : "");
      }

      const finalChat = { ...optimisticChat, messages: updatedMessages, title };
      setCurrentChat(finalChat);
      setChats((prev) => prev.map((c) => (c._id === finalChat._id ? finalChat : c)));
    } catch (err) {
      console.error("Failed to get AI response:", err);
      const errorMessages = optimisticChat.messages.map((msg, i) =>
        i === optimisticChat.messages.length - 1
          ? { ...msg, answer: "⚠️ Something went wrong. Please try again." }
          : msg
      );
      const errorChat = { ...optimisticChat, messages: errorMessages };
      setCurrentChat(errorChat);
      setChats((prev) => prev.map((c) => (c._id === errorChat._id ? errorChat : c)));
    } finally {
      setLoading(false);
    }
  }, [input, currentChat, loading]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = async () => {
    try {
      const res = await axiosClient.post("/chats/new", { title: "New Chat" });
      setChats((prev) => [res.data, ...prev]);
      setCurrentChat(res.data);
      setShowMobileSidebar(false);
    } catch (err) {
      console.error("Failed to create new chat:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosClient.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      navigate("/login");
      window.location.reload();
    }
  };

  const formatMarkdownAI = (text) => {
    if (!text) return text;
    return text.split("\n").map((l) => l.trimEnd()).map((l) => (l === "" ? "\n" : l)).join("\n");
  };

  const sortedChats = [...chats].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="h-screen flex flex-col bg-[#0C0C17] overflow-hidden">

      {/* ── TOP NAVBAR ── */}
      <header className="w-full bg-[#0E0E1A] border-b border-[#2A2A40] flex items-center justify-between px-3 md:px-5 h-12 md:h-14 flex-shrink-0 z-40">
        <p className="text-base md:text-xl font-bold text-[#B026FF] truncate">
          LogixAI <span className="text-white font-bold">- AI INSTRUCTOR</span>
        </p>
        <div className="hidden md:flex items-center gap-2">
          <img src="/user_logixai.png" alt="User" className="w-8 h-8 rounded-full object-cover" />
          <span className="font-medium text-[#a60ff7] text-sm">{user?.email}</span>
        </div>
        <button
          onClick={() => setShowMobileSidebar(true)}
          className="md:hidden bg-[#B026FF] p-1.5 rounded-lg text-white text-sm"
        >
          <i className="fa-solid fa-list"></i>
        </button>
      </header>

      {/* ── BODY ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── CHAT AREA ── */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

          {/* Messages — extra bottom padding on mobile so last msg isn't hidden by bottom nav */}
          <div className="flex-1 overflow-y-auto px-3 md:px-5 py-3 space-y-3 pb-6 md:pb-3">

            {(!currentChat || !currentChat.messages?.length) && (
              <div className="flex flex-col items-center justify-center h-full opacity-40">
                <i className="fa-solid fa-robot text-4xl text-[#B026FF] mb-3"></i>
                <p className="text-base font-semibold text-white">Ask me anything!</p>
                <p className="text-xs text-gray-400 mt-1">Type a message below to start.</p>
              </div>
            )}

            {currentChat?.messages?.map((msg, idx) => (
              <div key={idx} className="space-y-2">

                {/* USER bubble */}
                <div className="flex items-end gap-2 justify-end">
                  <div className="bg-[#B026FF] text-white rounded-2xl rounded-br-sm px-3 py-2 text-sm max-w-[75%] md:max-w-[65%] leading-relaxed shadow-md">
                    {msg.question}
                  </div>
                  <img src="/user.png" alt="User" className="w-7 h-7 md:w-9 md:h-9 rounded-full object-cover flex-shrink-0" />
                </div>

                {/* AI bubble */}
                <div className="flex items-end gap-2">
                  <img src="/robo.png" alt="AI" className="w-7 h-7 md:w-9 md:h-9 rounded-full object-cover flex-shrink-0" />
                  {msg.answer === "loading..." ? (
                    <div className="bg-[#1B1B2E] border border-[#4C1593] rounded-2xl rounded-bl-sm px-4 py-2.5 flex items-center gap-2 shadow-lg">
                      <div className="w-4 h-4 border-2 border-[#C75CFF] border-t-white rounded-full animate-spin"></div>
                      <span className="text-gray-400 text-xs">Thinking...</span>
                    </div>
                  ) : (
                    <div className="bg-[#1B1B2E] border border-[#4C1593] rounded-2xl rounded-bl-sm px-3 py-2 text-white text-sm max-w-[75%] md:max-w-[65%] leading-relaxed shadow-lg">
                      <ReactMarkdown
                        components={{
                          h1: ({ ...p }) => <h1 className="text-[#B026FF] font-bold text-base my-1.5" {...p} />,
                          h2: ({ ...p }) => <h2 className="text-[#B026FF] font-bold text-sm my-1" {...p} />,
                          h3: ({ ...p }) => <h3 className="text-[#B026FF] font-semibold text-sm my-0.5" {...p} />,
                          strong: ({ ...p }) => <strong className="text-[#B026FF]" {...p} />,
                          p: ({ ...p }) => <p className="mb-1 last:mb-0" {...p} />,
                          ul: ({ ...p }) => <ul className="list-disc list-inside space-y-0.5 my-1" {...p} />,
                          ol: ({ ...p }) => <ol className="list-decimal list-inside space-y-0.5 my-1" {...p} />,
                          code({ inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || "");
                            return !inline && match ? (
                              <SyntaxHighlighter style={materialDark} language={match[1]} PreTag="div" customStyle={{ fontSize: "12px", borderRadius: "8px", margin: "6px 0" }} {...props}>
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            ) : (
                              <code className="bg-[#2A1F4A] px-1 py-0.5 rounded text-xs" {...props}>{children}</code>
                            );
                          },
                        }}
                      >
                        {formatMarkdownAI(msg.answer)}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>

              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* ── INPUT BAR ── only change: pb-24 on mobile so it sits above bottom nav */}
          <div className="flex-shrink-0 border-t border-[#2A2A40] bg-[#0E0E1A] px-3 md:px-5 py-2.5 pb-24 md:pb-2.5 flex items-center gap-2">
            <input
              className="flex-1 bg-[#1F1F2F] text-white text-sm placeholder-gray-500 px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#B026FF]"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-[#B026FF] hover:bg-[#C75CFF] disabled:opacity-40 disabled:cursor-not-allowed px-3.5 py-2 rounded-xl text-white text-sm shadow-md transition-all flex-shrink-0"
            >
              <i className={`fa-solid ${loading ? "fa-spinner fa-spin" : "fa-paper-plane"}`}></i>
            </button>
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <aside className={`
          bg-[#0E0E1A] border-l border-[#2A2A40] flex flex-col text-white
          md:w-52 lg:w-60 md:relative md:translate-x-0
          fixed top-0 right-0 h-full w-64 z-50
          transform transition-transform duration-300
          ${showMobileSidebar ? "translate-x-0" : "translate-x-full"}
        `}>
          <button
            onClick={() => setShowMobileSidebar(false)}
            className="md:hidden absolute top-3 right-3 text-gray-400 hover:text-white text-lg z-10"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          <div className="md:hidden flex items-center gap-2 px-3 pt-4 pb-2 border-b border-[#2A2A40]">
            <img src="/user_logixai.png" alt="User" className="w-7 h-7 rounded-full object-cover" />
            <span className="text-[#B026FF] text-xs font-medium truncate">{user?.email}</span>
          </div>

          <div className="flex-1 flex flex-col p-3 gap-2.5 overflow-hidden">
            <div className="bg-[#1A1A2E] rounded-lg px-3 py-2 flex justify-between items-center">
              <span className="text-[#B026FF] text-xs font-medium tabular-nums">
                {dateTime.toLocaleTimeString("en-IN")}
              </span>
              <span className="text-[#B026FF] text-xs">
                {dateTime.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>

            <button
              onClick={handleNewChat}
              className="w-full bg-[#B026FF] hover:bg-[#C75CFF] text-white text-sm font-semibold py-2 rounded-lg shadow-md transition-colors"
            >
              + New Chat
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between px-3 py-2 bg-[#1A1A2E] border border-[#B026FF] rounded-lg text-sm font-semibold hover:bg-[#241230] transition-colors"
            >
              <span>Chat History</span>
              <i className={`fa-solid fa-chevron-${isOpen ? "down" : "right"} text-[#B026FF] text-xs transition-transform`}></i>
            </button>

            {isOpen && (
              <ul className="bg-[#1A1A2E] border border-[#7A1BCF] rounded-lg py-1 overflow-y-auto max-h-[40vh] flex-shrink-0">
                {sortedChats.length === 0 && (
                  <li className="px-3 py-2 text-gray-500 text-xs">No chats yet</li>
                )}
                {sortedChats.map((chat) => (
                  <li
                    key={chat._id}
                    onClick={() => { setCurrentChat(chat); setShowMobileSidebar(false); }}
                    className={`px-3 py-2 text-xs cursor-pointer truncate rounded-md mx-1 transition-colors ${
                      currentChat?._id === chat._id
                        ? "bg-[#B026FF] text-white"
                        : "text-gray-300 hover:bg-[#B026FF] hover:text-white"
                    }`}
                  >
                    {chat.title || "New Chat"}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-3 flex-shrink-0">
            <button
              onClick={handleLogout}
              className="w-full py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold text-white shadow-md transition-colors"
            >
              Logout
            </button>
          </div>
        </aside>
      </div>

      {/* Mobile sidebar backdrop */}
      {showMobileSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

    </div>
  );
}