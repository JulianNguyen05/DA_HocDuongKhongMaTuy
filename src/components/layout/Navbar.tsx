"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const menu = [
  { name: "Ngã Rẽ Cuộc Đời", path: "/game" },
  { name: "Thông tin về các loại ma túy", path: "/flashcard" },
  { name: "Pháp Luật", path: "/tree" },
  // { name: "Bản Đồ", path: "/map" },
  // { name: "Điểm Tin", path: "/news" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Xử lý sự kiện cuộn trang để ẩn/hiện Navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 1. Nếu đang ở sát đỉnh (ví dụ < 10px), luôn hiện Navbar
      if (currentScrollY <= 10) {
        setIsVisible(true);
      }
      // 2. Nếu cuộn xuống, ẩn Navbar
      else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
        setOpen(false);
      }
      // 3. Nếu cuộn lên NHƯNG chưa tới đỉnh, vẫn giữ ẩn
      // (Bỏ logic hiện Navbar khi cuộn lên ở giữa trang)

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    // Thêm hiệu ứng trượt (translate-y) và mờ dần (opacity) khi isVisible thay đổi
    <div
      className={`fixed inset-x-0 z-[100] px-4 top-6 md:top-8 transition-all duration-500 ease-in-out ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "-translate-y-[150%] opacity-0 pointer-events-none"
      }`}
    >
      <div className="relative flex justify-center w-full max-w-6xl mx-auto">
        <nav className="relative flex items-center w-full px-2 py-2 bg-transparent justify-between">
          {/* LOGO */}
          <div className="overflow-hidden whitespace-nowrap">
            <Link
              href="/"
              className="relative z-10 flex items-center gap-2 group ml-4 mr-4"
            >
              {/* THAY ĐỔI: text-2xl -> text-xl trên mobile */}
              <span className="text-xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent drop-shadow-sm">
                Học đường không ma túy
              </span>
            </Link>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-1 rounded-full bg-white/40 backdrop-blur-md border border-white/60 shadow-sm p-1.5">
            {menu.map((item) => {
              const active = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative px-5 py-2 md:py-2.5 text-[15px] font-bold rounded-full transition-colors duration-300 ${
                    active ? "text-white" : "text-gray-700 hover:text-green-700"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-green-600 rounded-full shadow-md"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10 tracking-wide">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle Menu"
            title="Mở menu"
            className="md:hidden p-2 rounded-full transition relative z-20 bg-white/50 backdrop-blur-md border border-white/50 text-gray-800"
          >
            <div className="w-6 h-5 flex flex-col justify-between items-end">
              <span
                className={`h-0.5 bg-current rounded-full transform transition-all duration-300 ${
                  open ? "w-6 rotate-45 translate-y-2.5" : "w-6"
                }`}
              />
              <span
                className={`h-0.5 bg-current rounded-full transition-all duration-200 ${
                  open ? "opacity-0" : "w-5"
                }`}
              />
              <span
                className={`h-0.5 bg-current rounded-full transform transition-all duration-300 ${
                  open ? "w-6 -rotate-45 -translate-y-2" : "w-4"
                }`}
              />
            </div>
          </button>
        </nav>

        {/* MOBILE MENU DROPDOWN */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              style={{ transformOrigin: "top right" }}
              className="absolute top-full mt-4 right-0 w-[240px] sm:w-[280px] p-3 bg-white/95 backdrop-blur-2xl shadow-xl border border-gray-100 rounded-3xl flex flex-col gap-1 md:hidden"
            >
              {menu.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setOpen(false)}
                  className={`px-5 py-3 rounded-2xl text-base font-bold transition-all ${
                    pathname === item.path
                      ? "bg-green-50 text-green-700"
                      : "hover:bg-gray-50 text-gray-600 text-left"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
