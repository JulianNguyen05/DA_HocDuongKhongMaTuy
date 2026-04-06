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
    const handleKeyDown = (e: KeyboardEvent) => keysRef.current.add(e.code);
    const handleKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.code);

    window.addEventListener("keydown", handleKeyDown);
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
      if (active) keysRef.current.add(codeMap[btn]);
      else keysRef.current.delete(codeMap[btn]);
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

      // 4. Áp dụng vận tốc vào tọa độ
      let newX = pos.x + vel.x * deltaTime;
      let newY = pos.y + vel.y * deltaTime;

      // Giới hạn biên màn hình
      if (newX < 0) newX = 0;
      if (newX > 95) newX = 95;

      // 5. Xử lý va chạm với bệ đỡ (Platform)
      isGroundedRef.current = false;
      let nearChestFlag = false;

      for (const plat of platforms) {
        // Kiểm tra hitbox đơn giản
        const isWithinX =
          newX + 5 >= plat.left && newX <= plat.left + plat.width; // 5 là độ rộng tương đối của nhân vật
        const isFalling = vel.y <= 0;
        const isAbovePlat = pos.y >= plat.bottom; // Frame trước còn ở trên nền

        if (isWithinX && isFalling && newY <= plat.bottom + plat.height) {
          // Va chạm mặt trên của platform
          newY = plat.bottom + plat.height;
          vel.y = 0;
          isGroundedRef.current = true;

          // Kiểm tra xem bệ đỡ này có phải là đích đến (rương) không
          if (plat.id > 100 && newX > plat.left + plat.width * 0.5) {
            nearChestFlag = true;
          }
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

      // Mở rương nếu ấn phím E hoặc nút nhặt
      setIsNearChest(nearChestFlag);
      if (nearChestFlag && keys.has("KeyE")) {
        keys.delete("KeyE"); // Chống double click
        setViewMode("QUESTION");
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
