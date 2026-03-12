"use client";

import { memo } from "react";
import Image from "next/image";

const TreeBackground = () => {
  return (
    // Bỏ absolute và h-full đi, để nó tự nhiên bung hết chiều cao
    <div className="pointer-events-none z-0 w-full">
      <Image 
        src="/images/tree/tree-desktop.png"  
        alt="" 
        // BẠN HÃY ĐIỀN KÍCH THƯỚC THẬT CỦA BỨC ẢNH VÀO ĐÂY:
        width={1920} // Ví dụ: Chiều ngang thật của ảnh
        height={1080} // Ví dụ: Chiều cao thật của ảnh (để số to lên)
        className="w-full h-auto" // Chìa khóa đây: Rộng 100%, cao tự động kéo giãn cho đủ ảnh
        priority 
      />
    </div>
  );
};

export default memo(TreeBackground);