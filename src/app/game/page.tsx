"use client";

import { useState, useEffect, useRef } from "react";
import { useGameController } from "../../controllers/gameController";

// =====================================================================
// DỮ LIỆU GIẢI THÍCH TỪ ADVICE.JSON (Nhúng trực tiếp để dễ quản lý)
// =====================================================================
const ADVICE_DATA = [
  { "id": 1, "advice": "Ma túy là các chất hóa học (tự nhiên hoặc tổng hợp) có tác động mạnh lên hệ thần kinh trung ương, gây ảo giác, kích thích hoặc ức chế, và đặc biệt là gây ra tình trạng lệ thuộc (nghiện)." },
  { "id": 2, "advice": "Sử dụng ma túy dù chỉ một lần cũng có thể kích thích não bộ, phá vỡ hoạt động bình thường của hệ thần kinh, dẫn đến sự lệ thuộc không thể kiểm soát cả về thể chất lẫn tinh thần (nghiện)." },
  { "id": 3, "advice": "Ma túy tác động trực tiếp và tàn phá hệ thần kinh trung ương (não bộ), làm biến đổi cấu trúc và chức năng của não, gây ra các rối loạn về nhận thức, ảo giác và mất kiểm soát hành vi." },
  { "id": 4, "advice": "\"Nói không với ma túy\" là thông điệp tuyên truyền cốt lõi, ngắn gọn và mạnh mẽ nhất trên toàn cầu để nâng cao nhận thức cộng đồng về việc kiên quyết tránh xa hiểm họa này." },
  { "id": 5, "advice": "Ma túy không phân biệt tuổi tác, giới tính hay tầng lớp xã hội. Bất kỳ ai vô tình hay cố ý sử dụng đều sẽ bị tổn hại nghiêm trọng về sức khỏe, tinh thần và mất đi tương lai." },
  { "id": 6, "advice": "Ma túy đá (Methamphetamine) thường được tổng hợp dưới dạng tinh thể trong suốt hoặc có màu nhạt, trông rất giống những mảnh đá vỡ hay hạt muối to." },
  { "id": 7, "advice": "Cần sa (Marijuana) thường được chế biến từ hoa, lá khô và thân của cây cần sa, sau đó được băm nhỏ để hút trực tiếp như hút thuốc lá." },
  { "id": 8, "advice": "Thuốc lắc (MDMA) thường được sản xuất dưới dạng các viên nén nhiều màu sắc rực rỡ, có in các hình thù hoặc logo bắt mắt nhằm thu hút sự tò mò của giới trẻ." },
  { "id": 9, "advice": "Heroin nguyên chất thường xuất hiện dưới dạng bột tơi xốp màu trắng (hoặc màu nâu/vàng tùy mức độ lẫn tạp chất), không mùi và có vị đắng." },
  { "id": 10, "advice": "Các loại ma túy tổng hợp (như thuốc lắc, ma túy đá, ketamine) chủ yếu được điều chế hóa học trong các phòng thí nghiệm và thường có dạng viên nén hoặc tinh thể." },
  { "id": 11, "advice": "Dấu hiệu sinh lý thường thấy ở người dùng ma túy là mắt hay bị đỏ, đồng tử giãn, kèm theo các hành vi bất thường, lén lút, né tránh đám đông hoặc hay nói dối." },
  { "id": 12, "advice": "Ma túy làm rối loạn hệ tiêu hóa và quá trình chuyển hóa, gây chán ăn, mất ngủ triền miên khiến cơ thể suy kiệt và sút cân nghiêm trọng chỉ trong thời gian ngắn." },
  { "id": 13, "advice": "Hóa chất trong ma túy làm rối loạn hệ thần kinh, khiến cảm xúc của người dùng thay đổi cực đoan: lúc hưng phấn, bay bổng thái quá, lúc lại trầm cảm, cáu bẳn và dễ kích động." },
  { "id": 14, "advice": "Rối loạn giấc ngủ (thức trắng nhiều đêm liền) và dễ nổi nóng, mất kiểm soát cảm xúc là những triệu chứng lâm sàng rất phổ biến của người nghiện, đặc biệt là người dùng ma túy đá." },
  { "id": 15, "advice": "Ma túy tàn phá nội tạng, làm suy giảm hệ miễn dịch trầm trọng, khiến cơ thể luôn trong trạng thái yếu ớt, mệt mỏi và rất dễ mắc các bệnh lây nhiễm." },
  { "id": 16, "advice": "Độc tính của ma túy tàn phá toàn diện cơ thể người nghiện: làm teo não, hoang tưởng, nhồi máu cơ tim, viêm gan, suy thận và các bệnh hô hấp nghiêm trọng." },
  { "id": 17, "advice": "Lạm dụng ma túy lâu dài sẽ dẫn đến suy đa tạng, có nguy cơ cao bị sốc thuốc (quá liều) hoặc mắc các bệnh truyền nhiễm (HIV/AIDS do dùng chung kim tiêm), cuối cùng dẫn đến cái chết." },
  { "id": 18, "advice": "Người nghiện thường vắt kiệt tài chính gia đình để mua ma túy, sinh ra tính bạo lực, bạo hành người thân, làm mất niềm tin và cuối cùng dẫn đến gia đình ly tán, tan vỡ." },
  { "id": 19, "advice": "Để có tiền thỏa mãn cơn nghiện, người dùng ma túy dễ dàng bị lôi kéo vào con đường phạm pháp như trộm cắp, cướp giật, lừa đảo hoặc buôn bán ma túy, làm mất an ninh trật tự xã hội." },
  { "id": 20, "advice": "Ma túy làm suy giảm nghiêm trọng trí nhớ, làm mất khả năng tập trung và tư duy, dẫn đến việc người dùng chểnh mảng học hành, thường xuyên trốn học và cuối cùng là bỏ học." },
  { "id": 21, "advice": "Kỹ năng quan trọng nhất là phải có bản lĩnh nói \"Không\" một cách dứt khoát. Việc từ chối ngay từ đầu giúp bảo vệ bản thân khỏi bước sa chân đầu tiên vào vực thẳm nghiện ngập." },
  { "id": 22, "advice": "Buôn bán ma túy là tội phạm hình sự rất nghiêm trọng. Bạn cần báo cáo ngay cho công an, thầy cô hoặc người lớn đáng tin cậy một cách bí mật để có biện pháp ngăn chặn kịp thời." },
  { "id": 23, "advice": "Hiện nay có nhiều loại ma túy \"trá hình\" được pha trộn tinh vi vào đồ uống. Tuyệt đối không nhận đồ ăn/thức uống từ người lạ hoặc uống tiếp ly nước đã bị khuất tầm mắt để tự bảo vệ mình." },
  { "id": 24, "advice": "Người nghiện là người mang bệnh và rất cần sự hỗ trợ y tế, tâm lý. Gia đình không nên bỏ mặc hay che giấu, mà cần kiên nhẫn đưa họ đến các trung tâm cai nghiện để được điều trị đúng cách." },
  { "id": 25, "advice": "Sức khỏe và tương lai của bạn là tài sản vô giá. Kiên quyết tránh xa ma túy là cách duy nhất, an toàn nhất để bảo vệ chính bản thân, gia đình và có một cuộc sống ý nghĩa." }
];

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

