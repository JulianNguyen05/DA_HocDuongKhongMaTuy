import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // Xanh lá chủ đạo với các sắc độ
          green: {
            light: "#EBF9EF", // Dùng cho background nhỏ, thông báo thành công
            DEFAULT: "#37C35F", // Màu gốc của bạn
            dark: "#2DA650",    // Dùng cho Hover
          },
          // Màu kem nền
          cream: {
            DEFAULT: "#FBFBF2",
            dark: "#F2F2E2",    // Dùng cho phân cách (Divider) hoặc section khác
          },
          // Màu bổ trợ (Accent) - Tông đất ấm áp
          accent: "#D4A373",
          // Màu chữ và trung tính
          neutral: {
            heading: "#1A1C19",
            body: "#444941",
            muted: "#8C9288",
          }
        },
        // Màu trạng thái hệ thống
        status: {
          error: "#E53E3E",
          warning: "#F6AD55",
          info: "#4299E1",
        }
      },
    },
  },
  plugins: [],
};

export default config;