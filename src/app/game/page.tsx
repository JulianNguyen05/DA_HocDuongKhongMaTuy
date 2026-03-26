"use client";

import { useState, useEffect, useRef } from "react";
import { useGameController } from "../../controllers/gameController";

// --- DANH SÁCH TỌA ĐỘ CÁC CHẶNG (BẢN ĐỒ LỚN) ---
const MAP_COORDINATES = [
  { top: "65%", left: "11%" }, // 0: BẮT ĐẦU
  { top: "57%", left: "26%" }, // 1: CHẶNG 1
  { top: "23%", left: "23%" }, // 2: CHẶNG 2
  { top: "23%", left: "45%" }, // 3: CHẶNG 3
  { top: "43%", left: "61%" }, // 4: CHẶNG 4
  { top: "22%", left: "80%" }, // 5: CHẶNG 5
];

const STAGE_PATHS: Record<number, { left: string, top: string }[]> = {
  1: [{ left: "11%", top: "65%" }, { left: "22%", top: "62%" }],
  2: [{ left: "20%", top: "32%" }, { left: "20%", top: "31%" }],
  3: [
    { left: "26%", top: "28%" },
    { left: "29%", top: "29%" },
    { left: "29%", top: "51%" },
    { left: "41%", top: "51%" },
    { left: "41%", top: "29%" },
  ],
  4: [{ left: "52%", top: "29%" }, { left: "52%", top: "50%" }, { left: "57%", top: "50%" }],
  5: [{ left: "66%", top: "51%" }, { left: "66%", top: "25%" }, { left: "73%", top: "25%" }],
};

type ViewMode = "MAIN_MAP" | "STAGE_READY" | "MINI_GAME" | "QUESTION";

