import { Link, useLocation } from "react-router-dom";

export default function MobileBottomNav() {
  const location = useLocation();

  const navItems = [
    { path: "/chat", icon: "fa-comments", label: "Ask AI" },
    { path: "/imageconverter", icon: "fa-image", label: "ImgConvert" },
    { path: "/backgroundremover", icon: "fa-scissors", label: "BgRemover" },
    { path: "/website-builder", icon: "fa-code", label: "WebBuilder" },
  ];

  return (
    <nav
      className="
        fixed bottom-3 left-1/2 -translate-x-1/2
        w-[92%] max-w-[480px] h-14
        bg-[#12121F]/92 backdrop-blur-xl
        rounded-2xl
        border border-[#50508c]/35
        shadow-[0_8px_32px_rgba(0,0,0,0.45)]
        flex justify-around items-center
        px-1.5
        md:hidden
        z-50
      "
    >
      {navItems.map(({ path, icon, label }) => {
        const isActive = location.pathname === path;
        return (
          <Link
            key={path}
            to={path}
            className={`
              flex flex-col items-center justify-center gap-[3px]
              flex-1 px-2 py-1.5 rounded-xl
              transition-all duration-200
              ${isActive
                ? "text-[#B026FF] bg-[#B026FF]/10"
                : "text-[#6b6b8a] hover:bg-[#B026FF]/[0.06]"
              }
            `}
          >
            <i className={`fa-solid ${icon} text-[16px] leading-none`}></i>
            <span className="text-[9px] font-medium tracking-wide whitespace-nowrap">
              {label}
            </span>
            <span
              className={`w-[3px] h-[3px] rounded-full bg-[#B026FF] transition-opacity ${
                isActive ? "opacity-100" : "opacity-0"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}