"use client";

export default function RotatePrompt() {
  return (
    // max-md: Chỉ áp dụng cho thiết bị di động/tablet nhỏ
    // portrait:flex: Hiện ra (flex) khi màn hình dọc
    // hidden: Mặc định ẩn (trên PC hoặc khi đã xoay ngang)
    <div className="hidden max-md:portrait:flex fixed inset-0 z-[9999] bg-gray-950 text-gray-200 flex-col items-center justify-center px-6 text-center">
      
      {/* Icon xoay điện thoại (có hiệu ứng rung lắc nhẹ để gây chú ý) */}
      <div className="mb-6 animate-pulse">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-20 h-20 text-green-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25v-15a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 4.5v15a2.25 2.25 0 002.25 2.25z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 5.25a2.25 2.25 0 00-2.25-2.25h-1.5m-6 0H8.25A2.25 2.25 0 006 5.25m13.5 13.5a2.25 2.25 0 01-2.25 2.25h-1.5m-6 0H8.25A2.25 2.25 0 016 18.75"
          />
          {/* Mũi tên cong biểu tượng cho việc xoay */}
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" 
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-white mb-3">
        Vui lòng xoay ngang thiết bị
      </h2>
      
      <p className="text-gray-400 max-w-sm text-sm leading-relaxed">
        Để có trải nghiệm hình ảnh và nội dung tốt nhất trên nền tảng, hãy xoay ngang điện thoại của bạn nhé.
      </p>
    </div>
  );
}