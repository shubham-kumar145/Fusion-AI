
import { Link, Outlet, useLocation } from "react-router-dom";
import MobileBottomNav from "../pages/mobilebottomnavbar";

export default function Layout() {
  const location = useLocation();

  const navItems = [
    { path: "/chat", icon: "fa-comments", label: "Ask AI" },
    { path: "/imageconverter", icon: "fa-image", label: "Image Converter" },
    { path: "/backgroundremover", icon: "fa-scissors", label: "Bg Remover" },
    { path: "/website-builder", icon: "fa-code", label: "Website Builder" },
  ];

  return (
    <div className="h-screen flex bg-[#0A0A14]">

      {/* LEFT SIDEBAR — DESKTOP ONLY */}
      <aside
        className="
          hidden md:flex
          w-[200px] fixed top-0 left-0 h-full
          bg-[#0D0D1A]
          text-white flex-col
          border-r border-[#1A1A2E]
          z-40
        "
      >
        {/* LOGO */}
        <div className="px-5 pt-6 pb-5 border-b border-[#1A1A2E]">
          <div className="flex items-center gap-2.5">
            <span className="text-[22px] leading-none">🚀</span>
            <span
              className="
                text-[18px] font-bold tracking-tight
                bg-gradient-to-r from-[#B026FF] to-[#D88BFF]
                bg-clip-text text-transparent
              "
            >
              LogixAI
            </span>
          </div>
        </div>

        {/* NAV LINKS */}
        <nav className="flex flex-col gap-1 px-3 pt-4">
          {navItems.map(({ path, icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-xl
                  text-[13px] font-medium tracking-wide
                  transition-all duration-200
                  ${isActive
                    ? "bg-[#B026FF]/15 text-[#C96EFF] border border-[#B026FF]/25"
                    : "text-[#7070A0] hover:bg-[#1A1A2E] hover:text-[#B0B0D0] border border-transparent"
                  }
                `}
              >
                <i
                  className={`fa-solid ${icon} text-[13px] w-4 text-center shrink-0
                    ${isActive ? "text-[#B026FF]" : "text-[#5050808]"}
                  `}
                ></i>
                <span className="truncate">{label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#B026FF] shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* BOTTOM BADGE */}
        <div className="mt-auto px-4 pb-6">
          <div className="rounded-xl border border-[#1A1A2E] bg-[#111120] px-3 py-3">
            <p className="text-[11px] text-[#5050808] leading-relaxed">
              All tools run{" "}
              <span className="text-[#B026FF] font-medium">100% in-browser</span>
              . No uploads, no server.
            </p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-[200px] bg-[#0A0A14] text-white overflow-y-auto">
        <Outlet />
      </div>

      {/* MOBILE BOTTOM NAV */}
      <MobileBottomNav />
    </div>
  );
}