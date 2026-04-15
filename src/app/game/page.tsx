"use client";

import { useState, useRef, useEffect } from "react";
import { GameQuestion } from "@/lib/constants/gameConstants";
import { useGameController } from "@/controllers/gameController";

// Import UI Components
import MainMap from "@/components/game/MainMap";
import ParkourGame from "@/components/game/ParkourGame";
import QuestionModal from "@/components/game/QuestionModal";
import StageResultModal from "@/components/game/StageResultModal";
import GameEndOverlay from "@/components/game/GameEndOverlay";
import PortraitLock from "@/components/game/PortraitLock";
import StageReadyPopup from "@/components/game/StageReadyPopup";

// Import Custom Hooks
import { useFullscreen } from "@/hooks/game/useFullscreen";
import { useMapMovement } from "@/hooks/game/useMapMovement";
import { useParkourPhysics } from "@/hooks/game/useParkourPhysics";

export type ViewMode =
  | "MAIN_MAP"
  | "STAGE_READY"
  | "MINI_GAME"
  | "QUESTION"
  | "STAGE_RESULT";

export default function GamePage() {
  const game = useGameController();
  const [viewMode, setViewMode] = useState<ViewMode>("MAIN_MAP");
  const [visualStageIdx, setVisualStageIdx] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // 1. Logic Fullscreen
  const { isFullscreen, toggleFullScreen, gameContainerRef } = useFullscreen();

  // 2. Logic Đi bộ trên Map
  const { charPos, moveDuration, isMoving, mainWalkStep } =
    useMapMovement(visualStageIdx);

  // Hàm xử lý khi người chơi chạm vật cản
  const handleObstacleHit = () => {
    const remaining = game.loseOneHeart();
    setDamageAnim(true);
    setTimeout(() => setDamageAnim(false), 500);
    if (remaining <= 0) {
      setViewMode("MAIN_MAP");
    }
  };

  // Hàm xử lý khi người chơi nhảy hụt rớt xuống vực
  const handlePlayerFall = () => {
    const remaining = game.loseOneHeart();
    setDamageAnim(true);
    setTimeout(() => setDamageAnim(false), 500);
    if (remaining <= 0) {
      setViewMode("MAIN_MAP");
    }
    // Nếu còn máu, vị trí sẽ được reset bởi useParkourPhysics
  };

  // 3. Logic Vật lý Parkour
  const {
    parkourX,
    parkourY,
    facingRight,
    walkStep,
    isJumping, 
    isNearChest,
    handleMobileInput,
    startMiniGamePosition,
  } = useParkourPhysics(viewMode, visualStageIdx, setToastMsg, setViewMode, handlePlayerFall, handleObstacleHit);

  // --- STATE QUẢN LÝ CÂU HỎI ---
  const [frozenQuestion, setFrozenQuestion] = useState<GameQuestion | null>(null);
  const [frozenIdx, setFrozenIdx] = useState<number | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [damageAnim, setDamageAnim] = useState(false);

  const [stageCorrectCount, setStageCorrectCount] = useState(0);
  const [stageIncorrectQuestions, setStageIncorrectQuestions] = useState<GameQuestion[]>([]);

  // --- LOGIC NHẠC NỀN (BACKGROUND MUSIC) ---
  const bgmRef = useRef<HTMLAudioElement>(null);
  const currentTrackRef = useRef<number | null>(null);

  useEffect(() => {
    const audio = bgmRef.current;
    if (!audio) return;

    // Nếu game over hoặc chưa bắt đầu -> Dừng nhạc
    if (!hasStarted || game.gameState === "WON" || game.gameState === "LOST") {
      audio.pause();
      return;
    }

    // Xác định track nhạc từ m1 đến m5 (Nếu visualStageIdx = 0 thì mặc định phát m1)
    const trackIndex = visualStageIdx >= 1 && visualStageIdx <= 5 ? visualStageIdx : 1;

    // Nếu nhảy sang map mới -> Đổi nhạc
    if (currentTrackRef.current !== trackIndex) {
      currentTrackRef.current = trackIndex;
      audio.src = `/video/MTS/m${trackIndex}.mp3`;
      audio.volume = 0.6; // Mức âm lượng 60% cho êm tai, bạn có thể chỉnh lại
      audio.load();
      audio.play().catch(e => console.warn("Trình duyệt chặn phát nhạc tự động:", e));
    } 
    // Nếu nhạc đang bị pause (ví dụ sau khi vừa bấm 'Chơi lại' từ rớt đài) -> Tiếp tục phát
    else if (audio.paused) {
      audio.play().catch(e => console.warn("Trình duyệt chặn phát nhạc tự động:", e));
    }
  }, [visualStageIdx, hasStarted, game.gameState]);


  // --- THEO DÕI TRẠNG THÁI GAME OVER ---
  useEffect(() => {
    if (game.gameState === "WON" || game.gameState === "LOST") {
      setViewMode("MAIN_MAP");
      setDamageAnim(false);
    }
  }, [game.gameState]);

  // ==========================================
  // CÁC HÀM ĐIỀU KHIỂN LUỒNG GAME
  // ==========================================

  const handleStartGame = () => {
    setHasStarted(true);
    setVisualStageIdx(1);
    
    if (!document.fullscreenElement && gameContainerRef.current) {
      gameContainerRef.current.requestFullscreen().catch((err) => {
        console.error(`Lỗi khi mở toàn màn hình: ${err.message}`);
      });
    }
  };

  const handleMapNodeClick = (idx: number) => {
    if (idx > visualStageIdx) {
      setToastMsg("Bạn cần hoàn thành trận trước!");
      setTimeout(() => setToastMsg(""), 2500);
    } else if (idx === visualStageIdx) {
      setViewMode("STAGE_READY");
    }
  };

  const startMiniGame = () => {
    startMiniGamePosition();
    setViewMode("MINI_GAME");
  };

  const handleRestartGame = () => {
    // Chơi lại chính chặng hiện tại (không quay về đầu)
    setViewMode("STAGE_READY");
    setStageCorrectCount(0);
    setStageIncorrectQuestions([]);
    game.restartCurrentStage();
  };

  const handleRetryFromFall = () => {
    // Chơi lại chính chặng hiện tại
    setViewMode("STAGE_READY");
    setStageCorrectCount(0);
    setStageIncorrectQuestions([]);
    game.restartCurrentStage();
  };

  const handleCloseStageResult = () => {
    const currentMapIndex = visualStageIdx;
    const nextMapIndex = currentMapIndex + 1;
    setViewMode("MAIN_MAP");
    setVisualStageIdx(nextMapIndex <= 5 ? nextMapIndex : currentMapIndex);
    setStageCorrectCount(0);
    setStageIncorrectQuestions([]);
  };

  const handleAnswerSubmit = (key: string) => {
    if (frozenQuestion) return;

    const isLastQuestion = game.currentQuestionIdx === game.totalQuestionsInStage - 1;
    const currentQuestionSnapshot = game.currentQuestion;

    const correctKey = currentQuestionSnapshot?.correctOption;
    const isCorrect = key === correctKey;

    setFrozenQuestion(currentQuestionSnapshot as GameQuestion);
    setFrozenIdx(game.currentQuestionIdx);
    setSelectedKey(key);

    if (isCorrect) {
      setStageCorrectCount((prev) => prev + 1);
    } else {
      setDamageAnim(true);
      if (currentQuestionSnapshot) {
        setStageIncorrectQuestions((prev) => [
          ...prev,
          currentQuestionSnapshot as GameQuestion,
        ]);
      }
    }

    game.handleAnswer(key);

    setTimeout(() => {
      setDamageAnim(false);
      setFrozenQuestion(null);
      setFrozenIdx(null);
      setSelectedKey(null);

      if (isLastQuestion) {
        setViewMode("STAGE_RESULT");
      } 
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center touch-none select-none overflow-hidden font-sans">
      
      {/* Audio Element Ẩn cho Nhạc Nền */}
      <audio ref={bgmRef} loop className="hidden" />

      <PortraitLock />

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

        /* ĐÃ THÊM: Hiệu ứng làm nét ảnh Pixel (Không bị mờ khi zoom) */
        .pixel-art {
          image-rendering: pixelated; /* Chrome, Edge, Safari */
          image-rendering: crisp-edges; /* Firefox */
          will-change: transform; /* Giúp render mượt mà bằng Card Đồ Họa */
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

      <div
        ref={gameContainerRef}
        className={`game-board-scale relative bg-blue-50 overflow-hidden md:rounded-2xl border-0 md:border-8 border-gray-800 shadow-2xl transition-transform flex items-center justify-center mx-auto 
        ${damageAnim ? "animate-damage-shake" : ""} 
        ${isFullscreen ? "max-w-none h-screen w-screen rounded-none border-0" : ""}`}
      >
        <button
          onClick={(e) => {
            e.currentTarget.blur();
            toggleFullScreen();
          }}
          className="absolute top-4 right-4 z-[60] bg-black/50 hover:bg-black/80 text-white px-3 py-2 rounded-lg font-bold outline-none"
        >
          {isFullscreen ? "🗗 Thu nhỏ" : "⛶ Toàn màn hình"}
        </button>

        {viewMode === "MAIN_MAP" && (
          <MainMap
            charPos={charPos}
            moveDuration={moveDuration}
            isMoving={isMoving}
            mainWalkStep={mainWalkStep}
            visualStageIdx={visualStageIdx}
            hasStarted={hasStarted}
            toastMsg={toastMsg}
            onNodeClick={handleMapNodeClick}
            onStart={handleStartGame}
          />
        )}

        {viewMode === "STAGE_READY" && (
          <StageReadyPopup
            stageName={game.currentStage?.stage}
            onStart={startMiniGame}
          />
        )}

        {(viewMode === "MINI_GAME" || viewMode === "QUESTION") && (
          <ParkourGame
            visualStageIdx={visualStageIdx}
            parkourX={parkourX}
            parkourY={parkourY}
            facingRight={facingRight}
            walkStep={walkStep}
            isNearChest={isNearChest}
            isJumping={isJumping}
            currentQuestionIdx={game.currentQuestionIdx}
            totalQuestionsInStage={game.totalQuestionsInStage}
            hearts={game.hearts}
            damageAnim={damageAnim}
            onMobileInput={handleMobileInput}
          />
        )}

        {viewMode === "QUESTION" && (
          <QuestionModal
            stageName={game.currentStage?.stage || "Chặng Bí Ẩn"}
            hearts={game.hearts}
            totalQuestions={game.totalQuestionsInStage}
            displayQuestion={frozenQuestion || game.currentQuestion}
            displayIdx={
              frozenIdx !== null ? frozenIdx : game.currentQuestionIdx
            }
            frozenQuestion={frozenQuestion}
            selectedKey={selectedKey}
            damageAnim={damageAnim}
            onAnswerSubmit={handleAnswerSubmit}
          />
        )}

        {viewMode === "STAGE_RESULT" && (
          <StageResultModal
            correctCount={stageCorrectCount}
            totalQuestions={game.totalQuestionsInStage}
            incorrectQuestions={stageIncorrectQuestions}
            onClose={handleCloseStageResult}
          />
        )}

        {(game.gameState === "WON" || game.gameState === "LOST") &&
          viewMode === "MAIN_MAP" && (
            <GameEndOverlay
              gameState={game.gameState}
              onRestart={handleRestartGame}
            />
          )}

        {/* Overlay rớt đài đã được thay bằng hệ thống trừ máu + reset vị trí */}
      </div>
    </div>
  );
}