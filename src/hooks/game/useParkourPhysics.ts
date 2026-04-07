import { useState, useEffect, useRef, useCallback } from "react";
import { STAGE_PLATFORMS } from "@/lib/constants/gameConstants";

type ViewMode =
  | "MAIN_MAP"
  | "STAGE_READY"
  | "MINI_GAME"
  | "QUESTION"
  | "STAGE_RESULT";

export function useParkourPhysics(
  viewMode: ViewMode,
  visualStageIdx: number,
  setToastMsg: (msg: string) => void,
  setViewMode: (mode: ViewMode) => void,
) {
  // UI State (Chỉ chứa những gì cần re-render)
  const [parkourX, setParkourX] = useState(5);
  const [parkourY, setParkourY] = useState(50);
  const [facingRight, setFacingRight] = useState(true);
  const [walkStep, setWalkStep] = useState(false);
  const [isNearChest, setIsNearChest] = useState(false);

  // Physics State (Dùng Ref để tránh re-render giật lag)
  const posRef = useRef({ x: 5, y: 50 });
  const velRef = useRef({ x: 0, y: 0 });
  const keysRef = useRef<Set<string>>(new Set());
  const requestRef = useRef<number>(0);
  const isGroundedRef = useRef(false);

  // Hàm Reset vị trí khi bắt đầu màn chơi mới
  const startMiniGamePosition = useCallback(() => {
    const startX = 5;
    const startY = 50;
    posRef.current = { x: startX, y: startY };
    velRef.current = { x: 0, y: 0 };
    setParkourX(startX);
    setParkourY(startY);
    setFacingRight(true);
    setIsNearChest(false);
  }, []);

  // Lắng nghe phím bấm (PC)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Chặn cuộn trang khi ấn nút nhảy hoặc điều hướng
      if (["Space", "KeyW", "KeyA", "KeyD", "KeyE", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.code)) {
        e.preventDefault(); 
      }
      keysRef.current.add(e.code);
    };
    const handleKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.code);

    // Dùng passive: false để cho phép preventDefault hoạt động
    window.addEventListener("keydown", handleKeyDown, { passive: false });
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Lắng nghe Mobile Gamepad
  const handleMobileInput = useCallback(
    (btn: "left" | "right" | "jump" | "open", active: boolean) => {
      const codeMap = {
        left: "KeyA",
        right: "KeyD",
        jump: "Space",
        open: "KeyE",
      };

      if (active) {
        keysRef.current.add(codeMap[btn]);
      } else {
        // CHỐNG LỖI CHẠM QUÁ NHANH: Trì hoãn xóa nút Nhặt/Nhảy 100ms để vòng lặp kịp đọc
        if (btn === "open" || btn === "jump") {
          setTimeout(() => keysRef.current.delete(codeMap[btn]), 100);
        } else {
          keysRef.current.delete(codeMap[btn]);
        }
      }
    },
    [],
  );

  // VÒNG LẶP VẬT LÝ CHÍNH (Chạy 60fps)
  useEffect(() => {
    if (viewMode !== "MINI_GAME") return; // Chỉ chạy vật lý khi đang trong game

    let lastTime = performance.now();
    let walkAnimCounter = 0;

    const gameLoop = (time: number) => {
      const deltaTime = (time - lastTime) / 1000; // Đổi sang giây
      lastTime = time;

      const keys = keysRef.current;
      const pos = posRef.current;
      const vel = velRef.current;
      const platforms =
        STAGE_PLATFORMS[Math.max(1, visualStageIdx)] || STAGE_PLATFORMS[1];

      const charWidth = 5; // Độ rộng nhân vật (%)
      const charHeight = 15; // Chiều cao nhân vật (~15% màn hình)

      // 1. Di chuyển ngang (X)
      const moveSpeed = 30; // Tốc độ di chuyển theo % màn hình / giây
      if (keys.has("KeyA") || keys.has("ArrowLeft")) {
        vel.x = -moveSpeed;
        setFacingRight(false);
      } else if (keys.has("KeyD") || keys.has("ArrowRight")) {
        vel.x = moveSpeed;
        setFacingRight(true);
      } else {
        vel.x = 0;
      }

      // 2. Nhảy (Y)
      if (
        (keys.has("Space") || keys.has("KeyW") || keys.has("ArrowUp")) &&
        isGroundedRef.current
      ) {
        vel.y = 45; // Lực nhảy lên
        isGroundedRef.current = false;
      }

      // 3. Trọng lực
      vel.y -= 90 * deltaTime; // Gia tốc trọng trường kéo xuống

      // 4. Áp dụng vận tốc X và chặn biên + XỬ LÝ ĐỤNG TƯỜNG (Va chạm ngang)
      let newX = pos.x + vel.x * deltaTime;

      if (newX < 0) newX = 0;
      if (newX > 95) newX = 95;

      for (const plat of platforms) {
        // Nhân vật chỉ đụng tường nếu đang nằm trong khoảng chiều cao của khối đó
        const isIntersectingY =
          pos.y < plat.bottom + plat.height && pos.y + charHeight > plat.bottom;

        if (isIntersectingY) {
          // Đi sang PHẢI đập mỏ vào cạnh TRÁI của block
          if (
            vel.x > 0 &&
            pos.x + charWidth <= plat.left &&
            newX + charWidth > plat.left
          ) {
            newX = plat.left - charWidth;
            vel.x = 0;
          }
          // Đi sang TRÁI đập lưng vào cạnh PHẢI của block
          else if (
            vel.x < 0 &&
            pos.x >= plat.left + plat.width &&
            newX < plat.left + plat.width
          ) {
            newX = plat.left + plat.width;
            vel.x = 0;
          }
        }
      }

      // 5. Áp dụng vận tốc Y và Rớt sàn (Va chạm dọc)
      let newY = pos.y + vel.y * deltaTime;
      isGroundedRef.current = false;

      for (let i = 0; i < platforms.length; i++) {
        const plat = platforms[i];
        const isWithinX =
          newX + charWidth >= plat.left && newX <= plat.left + plat.width;
        const isFalling = vel.y <= 0;

        // Tolerance: Frame trước nhân vật ở cao hơn hoặc bằng mặt dưới block
        const isAbovePlat = pos.y >= plat.bottom;

        if (
          isWithinX &&
          isFalling &&
          isAbovePlat &&
          newY <= plat.bottom + plat.height
        ) {
          // Va chạm mặt trên của platform (Đáp đất)
          newY = plat.bottom + plat.height;
          vel.y = 0;
          isGroundedRef.current = true;
        }
      }

      // Vực thẳm (Chết)
      if (newY < -10) {
        setToastMsg("Bạn đã rơi xuống vực!");
        startMiniGamePosition(); // Hồi sinh lại từ đầu
        return;
      }

      // 6. Cập nhật Refs
      pos.x = newX;
      pos.y = newY;

      // 7. Đồng bộ ra UI State (Giới hạn tần suất để tối ưu)
      setParkourX(newX);
      setParkourY(newY);

      // Hiệu ứng bước đi
      if (vel.x !== 0 && isGroundedRef.current) {
        walkAnimCounter++;
        if (walkAnimCounter > 10) {
          // Cứ sau 10 frame đổi ảnh 1 lần
          setWalkStep((prev) => !prev);
          walkAnimCounter = 0;
        }
      } else {
        setWalkStep(false);
      }

      // ============================================
      // 8. XỬ LÝ MỞ RƯƠNG CHUẨN XÁC (ĐÃ SỬA LỖI)
      // ============================================
      
      // Lấy bệ đỡ cuối cùng của màn chơi (nơi đặt rương)
      const lastPlat = platforms[platforms.length - 1];
      
      // Chỉ cần nhân vật chạm vào vùng cách mép trái của rương 5% là cho phép mở
      const nearChestFlag = newX >= lastPlat.left - 5;
      
      setIsNearChest(nearChestFlag);

      // Chống kẹt Unikey và bắt sự kiện chạm màn hình
      const isPressingOpen = keys.has("KeyE") || keys.has("e") || keys.has("E");

      if (nearChestFlag && isPressingOpen) {
        // Xóa nút bấm để tránh mở lặp lại
        keys.delete("KeyE");
        keys.delete("e");
        keys.delete("E");
        setViewMode("QUESTION"); // <== Chuyển màn hình thành công!
      }

      requestRef.current = requestAnimationFrame(gameLoop);
    };

    requestRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [
    viewMode,
    visualStageIdx,
    setToastMsg,
    setViewMode,
    startMiniGamePosition,
  ]);

  return {
    parkourX,
    parkourY,
    facingRight,
    walkStep,
    isNearChest,
    handleMobileInput,
    startMiniGamePosition,
  };
}