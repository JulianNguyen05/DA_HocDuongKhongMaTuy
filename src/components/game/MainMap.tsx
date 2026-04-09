"use client";

import { useState, useEffect } from "react";
import { 
  MAP_COORDINATES, 
  PATH_WAYPOINTS, 
  STAGE_WAYPOINT_INDICES 
} from "@/lib/constants/gameConstants";

interface MainMapProps {
  // Vẫn giữ khai báo các Prop này để file page.tsx không bị báo lỗi
  charPos: { top: string; left: string };
  moveDuration: string;
  isMoving: boolean;
  mainWalkStep: boolean;
  visualStageIdx: number;
  hasStarted: boolean;
  toastMsg: string;
  onNodeClick: (idx: number) => void;
  onStart: () => void;
}

export default function MainMap({
  visualStageIdx,
  hasStarted,
  toastMsg,
  onNodeClick,
  onStart,
}: MainMapProps) {
  // --- TẠO STATE ĐIỀU KHIỂN RIÊNG ĐỂ ĐI THEO ĐƯỜNG ZIG-ZAG ---
  const [localPos, setLocalPos] = useState({ top: "67%", left: "12%" });
  const [localIsMoving, setLocalIsMoving] = useState(false);
  const [localWalkStep, setLocalWalkStep] = useState(false);

  // 1. Đồng bộ vị trí ban đầu (Load map)
  useEffect(() => {
    if (!localIsMoving) {
      const currentStage = Math.max(0, visualStageIdx - 1);
      const waypointIdx = STAGE_WAYPOINT_INDICES[currentStage] || 0;
      setLocalPos(PATH_WAYPOINTS[waypointIdx] || PATH_WAYPOINTS[0]);
    }
  }, [visualStageIdx, localIsMoving]);

  // 2. Tạo hoạt ảnh vung chân liên tục VÀ RÕ RÀNG HƠN
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (localIsMoving) {
      interval = setInterval(() => {
        setLocalWalkStep((prev) => !prev);
      }, 300); // 🕒 TĂNG LÊN 300ms để vung chân chậm lại, dễ nhìn hơn
    } else {
      setLocalWalkStep(false);
    }
    return () => clearInterval(interval);
  }, [localIsMoving]);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // 3. LOGIC LƯỚT QUA TỪNG KHÚC CUA TRÊN PATH_WAYPOINTS
  const handleChestClick = async (idx: number) => {
    if (idx > visualStageIdx || localIsMoving) return;

    // Bấm rương cũ -> Mở ngay lập tức không cần đi lại
    if (idx < visualStageIdx) {
      onNodeClick(idx);
      return;
    }

    // NẾU LÀ RƯƠNG MỚI -> Đi qua từng tọa độ bẻ góc
    setLocalIsMoving(true);
    const startStageIdx = visualStageIdx - 1;
    const endStageIdx = visualStageIdx;       

    const startWaypoint = STAGE_WAYPOINT_INDICES[startStageIdx];
    const endWaypoint = STAGE_WAYPOINT_INDICES[endStageIdx];

    for (let i = startWaypoint + 1; i <= endWaypoint; i++) {
      setLocalPos(PATH_WAYPOINTS[i]);
      await sleep(800); // 🕒 TĂNG LÊN 0.8s (800ms) để nhân vật đi chậm lại ở mỗi khúc cua
    }

    setLocalIsMoving(false);
    onNodeClick(idx); // Đã tới rương -> Báo cho page.tsx mở bảng Tình Huống
  };

  return (
    <>
      <img
        src="/images/game/game-map.png"
        alt="Bản đồ chính"
        className="w-full h-full object-cover block absolute inset-0 z-0"
      />

      {/* TOAST THÔNG BÁO LỖI */}
      {toastMsg && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded-full font-bold shadow-xl z-[70] animate-bounce whitespace-nowrap">
          ⚠️ {toastMsg}
        </div>
      )}

      {/* NHÂN VẬT CHUYỂN ĐỘNG CHẬM RÃI VÀ RÕ HOẠT ẢNH */}
      {hasStarted && (
        <div
          className="absolute z-10"
          style={{
            top: localPos.top,
            left: localPos.left,
            transitionProperty: "top, left",
            transitionDuration: "0.8s", // 🕒 TĂNG LÊN 0.8s (Đồng bộ với sleep 800)
            transitionTimingFunction: "linear",
            transform: "translate(-50%, -50%)",
          }}
        >
          <img
            src={
              localIsMoving && localWalkStep
                ? "/images/game/walking.png"
                : "/images/game/5hearts.png"
            }
            alt="Nhân vật Map Lớn"
            className="h-[40px] md:h-[60px] w-auto drop-shadow-xl"
          />
        </div>
      )}

      {/* CÁC ĐIỂM CHẶNG (RƯƠNG) */}
      {hasStarted &&
        MAP_COORDINATES.map((pos, idx) => {
          if (idx === 0) return null; 
          const isCompleted = idx < visualStageIdx;
          const isActive = idx === visualStageIdx;
          const isLocked = idx > visualStageIdx;

          return (
            <div
              key={idx}
              // GỌI HÀM CỦA CHÚNG TA THAY VÌ onNodeClick TRỰC TIẾP
              onClick={() => handleChestClick(idx)}
              style={{
                top: pos.top,
                left: pos.left,
                transform: "translate(-50%, -50%)",
              }}
              className={`absolute z-20 cursor-pointer w-12 h-12 md:w-28 md:h-28 flex items-center justify-center transition-transform duration-300
              ${isLocked ? "grayscale opacity-60 scale-90" : "opacity-100"}
              ${isActive && !localIsMoving ? "scale-110 hover:scale-115" : "hover:scale-105"}
            `}
            >
              <img
                src={
                  isCompleted
                    ? "/images/game/open_chest.png"
                    : "/images/game/closed_chest.png"
                }
                alt={isCompleted ? "Rương mở" : "Rương đóng"}
                className="w-full h-full object-contain drop-shadow-md transition-transform duration-300"
              />
              {isActive && !localIsMoving && (
                <div className="absolute -top-6 md:-top-10 bg-yellow-400 text-yellow-900 text-[10px] md:text-sm font-black px-2 md:px-3 py-1 md:py-1.5 rounded-full whitespace-nowrap animate-pulse shadow-lg border-2 border-yellow-500">
                  Nhấn để vào
                </div>
              )}
            </div>
          );
        })}

      {/* NÚT BẮT ĐẦU */}
      {!hasStarted && (
        <div className="absolute inset-0 z-30 bg-black/40 flex items-center justify-center">
          <button
            onClick={onStart}
            className="px-6 md:px-8 py-3 md:py-4 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-black text-xl md:text-2xl rounded-full shadow-xl transform hover:scale-110 transition-transform border-4 border-yellow-600 animate-pulse outline-none focus:outline-none"
          >
            🚀 KHỞI HÀNH
          </button>
        </div>
      )}
    </>
  );
}