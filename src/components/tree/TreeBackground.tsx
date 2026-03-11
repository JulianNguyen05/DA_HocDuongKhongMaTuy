"use client";
import { memo } from "react";
import Image from "next/image";

interface Props {
  dataLength?: number; 
}

const TreeBackground = ({ dataLength }: Props) => {
  return (
    <>
      {/* 1. ẢNH TÁN LÁ CÂY (tree5.png) */}
      {/* Để tán lá dài ra và rộng hơn, mình dùng w-full và max-w-[1200px] để nó có thể linh hoạt */}
      <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none w-full max-w-[1100px] flex justify-center items-center">
        <Image 
          src="/images/tree/tree6.png"  
          alt="Tree Leaves" 
          width={1300}    
          height={800}  
          className="object-contain drop-shadow-2xl opacity-90" 
          priority 
        />
      </div>

      {/* 2. ẢNH THÂN CÂY (tree.png) */}
      <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-[40%] z-10 pointer-events-none flex justify-center items-center">
        <Image 
          src="/images/tree/tree.png" 
          alt="Tree Trunk" 
          width={650}
          height={750}  
          className="object-contain drop-shadow-[0_20px_40px_rgba(5,150,105,0.6)]"
          priority 
        />
      </div>
    </>
  );
};

export default memo(TreeBackground);