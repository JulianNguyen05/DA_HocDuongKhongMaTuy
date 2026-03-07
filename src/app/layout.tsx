import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link"; // <--- BẠN PHẢI THÊM DÒNG NÀY

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Học Đường Không Ma Túy",
  description: "Dự án nền tảng số phòng, chống ma túy.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body
        className={`${inter.className} bg-brand-cream text-gray-900 min-h-screen flex flex-col`}
      >
        <Navbar />

        <main className="flex-grow w-full overflow-x-hidden">{children}</main>

        {/* NÚT CHATBOT NỔI */}
        <div className="fixed bottom-6 right-6 z-50">
          <Link href="/chatbot">
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 p-4 rounded-full shadow-[0_10px_25px_rgba(124,58,237,0.5)] hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex items-center justify-center border border-white/20">
              {/* Icon Chat trắng tinh tế */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
              </svg>

              {/* Chữ */}
              <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-3 text-white font-bold transition-all duration-500 ease-in-out whitespace-nowrap">
                Trợ lý giải đáp thắc mắc
              </span>

              {/* Badge thông báo nhỏ (tạo cảm giác có tin nhắn mới) */}
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
              </span>
            </div>
          </Link>
        </div>

        <Footer />
      </body>
    </html>
  );
}
