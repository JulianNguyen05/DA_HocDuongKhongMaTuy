import { useState, useEffect } from "react";
import { MAP_COORDINATES } from "@/lib/constants/gameConstants";

export function useMapMovement(visualStageIdx: number) {
  const [charPos, setCharPos] = useState({ top: "65%", left: "11%" });
  const [moveDuration, setMoveDuration] = useState("0s");
  const [isMoving, setIsMoving] = useState(false);
  const [mainWalkStep, setMainWalkStep] = useState(false);

  // Cập nhật vị trí nhân vật khi visualStageIdx thay đổi
  useEffect(() => {
    const targetPos = MAP_COORDINATES[visualStageIdx] || MAP_COORDINATES[0];

    // Nếu vị trí hiện tại đã khớp đích, không làm gì cả
    if (charPos.top === targetPos.top && charPos.left === targetPos.left) {
      return;
    }

    requestAnimationFrame(() => {
      setIsMoving(true);
      setMoveDuration("2s"); // Thời gian di chuyển 2 giây
      setCharPos(targetPos);
    });

    // Hiệu ứng thay đổi ảnh sprite lúc đi bộ
    const walkInterval = setInterval(() => {
      setMainWalkStep((prev) => !prev);
    }, 200);

    // Dừng di chuyển sau 2 giây
    const moveTimeout = setTimeout(() => {
      // Cũng bọc các lệnh dừng vào requestAnimationFrame cho đồng bộ
      requestAnimationFrame(() => {
        setIsMoving(false);
        setMainWalkStep(false);
        setMoveDuration("0s"); // Reset duration
      });
      clearInterval(walkInterval);
    }, 2000);

    return () => {
      clearInterval(walkInterval);
      clearTimeout(moveTimeout);
    };
  }, [visualStageIdx, charPos.top, charPos.left]);

  return { charPos, moveDuration, isMoving, mainWalkStep };
}