type ViewMode = "MAIN_MAP" | "STAGE_READY" | "MINI_GAME" | "QUESTION" | "STAGE_RESULT";

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

  // --- STATE VÀ REF CHO FULLSCREEN ---
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // --- STATE CHO ĐÓNG BĂNG MÀN HÌNH ĐÁP ÁN ---
  const [frozenQuestion, setFrozenQuestion] = useState<any>(null);
  const [frozenIdx, setFrozenIdx] = useState<number | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  // --- STATE CHO TỔNG KẾT CHẶNG ---
  const [stageCorrectCount, setStageCorrectCount] = useState<number>(0);
  const [stageIncorrectQuestions, setStageIncorrectQuestions] = useState<any[]>([]);

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

  // Lắng nghe sự kiện Fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullScreen = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.currentTarget.blur(); 
    if (!document.fullscreenElement) {
      gameContainerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Lỗi khi mở toàn màn hình: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

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

  const [parkourX, setParkourX] = useState(10);
  const [parkourY, setParkourY] = useState(20);
  const [facingRight, setFacingRight] = useState(true);
  const [walkStep, setWalkStep] = useState(false);
  const parkourRef = useRef({
    x: 10, y: 20, vx: 0, vy: 0,
    keys: { left: false, right: false, up: false }
  });

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
      
      if (active && [" ", "w", "a", "d", "e", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
        e.preventDefault();
      }

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

    window.addEventListener("keydown", down, { passive: false });
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [viewMode]);

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
    
    // Tự động bật Toàn Màn Hình
    if (!document.fullscreenElement && gameContainerRef.current) {
      gameContainerRef.current.requestFullscreen().catch((err) => {
        console.error(`Lỗi khi mở toàn màn hình: ${err.message}`);
      });
    }
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
    
    // Xóa điểm ghi nhớ khi chơi lại
    setStageCorrectCount(0);
    setStageIncorrectQuestions([]);
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    game.resetGame();
  };

  // --- XỬ LÝ LƯU TRỮ VÀ HIỂN THỊ ĐÁP ÁN ---
  const handleAnswerSubmit = (key: string) => {
    if (frozenQuestion) return; // Nếu đang trong 1.5s chờ thì khóa không cho bấm tiếp

    const isLastQuestion = game.currentQuestionIdx === game.totalQuestionsInStage - 1;
    const currentQuestionSnapshot = game.currentQuestion;
    
    // Kiểm tra đúng / sai
    const correctKey = currentQuestionSnapshot?.correctOption || currentQuestionSnapshot?.correctOption;
    const isCorrect = key === correctKey;

    // Lưu lại trạng thái câu hỏi hiện tại để "đóng băng" giao diện
    setFrozenQuestion(currentQuestionSnapshot);
    setFrozenIdx(game.currentQuestionIdx);
    setSelectedKey(key);

    // Ghi nhận điểm số và câu sai cho màn hình Tổng Kết
    if (isCorrect) {
      setStageCorrectCount(prev => prev + 1);
    } else if (currentQuestionSnapshot) {
      setStageIncorrectQuestions(prev => [...prev, currentQuestionSnapshot]);
    }

    // Xử lý gửi đáp án để game trừ tim (nếu sai) hoặc cộng điểm
    game.handleAnswer(key);

    // Chờ 1.5s cho người chơi xem kết quả đúng/sai rồi mới tắt màn hình câu hỏi
    setTimeout(() => {
      setFrozenQuestion(null);
      setFrozenIdx(null);
      setSelectedKey(null);

      if (isLastQuestion) {
        // Tới màn hình TỔNG KẾT CHẶNG thay vì về Map Lớn
        setViewMode("STAGE_RESULT");
      } else {
        // Trả nhân vật về vạch xuất phát và TẮT MÀN HÌNH câu hỏi -> Quay về Game
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
        setViewMode("MINI_GAME"); // Quay lại chạy bộ lấy câu tiếp theo
      }
    }, 1500);
  };

  // --- ĐÓNG MÀN HÌNH TỔNG KẾT VÀ QUA MÀN ---
  const handleCloseStageResult = () => {
    const currentMapIndex = visualStageIdx;
    const nextMapIndex = currentMapIndex + 1;
    
    // Cập nhật lên bản đồ lớn
    setViewMode("MAIN_MAP");
    setVisualStageIdx(nextMapIndex <= 5 ? nextMapIndex : currentMapIndex);
    
    // Reset bộ đếm cho chặng mới
    setStageCorrectCount(0);
    setStageIncorrectQuestions([]);
  };

  const currentPos = MAP_COORDINATES[visualStageIdx] || MAP_COORDINATES[0];
  const isNearChest = parkourX >= (Number((STAGE_PLATFORMS[Math.max(1, visualStageIdx)] || STAGE_PLATFORMS[1]).slice(-1)[0]?.left) - 5);

  // Xác định câu hỏi đang cần hiển thị (Lúc đang trả lời thì dùng câu đang bị đóng băng)
  const displayQuestion = frozenQuestion || game.currentQuestion;
  const displayIdx = frozenIdx !== null ? frozenIdx : game.currentQuestionIdx;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center touch-none select-none overflow-hidden font-sans">

      {/* KHÓA XOAY */}
      <div className="portrait-lock absolute inset-0 z-[150] bg-gray-900 text-white flex flex-col items-center justify-center p-6 text-center touch-none">
        <div className="animate-spin duration-1000 mb-6">
          <svg className="w-20 h-20 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-blue-400">Vui lòng xoay ngang!</h2>
        <p className="text-gray-300 text-lg">Trải nghiệm game tốt nhất ở màn hình ngang.</p>
      </div>

      <style>{`
        @media (orientation: landscape) { .portrait-lock { display: none !important; } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .game-board-scale {
          width: 100vw;
          height: 100dvh;
          max-width: 177.78dvh;
          max-height: 56.25vw;
        }
        @media (min-width: 768px) {
          .game-board-scale {
            width: 100%;
            height: 80vh;
            max-width: calc(80vh * 16 / 9);
            max-height: 80vh;
          }
        }

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
      <div
        ref={gameContainerRef}
        className={`game-board-scale relative bg-blue-50 overflow-hidden md:rounded-2xl border-0 md:border-8 border-gray-800 shadow-2xl transition-transform will-change-transform flex items-center justify-center mx-auto ${damageAnim ? "animate-damage-shake" : ""} ${isFullscreen ? "max-w-none h-screen w-screen rounded-none border-0" : ""}`}
      >
        
        {/* NÚT FULLSCREEN (HIỆN TRÊN MỌI THIẾT BỊ) */}
        <button
          onClick={toggleFullScreen}
          className="absolute top-4 right-4 md:bottom-4 md:right-4 md:top-auto z-[60] bg-black/50 hover:bg-black/80 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-colors font-bold shadow-lg border border-white/20 outline-none focus:outline-none"
          title="Bật/Tắt Toàn Màn Hình"
        >
          {isFullscreen ? "🗗 Thu nhỏ" : "⛶ Toàn màn hình"}
        </button>

        <div className="absolute inset-0 z-0 bg-blue-100">
          <img src="/images/game/game-map.png" alt="Bản đồ chính" className="w-full h-full object-cover block absolute inset-0 z-0" />

          {/* TOAST THÔNG BÁO TỪ CHỐI CLICK */}
          {toastMsg && (
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-2 rounded-full font-bold shadow-xl z-[70] animate-bounce whitespace-nowrap">
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
                  <div className="absolute -top-6 md:-top-10 bg-yellow-400 text-yellow-900 text-[10px] md:text-sm font-black px-2 md:px-3 py-1 md:py-1.5 rounded-full whitespace-nowrap animate-pulse shadow-lg border-2 border-yellow-500">
                    Nhấn để vào
                  </div>
                )}
              </div>
            );
          })}

          {/* NÚT KHỞI HÀNH BẮT ĐẦU GAME */}
          {!hasStarted && viewMode === "MAIN_MAP" && (
            <div className="absolute inset-0 z-30 bg-black/40 flex items-center justify-center">
              <button onClick={handleStartGame} className="px-6 md:px-8 py-3 md:py-4 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-black text-xl md:text-2xl rounded-full shadow-xl transform hover:scale-110 transition-transform border-4 border-yellow-600 animate-pulse outline-none focus:outline-none">
                🚀 KHỞI HÀNH
              </button>
            </div>
          )}

          {/* POPUP XÁC NHẬN VÀO CHẶNG */}
          {viewMode === "STAGE_READY" && (
            <div className="absolute inset-0 z-30 bg-black/50 flex flex-col items-center justify-center p-4 animate-fade-in">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl text-center transform hover:scale-105 transition-all">
                <h2 className="text-2xl md:text-3xl font-bold text-blue-800 mb-2">
                  {game.currentStage?.stage || "Chặng Bí Ẩn"}
                </h2>
                <p className="text-sm md:text-base text-gray-600 mb-6">Sẵn sàng khám phá chưa?</p>
                <button onClick={startMiniGame} className="px-6 md:px-8 py-2 md:py-3 bg-green-500 hover:bg-green-600 text-white font-bold text-lg md:text-xl rounded-full shadow-lg transition-colors outline-none focus:outline-none">
                  ▶ BẮT ĐẦU
                </button>
              </div>
            </div>
          )}
        </div>

        {(viewMode === "MINI_GAME" || viewMode === "QUESTION") && (
          <div className="absolute inset-0 z-20 bg-gray-900 animate-fade-in touch-none flex">
            <img
              src={`/images/game/ingame-map${Math.max(1, visualStageIdx)}.png`}
              onError={(e) => (e.currentTarget.src = "/images/game/ingame-map1.png")} // Fallback an toàn
              alt={`Bản đồ Ingame chặng ${visualStageIdx}`}
              className={`w-full h-full ${(visualStageIdx === 4 || visualStageIdx === 5) ? "object-fill" : "object-cover"} transition-all duration-300 ${viewMode === "QUESTION" ? "opacity-50 blur-sm" : ""}`}
            />

            {viewMode === "MINI_GAME" && (
              <div className="absolute top-4 left-4 bg-black/60 text-white px-4 py-2 rounded-lg font-bold text-sm md:text-base hidden md:block z-30">
                ⌨️ Dùng [A/D] di chuyển, [W/Space] Nhảy, [E] Nhặt đồ
              </div>
            )}

            <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-blue-600/90 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-base font-bold shadow-lg z-30 pointer-events-none">
              Câu: {game.currentQuestionIdx + 1} / {game.totalQuestionsInStage}
            </div>

            {/* NHÂN VẬT PARKOUR */}
            <div
              className="absolute w-[50px] md:w-[80px] h-[70px] md:h-[100px] will-change-[bottom,left]"
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
              <div className="absolute transform -translate-x-1/2 bg-yellow-400 text-yellow-900 px-3 py-1 md:px-4 md:py-2 rounded-xl text-xs md:text-base font-bold animate-pulse shadow-lg whitespace-nowrap border-2 border-yellow-600 z-30 hidden md:block"
                style={{
                  bottom: `${(STAGE_PLATFORMS[Math.max(1, visualStageIdx)] || STAGE_PLATFORMS[1]).slice(-1)[0]?.bottom + 20}%`,
                  left: `${Number((STAGE_PLATFORMS[Math.max(1, visualStageIdx)] || STAGE_PLATFORMS[1]).slice(-1)[0]?.left) + Number((STAGE_PLATFORMS[Math.max(1, visualStageIdx)] || STAGE_PLATFORMS[1]).slice(-1)[0]?.width) / 2}%`
                }}>
                <span>Nhấn [E] để nhặt đồ!</span>
              </div>
            )}

            {/* CỤM ĐIỀU KHIỂN GAMEPAD */}
            {viewMode === "MINI_GAME" && (
              <div className="absolute bottom-4 left-0 right-0 px-4 flex justify-between items-end z-[60] pointer-events-none">
                
                {/* Joystick Trái / Phải */}
                <div className="flex gap-1 md:gap-2 pointer-events-auto">
                  <button 
                    onTouchStart={(e) => { e.preventDefault(); handleMobileInput('left', true); }} 
                    onTouchEnd={(e) => { e.preventDefault(); handleMobileInput('left', false); }} 
                    onMouseDown={(e) => { e.preventDefault(); handleMobileInput('left', true); }} 
                    onMouseUp={(e) => { e.preventDefault(); handleMobileInput('left', false); }}
                    onMouseLeave={(e) => { e.preventDefault(); handleMobileInput('left', false); }}
                    className="w-14 h-14 bg-black/50 backdrop-blur-md rounded-full text-white/80 text-xl font-bold flex items-center justify-center active:bg-black/80 active:scale-95 border border-white/20 shadow-lg select-none outline-none"
                  >
                    ◀
                  </button>
                  <button 
                    onTouchStart={(e) => { e.preventDefault(); handleMobileInput('right', true); }} 
                    onTouchEnd={(e) => { e.preventDefault(); handleMobileInput('right', false); }} 
                    onMouseDown={(e) => { e.preventDefault(); handleMobileInput('right', true); }} 
                    onMouseUp={(e) => { e.preventDefault(); handleMobileInput('right', false); }}
                    onMouseLeave={(e) => { e.preventDefault(); handleMobileInput('right', false); }}
                    className="w-14 h-14 bg-black/50 backdrop-blur-md rounded-full text-white/80 text-xl font-bold flex items-center justify-center active:bg-black/80 active:scale-95 border border-white/20 shadow-lg select-none outline-none"
                  >
                    ▶
                  </button>
                </div>

                {/* Nút Hành Động */}
                <div className="flex gap-2 items-end pointer-events-auto">
                  <button 
                    onTouchStart={(e) => { e.preventDefault(); handleMobileInput('open', true); }} 
                    onTouchEnd={(e) => { e.preventDefault(); handleMobileInput('open', false); }}
                    onMouseDown={(e) => { e.preventDefault(); handleMobileInput('open', true); }} 
                    onMouseUp={(e) => { e.preventDefault(); handleMobileInput('open', false); }}
                    onMouseLeave={(e) => { e.preventDefault(); handleMobileInput('open', false); }}
                    className={`w-12 h-12 rounded-full text-[10px] font-black flex items-center justify-center shadow-lg transition-all duration-200 border-2 active:scale-95 select-none outline-none
                      ${isNearChest 
                        ? "bg-yellow-400 text-yellow-900 border-yellow-200 scale-110 animate-pulse" 
                        : "bg-gray-800/60 backdrop-blur-md text-gray-400 border-gray-600/50"}`}
                  >
                    NHẶT
                  </button>
                  <button 
                    onTouchStart={(e) => { e.preventDefault(); handleMobileInput('jump', true); }} 
                    onTouchEnd={(e) => { e.preventDefault(); handleMobileInput('jump', false); }}
                    onMouseDown={(e) => { e.preventDefault(); handleMobileInput('jump', true); }} 
                    onMouseUp={(e) => { e.preventDefault(); handleMobileInput('jump', false); }}
                    onMouseLeave={(e) => { e.preventDefault(); handleMobileInput('jump', false); }}
                    className="w-16 h-16 bg-blue-500/80 backdrop-blur-md text-white rounded-full text-xs font-black flex items-center justify-center active:bg-blue-700 active:scale-95 border-2 border-blue-300 shadow-lg mb-2 select-none outline-none"
                  >
                    NHẢY
                  </button>
                </div>
              </div>
            )}

            {/* BẢNG CÂU HỎI */}
            {viewMode === "QUESTION" && displayQuestion && (
              <div className="absolute inset-0 z-[80] bg-black/70 flex flex-col items-center justify-center p-2 md:p-4">

                {/* HIỆU ỨNG TIM VỠ (-1 MÁU) */}
                {damageAnim && (
                  <div className="absolute z-[90] pointer-events-none flex flex-col items-center justify-center">
                    <span className="text-6xl md:text-8xl drop-shadow-2xl animate-heart-break">💔</span>
                    <span className="text-red-500 text-3xl md:text-4xl font-black mt-2 drop-shadow-lg animate-heart-break stroke-black">-1 TIM</span>
                  </div>
                )}

                <div className={`bg-white p-4 md:p-8 rounded-xl shadow-2xl w-[95%] max-w-2xl max-h-[90vh] md:max-h-[85vh] flex flex-col transition-transform ${damageAnim ? "scale-95 border-4 border-red-500" : "scale-100 animate-fade-in"}`}>
                  
                  {/* Header Câu Hỏi */}
                  <div className="flex justify-between items-center mb-3 md:mb-6 border-b pb-2 md:pb-3 shrink-0">
                    <span className="text-sm md:text-xl font-bold text-blue-800 line-clamp-1">
                      {game.currentStage?.stage || "Chặng Bí Ẩn"}
                    </span>
                    <span className="text-sm md:text-xl font-bold text-red-500 bg-red-50 px-2 md:px-3 py-1 rounded-full border border-red-100 whitespace-nowrap ml-2">
                      ❤️ x {game.hearts}
                    </span>
                  </div>

                  {/* Vùng Cuộn Chứa Nội Dung */}
                  <div className="overflow-y-auto no-scrollbar flex-1 pb-2">
                    <div className="mb-2 text-[10px] md:text-sm font-semibold text-gray-500 bg-gray-100 rounded-full py-0.5 md:py-1 w-fit mx-auto px-3">
                      Câu: {displayIdx + 1} / {game.totalQuestionsInStage}
                    </div>

                    <h2 className="text-base md:text-2xl font-bold text-gray-800 mb-4 md:mb-8 text-center">
                      {displayQuestion.question}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                      {Object.entries(displayQuestion.options).map(([key, value]) => {
                        
                        // LOGIC ĐỔI MÀU NÚT KHI ĐÓNG BĂNG ĐÁP ÁN
                        let btnClass = "p-2 md:p-4 rounded-lg transition-all border-2 shadow-sm text-left flex items-start gap-1 md:gap-3 outline-none";
                        
                        if (frozenQuestion) {
                          const correctKey = displayQuestion.correctOption || displayQuestion.correctAnswer;
                          const isCorrect = correctKey ? key === correctKey : false;
                          const isSelected = key === selectedKey;

                          if (isCorrect) {
                            btnClass += " bg-green-500 border-green-500 text-white font-bold scale-[1.02] shadow-[0_0_20px_rgba(34,197,94,0.8)] z-10";
                          } else if (isSelected) {
                            btnClass += " bg-red-500 border-red-600 text-white font-bold opacity-90 shadow-[0_0_15px_rgba(239,68,68,0.8)]";
                          } else {
                            btnClass += " bg-gray-200 border-gray-300 text-gray-400 font-semibold opacity-50";
                          }
                        } else {
                          btnClass += " bg-gray-50 border-gray-200 text-gray-800 font-semibold hover:bg-blue-600 hover:text-white hover:border-blue-600 cursor-pointer active:scale-95";
                        }

                        return (
                          <button
                            key={key}
                            onClick={() => handleAnswerSubmit(key)}
                            disabled={!!frozenQuestion} // Khóa nút khi đang hiển thị kết quả
                            className={btnClass}
                          >
                            <span className={`font-bold mr-2 ${frozenQuestion ? "" : "text-blue-600"}`}>{key}.</span> 
                            <span className="leading-snug">{value as React.ReactNode}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- MÀN HÌNH TỔNG KẾT CHẶNG (MỚI) --- */}
        {viewMode === "STAGE_RESULT" && (
          <div className="absolute inset-0 z-[110] bg-black/80 flex flex-col items-center justify-center p-2 md:p-4 animate-fade-in touch-auto">
            <div className="bg-white p-4 md:p-8 rounded-2xl shadow-2xl w-[95%] max-w-3xl max-h-[95vh] md:max-h-[90vh] flex flex-col relative border-4 border-blue-400">
              
              <div className="text-center mb-4 md:mb-6 shrink-0">
                <h2 className="text-2xl md:text-4xl font-black text-blue-600 uppercase drop-shadow-sm">Hoàn thành chặng!</h2>
                <div className="mt-2 inline-block bg-blue-100 text-blue-800 font-bold px-4 py-2 rounded-full text-sm md:text-lg border-2 border-blue-200">
                  Số câu trả lời đúng: <span className="text-green-600 text-lg md:text-xl">{stageCorrectCount}</span> / {game.totalQuestionsInStage}
                </div>
              </div>

              {/* Danh sách các câu sai và Lời khuyên */}
              <div className="overflow-y-auto flex-1 mb-4 space-y-3 md:space-y-4 pr-1 md:pr-2 no-scrollbar">
                {stageIncorrectQuestions.length > 0 ? (
                  <>
                    <h3 className="font-bold text-red-500 mb-2 md:text-lg text-center underline underline-offset-4">Ôn tập lại các câu sai:</h3>
                    {stageIncorrectQuestions.map((q, idx) => {
                      const adviceObj = ADVICE_DATA.find(a => a.id === q.id);
                      const correctKey = q.correctOption || q.correctAnswer;
                      
                      return (
                        <div key={idx} className="bg-red-50 p-3 md:p-5 rounded-xl border-l-4 border-red-400 shadow-sm">
                          <p className="font-bold text-gray-800 text-xs md:text-base mb-2">
                            <span className="text-red-500">❌ Câu hỏi:</span> {q.question}
                          </p>
                          <p className="text-xs md:text-sm text-green-700 font-bold mb-2 bg-green-100 p-2 rounded-lg inline-block w-full">
                            ✅ Đáp án đúng: {correctKey}. {q.options[correctKey]}
                          </p>
                          <p className="text-xs md:text-sm text-gray-700 font-medium italic mt-1 leading-relaxed">
                            💡 <span className="text-blue-600 font-bold">Giải thích:</span> {adviceObj?.advice || "Hãy ôn tập kỹ hơn về kiến thức này nhé!"}
                          </p>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <span className="text-6xl md:text-8xl mb-4">🏆</span>
                    <h3 className="text-green-600 font-black text-xl md:text-3xl">Tuyệt vời!</h3>
                    <p className="text-gray-600 font-bold md:text-lg mt-2">Bạn đã trả lời đúng tất cả các câu hỏi trong chặng này!</p>
                  </div>
                )}
              </div>

              <div className="shrink-0 pt-2 border-t border-gray-100">
                <button 
                  onClick={handleCloseStageResult} 
                  className="w-full py-3 md:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-black text-lg md:text-xl rounded-xl shadow-[0_5px_15px_rgba(59,130,246,0.4)] hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all outline-none"
                >
                  🚀 Tiếp tục hành trình
                </button>
              </div>

            </div>
          </div>
        )}

        {/* LỚP PHỦ GAME OVER */}
        {game.gameState === "LOST" && viewMode === "MAIN_MAP" && (
          <div className="absolute inset-0 z-[120] bg-black flex flex-col items-center justify-end p-4 animate-fade-in overflow-hidden">
            <video src="/video/bad-ending.mp4" autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-80 z-0" />
            <div className="relative z-10 flex flex-col items-center mb-6 md:mb-12 text-center">
              <button onClick={handleRestartGame} className="px-6 py-2 md:px-8 md:py-3 bg-red-600 text-white font-bold text-base md:text-lg rounded-full hover:bg-red-700 shadow-[0_0_20px_rgba(220,38,38,0.6)] hover:scale-105 active:scale-95 outline-none focus:outline-none">
                🔄 Chơi lại từ đầu
              </button>
            </div>
          </div>
        )}

        {/* LỚP PHỦ CHIẾN THẮNG */}
        {game.gameState === "WON" && viewMode === "MAIN_MAP" && (
          <div className="absolute inset-0 z-[120] bg-black flex flex-col items-center justify-end p-4 animate-fade-in overflow-hidden">
            <video src="/video/good-ending.mp4" autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-90 z-0" />
            <div className="relative z-10 flex flex-col items-center mb-6 md:mb-12 text-center">
              <button onClick={handleRestartGame} className="px-6 py-2 md:px-8 md:py-3 bg-white text-blue-900 font-bold text-base md:text-lg rounded-full hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.6)] hover:scale-105 active:scale-95 outline-none focus:outline-none">
                🔄 Chơi lại
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}