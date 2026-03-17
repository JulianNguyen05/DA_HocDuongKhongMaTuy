import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// GỌI CHAT WIDGET VÀO ĐÂY
import ChatWidget from "@/components/chatbot/ChatWidget";

// IMPORT COMPONENT YÊU CẦU XOAY MÀN HÌNH (Lưu ý: điều chỉnh đường dẫn nếu bạn lưu ở thư mục khác)
import RotatePrompt from "@/components/RotatePrompt";

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
        {/* COMPONENT YÊU CẦU XOAY MÀN HÌNH SẼ NẰM Ở ĐÂY */}
        {/* <RotatePrompt /> */}

        <Navbar />

        <main className="flex-grow w-full overflow-x-hidden">{children}</main>

        {/* NÚT CHATBOT NỔI ĐÃ ĐƯỢC TÍCH HỢP HIỆU ỨNG */}
        <ChatWidget />

        <Footer />
      </body>
    </html>
  );
}