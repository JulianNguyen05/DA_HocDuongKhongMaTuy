"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

const menu = [
  { name: "Ngã Rẽ Cuộc Đời", path: "/game" },
  { name: "Kiến Thức", path: "/flashcard" },
  { name: "Pháp Luật", path: "/tree" },
  { name: "Bản Đồ", path: "/map" },
  { name: "Điểm Tin", path: "/news" },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className={`fixed inset-x-0 z-[100] flex justify-center px-4 transition-all duration-700 ${scrolled ? "top-4" : "top-6 md:top-8"}`}>
      <nav
        className={`
          relative flex items-center
          transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
          ${scrolled 
            // Khi cuộn: Navbar co lại vừa khít (w-fit), căn giữa, tạo thành viên thuốc hoàn hảo
            ? "w-fit px-2 py-2 rounded-full bg-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/50 backdrop-blur-xl justify-center" 
            // Khi đứng yên: Trải dài ra 2 bên (justify-between)
            : "w-full max-w-6xl px-2 py-2 bg-transparent justify-between"}
        `}
      >
        {/* LOGO - Hiệu ứng trượt và mờ dần khi cuộn */}
        <AnimatePresence>
          {!scrolled && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <Link href="/" className="relative z-10 flex items-center gap-2 group ml-4 mr-4">
                <span className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-green-900 to-green-700 bg-clip-text text-transparent drop-shadow-sm">
                  Học đường không ma túy
                </span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DESKTOP MENU */}
        <div className={`
          hidden md:flex items-center gap-1 rounded-full transition-all duration-500
          ${scrolled 
            ? "p-0.5" // Viền mỏng lại khi ở trong "viên thuốc"
            : "bg-white/40 backdrop-blur-md border border-white/60 shadow-sm p-1.5"
          }
        `}>
          {menu.map((item) => {
            const active = pathname === item.path
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`relative px-5 py-2 md:py-2.5 text-[15px] font-bold rounded-full transition-colors duration-300 ${
                  active ? "text-white" : "text-gray-700 hover:text-green-800"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-green-600 rounded-full shadow-md"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 tracking-wide">{item.name}</span>
              </Link>
            )
          })}
        </div>

        {/* MOBILE MENU BUTTON (Chỉ hiện trên điện thoại) */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle Menu"
          title="Mở menu"
          className={`md:hidden p-2 rounded-full transition relative z-20 ${scrolled ? "bg-gray-100/50 text-gray-800 mx-2" : "bg-white/50 backdrop-blur-md border border-white/50 text-gray-800"}`}
        >
          <div className="w-6 h-5 flex flex-col justify-between items-end">
            <span className={`h-0.5 bg-current rounded-full transform transition-all duration-300 ${open ? "w-6 rotate-45 translate-y-2.5" : "w-6"}`} />
            <span className={`h-0.5 bg-current rounded-full transition-all duration-200 ${open ? "w-0 opacity-0" : "w-5"}`} />
            <span className={`h-0.5 bg-current rounded-full transform transition-all duration-300 ${open ? "w-6 -rotate-45 -translate-y-2" : "w-4"}`} />
          </div>
        </button>

        {/* MOBILE MENU DROPDOWN */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute top-[120%] left-0 right-0 p-4 bg-white/95 backdrop-blur-2xl shadow-2xl border border-gray-100 rounded-3xl flex flex-col gap-2 md:hidden"
            >
              {menu.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setOpen(false)}
                  className={`px-6 py-4 rounded-2xl text-lg font-bold transition-all ${
                    pathname === item.path ? "bg-green-50 text-green-700" : "hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  )
}