export default function GamePage() {
  const game = useGameController();

  const [viewMode, setViewMode] = useState<ViewMode>("MAIN_MAP");
  const [visualStageIdx, setVisualStageIdx] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [charPos, setCharPos] = useState({ top: "65%", left: "11%" });
  const [moveDuration, setMoveDuration] = useState("0ms");
  const [isMoving, setIsMoving] = useState(false);
  const [mainWalkStep, setMainWalkStep] = useState(false);
  const prevStageIdxRef = useRef(0);

  useEffect(() => {
    if (!isMoving) {
      setMainWalkStep(false);
      return;
    }
    const interval = setInterval(() => {
      setMainWalkStep((prev) => !prev);
    }, 150);
    return () => clearInterval(interval);
  }, [isMoving]);

  // --- CẤU HÌNH BỆ NHẢY PARKOUR TỪNG CHẶNG ---
  const STAGE_PLATFORMS: Record<number, { id: number; left: number; width: number; bottom: number; height: number }[]> = {
    1: [
      { id: 101, left: 0, width: 12, bottom: 32, height: 50 },
      { id: 102, left: 9, width: 10, bottom: 40, height: 50 },
      { id: 103, left: 16, width: 9, bottom: 43, height: 50 },
      { id: 104, left: 24, width: 8, bottom: 38, height: 50 },
      { id: 105, left: 32, width: 8, bottom: 48, height: 50 },
      { id: 198, left: 38, width: 25, bottom: 39, height: 50 },
      { id: 199, left: 60, width: 23, bottom: 42, height: 50 },
      { id: 200, left: 63, width: 8, bottom: 52, height: 50 },
      { id: 201, left: 81, width: 25, bottom: 59, height: 50 },
    ],
    2: [
      { id: 1, left: 0, width: 70, bottom: 35, height: 50 },
      { id: 2, left: 84, width: 30, bottom: 36, height: 50 },
    ],
    3: [
      { id: 1, left: 0, width: 10, bottom: 30, height: 50 },
      { id: 2, left: 1, width: 16, bottom: 18, height: 2 },
      { id: 3, left: 14, width: 20, bottom: 20, height: 2 },
      { id: 4, left: 23, width: 48, bottom: 43, height: 2 },
      { id: 5, left: 65, width: 50, bottom: 28, height: 50 },
      { id: 7, left: 19, width: 47, bottom: 2, height: 50 },
      { id: 6, left: 81, width: 20, bottom: 35, height: 50 },
    ],
    4: [
      { id: 1, left: 0, width: 14, bottom: 36, height: 50 },
      { id: 4, left: 23, width: 8, bottom: 38, height: 5 },
      { id: 7, left: 39, width: 9, bottom: 42, height: 5 },
      { id: 9, left: 56, width: 10, bottom: 44, height: 5 },
      { id: 11, left: 76, width: 9, bottom: 51, height: 5 },
      { id: 12, left: 90, width: 11, bottom: 58, height: 65 },
    ],
    5: [
      { id: 1, left: 0, width: 14, bottom: 36, height: 50 },
      { id: 4, left: 23, width: 8, bottom: 38, height: 5 },
      { id: 7, left: 39, width: 9, bottom: 42, height: 5 },
      { id: 9, left: 56, width: 10, bottom: 44, height: 5 },
      { id: 11, left: 76, width: 9, bottom: 51, height: 5 },
      { id: 12, left: 90, width: 11, bottom: 58, height: 65 },
    ],
  };

  // --- STATE MINI-GAME (PARKOUR) ---
  const [parkourX, setParkourX] = useState(10);
  const [parkourY, setParkourY] = useState(20);
  const [facingRight, setFacingRight] = useState(true);
  const [walkStep, setWalkStep] = useState(false);
  const parkourRef = useRef({
    x: 10, y: 20, vx: 0, vy: 0,
    keys: { left: false, right: false, up: false }
  });

  // --- STATE HIỆU ỨNG SÁT THƯƠNG ---
  const [damageAnim, setDamageAnim] = useState(false);
  const prevHeartsRef = useRef(game.hearts);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isCancelled = false;
    const walkSequence = async () => {
      if (visualStageIdx === 0) {
        setCharPos(MAP_COORDINATES[0]);
        setMoveDuration("0ms");
        setIsMoving(false);
      }
      else if (visualStageIdx > prevStageIdxRef.current) {
        setIsMoving(true);
        const path = STAGE_PATHS[visualStageIdx];
        if (path && path.length > 0) {
          let startPos;
          if (prevStageIdxRef.current > 0 && STAGE_PATHS[prevStageIdxRef.current] && STAGE_PATHS[prevStageIdxRef.current].length > 0) {
            const prevPath = STAGE_PATHS[prevStageIdxRef.current];
            startPos = prevPath[prevPath.length - 1];
          } else {
            startPos = MAP_COORDINATES[prevStageIdxRef.current] || MAP_COORDINATES[0];
          }

          let currentX = parseFloat(startPos.left);
          let currentY = parseFloat(startPos.top);
          let totalDistance = 0;
          const distances = [];

          for (const p of path) {
            const nextX = parseFloat(p.left);
            const nextY = parseFloat(p.top);
            const dist = Math.sqrt(Math.pow(nextX - currentX, 2) + Math.pow(nextY - currentY, 2));
            distances.push(dist);
            totalDistance += dist;
            currentX = nextX;
            currentY = nextY;
          }

          const TOTAL_TIME = 1800;

          for (let i = 0; i < path.length; i++) {
            if (isCancelled) break;
            const p = path[i];
            const timeForThisSegment = totalDistance === 0 ? 0 : (distances[i] / totalDistance) * TOTAL_TIME;

            setMoveDuration(`${timeForThisSegment}ms`);
            setCharPos(p);
            await new Promise((r) => setTimeout(r, timeForThisSegment));
          }
        } else {
          setMoveDuration("1800ms");
          setCharPos(MAP_COORDINATES[visualStageIdx] || MAP_COORDINATES[0]);
          await new Promise((r) => setTimeout(r, 1800));
        }
        if (!isCancelled) setIsMoving(false);
      }
      else if (visualStageIdx < prevStageIdxRef.current) {
        setMoveDuration("0ms");
        setCharPos(MAP_COORDINATES[visualStageIdx] || MAP_COORDINATES[0]);
        setIsMoving(false);
      }
      prevStageIdxRef.current = visualStageIdx;
    };

    walkSequence();
    return () => { isCancelled = true; };
  }, [visualStageIdx]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (game.hearts < prevHeartsRef.current) {
      setDamageAnim(true);
      setTimeout(() => setDamageAnim(false), 1200);
    }
    prevHeartsRef.current = game.hearts;

    if (game.gameState === "WON") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setViewMode("MAIN_MAP");
      setVisualStageIdx(game.hearts >= 3 ? 6 : 7);
    } else if (game.gameState === "LOST") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setViewMode("MAIN_MAP");
    }
  }, [game.gameState, game.hearts]);

  // =========================================================================
  // ĐIỀU KHIỂN PARKOUR (PHYSICS LÊN TỚI 60FPS)
  // =========================================================================
  useEffect(() => {
    if (viewMode !== "MINI_GAME") return;
    let animId: number;

    const loop = () => {
      const state = parkourRef.current;
      const CHAR_W = 6;

      if (state.keys.left) state.vx = -0.5;
      else if (state.keys.right) state.vx = 0.5;
      else state.vx = 0;

      const CHAR_H = 15;
      let nextX = state.x + state.vx;

      const currentStage = Math.max(1, visualStageIdx);
      const platforms = STAGE_PLATFORMS[currentStage] || STAGE_PLATFORMS[1];

      for (const plat of platforms) {
        const pLeft = Number(plat.left);
        const pWidth = Number(plat.width);
        const pBottom = Number(plat.bottom);
        const pHeight = Number(plat.height);

        if (state.vx !== 0) {
          const charLeft = nextX;
          const charRight = nextX + CHAR_W;
          const charBottom = state.y;
          const charTop = state.y + CHAR_H;

          const platLeft = pLeft;
          const platRight = pLeft + pWidth;
          const platTopSurface = pBottom;
          const platBottomSurface = pBottom - pHeight;

          const isXOverlap = charRight > platLeft && charLeft < platRight;
          const isYOverlap = charBottom < platTopSurface - 0.2 && charTop > platBottomSurface;

          if (isXOverlap && isYOverlap) {
            if (state.vx > 0) {
              nextX = platLeft - CHAR_W;
            } else if (state.vx < 0) {
              nextX = platRight;
            }
            state.vx = 0;
          }
        }
      }

      state.x = nextX;

      if (state.x < 0) state.x = 0;
      if (state.x > 95) state.x = 95;

      if (state.vx !== 0) setFacingRight(state.vx > 0);

      state.vy -= 0.15;
      state.y += state.vy;

      let grounded = false;

      for (const plat of platforms) {
        const charLeft = state.x;
        const charRight = state.x + CHAR_W;
        const charBottom = state.y;
        const prevBottom = state.y - state.vy;

        const pLeft = Number(plat.left);
        const pWidth = Number(plat.width);
        const pBottom = Number(plat.bottom);

        if (state.vy < 0 && charRight > pLeft && charLeft < pLeft + pWidth) {
          if (prevBottom >= pBottom && charBottom <= pBottom) {
            state.y = pBottom;
            state.vy = 0;
            grounded = true;
          }
        }
      }

      if (grounded && state.keys.up) {
        state.vy = 2.85;
        state.keys.up = false;
      }

      if (state.y < -30) {
        setToastMsg("Cẩn thận sụp hố nhé!");
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setToastMsg(""), 2000);

        state.x = (platforms[0]?.left || 0) + 5;
        state.y = (platforms[0]?.bottom || 20) + 15;
        state.vy = 0;
      }

      setParkourX(state.x);
      setParkourY(state.y);
      setWalkStep(Math.abs(state.vx) > 0 && grounded && Math.floor(Date.now() / 150) % 2 === 0);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [viewMode, visualStageIdx]);

  useEffect(() => {
    if (viewMode !== "MINI_GAME") return;

    const setKey = (e: KeyboardEvent, active: boolean) => {
      const keys = parkourRef.current.keys;
      const key = e.key.toLowerCase();
      if (key === "a" || key === "arrowleft") keys.left = active;
      if (key === "d" || key === "arrowright") keys.right = active;
      if (key === " " || key === "w" || key === "arrowup") {
        if (active) keys.up = true;
      }
      if (key === "e" && active) {
        const lastPlat = (STAGE_PLATFORMS[Math.max(1, visualStageIdx)] || STAGE_PLATFORMS[1]).slice(-1)[0];
        if (lastPlat && parkourRef.current.x >= lastPlat.left - 5) {
          setViewMode("QUESTION");
        }
      }
    };

    const down = (e: KeyboardEvent) => setKey(e, true);
    const up = (e: KeyboardEvent) => setKey(e, false);

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [viewMode]);

  // --- XỬ LÝ NÚT BẤM TRÊN ĐIỆN THOẠI ---
  const handleMobileInput = (btn: "left" | "right" | "jump" | "open", active: boolean) => {
    const keys = parkourRef.current.keys;
    if (btn === "left") keys.left = active;
    if (btn === "right") keys.right = active;
    if (btn === "jump") {
      if (active) keys.up = true;
    }
    if (btn === "open" && active) {
      const lastPlat = (STAGE_PLATFORMS[Math.max(1, visualStageIdx)] || STAGE_PLATFORMS[1]).slice(-1)[0];
      if (lastPlat && parkourRef.current.x >= lastPlat.left - 5) {
        setViewMode("QUESTION");
      } else {
        setToastMsg("Chưa có đồ để nhặt ở đây!");
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setToastMsg(""), 1500);
      }
    }
  };

  const handleStartGame = () => {
    setHasStarted(true);
    setVisualStageIdx(1);
  };

  const handleMapNodeClick = (idx: number) => {
    if (idx > visualStageIdx) {
      setToastMsg("Bạn cần hoàn thành trận trước!");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setToastMsg(""), 2500);
    } else if (idx === visualStageIdx) {
      setViewMode("STAGE_READY");
    }
  };

  const startMiniGame = () => {
    const platforms = STAGE_PLATFORMS[Math.max(1, visualStageIdx)] || STAGE_PLATFORMS[1];
    setParkourX((platforms[0]?.left || 0) + 5);
    setParkourY((platforms[0]?.bottom || 20) + 5);
    setFacingRight(true);
    setWalkStep(false);
    parkourRef.current = { x: (platforms[0]?.left || 0) + 5, y: (platforms[0]?.bottom || 20) + 5, vx: 0, vy: 0, keys: { left: false, right: false, up: false } };
    setViewMode("MINI_GAME");
  };

  const handleRestartGame = () => {
    setHasStarted(false);
    setVisualStageIdx(0);
    setViewMode("MAIN_MAP");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    game.resetGame();
  };

  const handleAnswerSubmit = (key: string) => {
    const isLastQuestion = game.currentQuestionIdx === game.totalQuestionsInStage - 1;
    const currentMapIndex = visualStageIdx;
    const nextMapIndex = currentMapIndex + 1;

    game.handleAnswer(key);

    setTimeout(() => {
      if (isLastQuestion) {
        setViewMode("MAIN_MAP");
        setVisualStageIdx(nextMapIndex <= 5 ? nextMapIndex : currentMapIndex);
      } else {
        const platforms = STAGE_PLATFORMS[Math.max(1, visualStageIdx)] || STAGE_PLATFORMS[1];
        const startX = (platforms[0]?.left || 0) + 5;
        const startY = (platforms[0]?.bottom || 20) + 5;
        
        setParkourX(startX);
        setParkourY(startY);
        setFacingRight(true);
        setWalkStep(false);
        parkourRef.current = { 
          x: startX, 
          y: startY, 
          vx: 0, vy: 0, 
          keys: { left: false, right: false, up: false } 
        };
        setViewMode("MINI_GAME");
      }
    }, 1500);
  };

  const currentPos = MAP_COORDINATES[visualStageIdx] || MAP_COORDINATES[0];
  
  // Kiểm tra xem nhân vật có đang đứng gần rương/đồ vật không (để làm sáng nút Nhặt trên mobile)
  const isNearChest = parkourX >= (Number((STAGE_PLATFORMS[Math.max(1, visualStageIdx)] || STAGE_PLATFORMS[1]).slice(-1)[0]?.left) - 5);

  return (
    <div className="min-h-screen bg-sky-100 flex items-center justify-center p-0 md:p-4 touch-none select-none overflow-hidden">

      {/* KHÓA XOAY (Yêu cầu màn hình ngang trên điện thoại) */}
      <div className="portrait-lock fixed inset-0 z-[100] bg-gray-900 text-white flex flex-col items-center justify-center p-6 text-center touch-none">
        <div className="animate-spin duration-1000 mb-6">
          <svg className="w-20 h-20 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-blue-400">Vui lòng xoay ngang!</h2>
        <p className="text-gray-300 text-lg">Trải nghiệm game tốt nhất ở màn hình ngang.</p>
      </div>

      <style>{`
        /* Ẩn màn hình khóa nếu thiết bị đang nằm ngang */
        @media (orientation: landscape) { .portrait-lock { display: none !important; } }

        /* Animation khi mất máu */
        @keyframes damageShake {
          0% { transform: translate(4px, 4px) rotate(0deg); }
          20% { transform: translate(-4px, -5px) rotate(-2deg); }
          40% { transform: translate(-5px, 2px) rotate(2deg); }
          60% { transform: translate(5px, 4px) rotate(0deg); }
          80% { transform: translate(2px, -4px) rotate(2deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        .animate-damage-shake { 
          animation: damageShake 0.15s infinite; 
          box-shadow: 0 0 35px rgba(220, 38, 38, 0.8); 
        }

        /* Animation tim vỡ rớt xuống */
        @keyframes brokenHeartFall {
          0% { transform: translateY(-50px) scale(0.5); opacity: 0; }
          20% { transform: translateY(0px) scale(1.5); opacity: 1; }
          80% { transform: translateY(20px) scale(1.2); opacity: 1; }
          100% { transform: translateY(100px) scale(1); opacity: 0; }
        }
        .animate-heart-break {
          animation: brokenHeartFall 1.2s ease-in-out forwards;
        }
      `}</style>

      {/* Rung cả Container nếu dính hiệu ứng */}
      <div className={`relative w-full max-w-5xl h-[100vh] md:h-[70vh] min-h-[320px] bg-blue-50 border-0 md:border-8 border-gray-700 md:rounded-xl overflow-hidden shadow-2xl transition-transform will-change-transform ${damageAnim ? "animate-damage-shake" : ""}`}>

        <div className="absolute inset-0 z-0 bg-blue-100">
          <img src="/images/game/game-map.png" alt="Bản đồ chính" className="w-full h-full object-cover block absolute inset-0 z-0" />

          {/* TOAST THÔNG BÁO TỪ CHỐI CLICK */}
          {toastMsg && (
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded-full font-bold shadow-xl z-50 animate-bounce whitespace-nowrap">
              ⚠️ {toastMsg}
            </div>
          )}

          {/* NHÂN VẬT TRÊN BẢN ĐỒ LỚN */}
          <div
            className="absolute z-10"
            style={{
              top: charPos.top,
              left: charPos.left,
              transitionProperty: "top, left",
              transitionDuration: moveDuration,
              transitionTimingFunction: "linear",
              transform: "translate(-50%, -50%)"
            }}
          >
            <div>
              <img
                src={isMoving && mainWalkStep ? "/images/game/walking.png" : "/images/game/5hearts.png"}
                alt="Nhân vật Map Lớn"
                className="h-[40px] md:h-[60px] w-auto"
              />
            </div>
          </div>

          {/* RƯƠNG TRÊN MAP (TƯƠNG TÁC) */}
          {hasStarted && viewMode === "MAIN_MAP" && MAP_COORDINATES.map((pos, idx) => {
            if (idx === 0) return null; // Bỏ qua vị trí xuất phát
            const isCompleted = idx < visualStageIdx;
            const isActive = idx === visualStageIdx;
            const isLocked = idx > visualStageIdx;

            return (
              <div
                key={idx}
                onClick={() => handleMapNodeClick(idx)}
                style={{
                  top: pos.top,
                  left: pos.left,
                  transform: "translate(-50%, -50%)"
                }}
                className={`absolute z-20 cursor-pointer w-20 h-20 md:w-28 md:h-28 flex items-center justify-center transition-transform duration-300
                  ${isLocked ? "grayscale opacity-60 scale-90" : "opacity-100"}
                  ${isActive ? "scale-110 hover:scale-115" : "hover:scale-105"}
                `}
              >
                <img
                  src={isCompleted ? "/images/game/open_chest.png" : "/images/game/closed_chest.png"}
                  alt={isCompleted ? "Rương mở" : "Rương đóng"}
                  className="w-full h-full object-contain drop-shadow-md transition-transform duration-300"
                />
                {isActive && (
                  <div className="absolute -top-8 md:-top-10 bg-yellow-400 text-yellow-900 text-xs md:text-sm font-black px-3 py-1.5 rounded-full whitespace-nowrap animate-pulse shadow-lg border-2 border-yellow-500">
                    Nhấn để vào
                  </div>
                )}
              </div>
            );
          })}

          {/* NÚT KHỞI HÀNH BẮT ĐẦU GAME */}
          {!hasStarted && viewMode === "MAIN_MAP" && (
            <div className="absolute inset-0 z-30 bg-black/40 flex items-center justify-center">
              <button onClick={handleStartGame} className="px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-black text-2xl rounded-full shadow-xl transform hover:scale-110 transition-transform border-4 border-yellow-600 animate-pulse">
                🚀 KHỞI HÀNH
              </button>
            </div>
          )}

          {/* POPUP XÁC NHẬN VÀO CHẶNG */}
          {viewMode === "STAGE_READY" && (
            <div className="absolute inset-0 z-30 bg-black/50 flex flex-col items-center justify-center p-4 animate-fade-in">
              <div className="bg-white p-8 rounded-2xl shadow-2xl text-center transform hover:scale-105 transition-all">
                <h2 className="text-3xl font-bold text-blue-800 mb-2">
                  {game.currentStage?.stage || "Chặng Bí Ẩn"}
                </h2>
                <p className="text-gray-600 mb-6">Sẵn sàng khám phá chưa?</p>
                <button onClick={startMiniGame} className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold text-xl rounded-full shadow-lg transition-colors">
                  ▶ BẮT ĐẦU CHẠY
                </button>
              </div>
            </div>
          )}
        </div>

        {(viewMode === "MINI_GAME" || viewMode === "QUESTION") && (
          <div className="absolute inset-0 z-20 bg-gray-900 animate-fade-in touch-none">
            <img
              src={`/images/game/ingame-map${Math.max(1, visualStageIdx)}.png`}
              onError={(e) => (e.currentTarget.src = "/images/game/ingame-map1.png")} // Fallback an toàn
              alt={`Bản đồ Ingame chặng ${visualStageIdx}`}
              className={`w-full h-full ${(visualStageIdx === 4 || visualStageIdx === 5) ? "object-fill" : "object-cover"} transition-all duration-300 ${viewMode === "QUESTION" ? "opacity-50 blur-sm" : ""}`}
            />

            {viewMode === "MINI_GAME" && (
              <div className="absolute top-4 left-4 bg-black/60 text-white px-4 py-2 rounded-lg font-bold text-sm md:text-base hidden sm:block z-30">
                ⌨️ Dùng [A/D] di chuyển, [W/Space] Nhảy, [E] Nhặt đồ
              </div>
            )}

            <div className="absolute top-4 right-4 bg-blue-600/90 text-white px-4 py-2 rounded-lg font-bold shadow-lg z-30">
              Câu hỏi: {game.currentQuestionIdx + 1} / {game.totalQuestionsInStage}
            </div>

            {/* NHÂN VẬT PARKOUR */}
            <div
              className="absolute w-[60px] md:w-[80px] h-[80px] md:h-[100px] will-change-[bottom,left]"
              style={{
                bottom: `${parkourY}%`,
                left: `${parkourX}%`,
              }}
            >
              <img
                src={walkStep ? "/images/game/walking.png" : "/images/game/5hearts.png"}
                alt="Nhân vật Parkour"
                className="absolute bottom-0 left-1/2 drop-shadow-xl max-w-none h-full w-auto"
                style={{ transform: facingRight ? "translateX(-50%) scaleX(1)" : "translateX(-50%) scaleX(-1)", transformOrigin: "bottom center" }}
              />
            </div>

            {isNearChest && viewMode === "MINI_GAME" && (
              <div className="absolute transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-xl font-bold animate-pulse shadow-lg whitespace-nowrap border-2 border-yellow-600 z-30 hidden md:block"
                style={{
                  bottom: `${(STAGE_PLATFORMS[Math.max(1, visualStageIdx)] || STAGE_PLATFORMS[1]).slice(-1)[0]?.bottom + 20}%`,
                  left: `${Number((STAGE_PLATFORMS[Math.max(1, visualStageIdx)] || STAGE_PLATFORMS[1]).slice(-1)[0]?.left) + Number((STAGE_PLATFORMS[Math.max(1, visualStageIdx)] || STAGE_PLATFORMS[1]).slice(-1)[0]?.width) / 2}%`
                }}>
                <span>Nhấn [E] để nhặt đồ!</span>
              </div>
            )}

            {/* CỤM ĐIỀU KHIỂN MOBILE GAMEPAD (NÂNG CẤP) */}
            {viewMode === "MINI_GAME" && (
              <div className="absolute bottom-6 left-0 right-0 px-6 flex justify-between items-end z-40 sm:hidden">
                {/* Joystick Trái / Phải */}
                <div className="flex gap-2">
                  <button 
                    onTouchStart={(e) => { e.preventDefault(); handleMobileInput('left', true); }} 
                    onTouchEnd={(e) => { e.preventDefault(); handleMobileInput('left', false); }} 
                    className="w-16 h-16 bg-black/40 backdrop-blur-sm rounded-full text-white text-2xl font-bold flex items-center justify-center active:bg-black/60 border-2 border-white/30 shadow-[0_0_15px_rgba(0,0,0,0.3)]"
                  >
                    ◀
                  </button>
                  <button 
                    onTouchStart={(e) => { e.preventDefault(); handleMobileInput('right', true); }} 
                    onTouchEnd={(e) => { e.preventDefault(); handleMobileInput('right', false); }} 
                    className="w-16 h-16 bg-black/40 backdrop-blur-sm rounded-full text-white text-2xl font-bold flex items-center justify-center active:bg-black/60 border-2 border-white/30 shadow-[0_0_15px_rgba(0,0,0,0.3)]"
                  >
                    ▶
                  </button>
                </div>

                {/* Nút Hành Động (Nhảy / Nhặt) */}
                <div className="flex gap-3 items-end">
                  <button 
                    onTouchStart={(e) => { e.preventDefault(); handleMobileInput('open', true); }} 
                    onTouchEnd={(e) => { e.preventDefault(); handleMobileInput('open', false); }}
                    className={`w-14 h-14 rounded-full text-xs font-black flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.3)] transition-all duration-200 border-4
                      ${isNearChest 
                        ? "bg-yellow-400 text-yellow-900 border-yellow-200 scale-110 animate-pulse" 
                        : "bg-gray-500/50 text-gray-300 border-gray-400/50"}`}
                  >
                    NHẶT
                  </button>
                  <button 
                    onTouchStart={(e) => { e.preventDefault(); handleMobileInput('jump', true); }} 
                    onTouchEnd={(e) => { e.preventDefault(); handleMobileInput('jump', false); }}
                    className="w-20 h-20 bg-blue-500/80 backdrop-blur-sm text-white rounded-full text-sm font-black flex items-center justify-center active:bg-blue-600 border-4 border-blue-200 shadow-[0_0_20px_rgba(0,0,0,0.3)]"
                  >
                    NHẢY
                  </button>
                </div>
              </div>
            )}

            {/* BẢNG CÂU HỎI */}
            {viewMode === "QUESTION" && game.currentQuestion && (
              <div className="absolute inset-0 z-50 bg-black/60 flex flex-col items-center justify-center p-4 overflow-y-auto">

                {/* HIỆU ỨNG TIM VỠ (-1 MÁU) */}
                {damageAnim && (
                  <div className="absolute z-50 pointer-events-none flex flex-col items-center justify-center">
                    <span className="text-8xl drop-shadow-2xl animate-heart-break">💔</span>
                    <span className="text-red-500 text-4xl font-black mt-2 drop-shadow-lg animate-heart-break stroke-black">-1 TIM</span>
                  </div>
                )}

                <div className={`bg-white p-6 md:p-8 rounded-2xl shadow-2xl max-w-lg w-full text-center my-auto transition-transform ${damageAnim ? "scale-95 border-4 border-red-500" : "scale-100 animate-fade-in"}`}>
                  <div className="flex justify-between items-center mb-6 border-b pb-3">
                    <span className="text-xl font-bold text-blue-800">
                      {game.currentStage?.stage || "Chặng Bí Ẩn"}
                    </span>
                    <span className="text-xl font-bold text-red-500 bg-red-100 px-3 py-1 rounded-full shadow-sm">
                      ❤️ x {game.hearts}
                    </span>
                  </div>

                  <div className="mb-6 text-sm font-semibold text-gray-500 bg-gray-100 rounded-full py-2">
                    Tiến độ chặng: Câu {game.currentQuestionIdx + 1} / {game.totalQuestionsInStage}
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-8">
                    {game.currentQuestion.question}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(game.currentQuestion.options).map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => handleAnswerSubmit(key)}
                        disabled={damageAnim} // Không cho spam click khi đang hiện sát thương
                        className="p-4 bg-gray-50 hover:bg-blue-600 hover:text-white text-gray-800 font-semibold rounded-xl transition-all border-2 border-gray-200 hover:border-blue-600 shadow-sm disabled:opacity-50"
                      >
                        <span className="font-bold mr-2">{key}.</span> {value as React.ReactNode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* LỚP PHỦ GAME OVER */}
        {game.gameState === "LOST" && viewMode === "MAIN_MAP" && (
          <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-end p-4 animate-fade-in overflow-hidden">
            <video src="/video/bad-ending.mp4" autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-80 z-0" />
            <div className="relative z-10 flex flex-col items-center mb-12 text-center">
              <button onClick={handleRestartGame} className="px-8 py-3 bg-red-600 text-white font-bold text-lg rounded-full hover:bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.6)] hover:scale-105">
                🔄 Chơi lại từ đầu
              </button>
            </div>
          </div>
        )}

        {/* LỚP PHỦ CHIẾN THẮNG */}
        {game.gameState === "WON" && viewMode === "MAIN_MAP" && (
          <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-end p-4 animate-fade-in overflow-hidden">
            <video src="/video/good-ending.mp4" autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-90 z-0" />
            <div className="relative z-10 flex flex-col items-center mb-12 text-center">
              <button onClick={handleRestartGame} className="px-8 py-3 bg-white text-blue-900 font-bold text-lg rounded-full hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.6)] hover:scale-105">
                🔄 Chơi lại
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}