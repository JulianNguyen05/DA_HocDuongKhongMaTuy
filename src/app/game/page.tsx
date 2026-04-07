"use client";

import { GameQuestion } from "@/lib/constants/gameConstants";

import { useState, useRef, useEffect } from "react";
import { useGameController } from "@/controllers/gameController";
import {
  MAP_COORDINATES,
  STAGE_PLATFORMS,
} from "@/lib/constants/gameConstants";

// Import UI Components (Bạn sẽ tạo các file này trong src/components/game)
import MainMap from "@/components/game/MainMap";
import ParkourGame from "@/components/game/ParkourGame";
import QuestionModal from "@/components/game/QuestionModal";
import StageResultModal from "@/components/game/StageResultModal";
import GameEndOverlay from "@/components/game/GameEndOverlay";
import PortraitLock from "@/components/game/PortraitLock";
import StageReadyPopup from "@/components/game/StageReadyPopup";

// Import Custom Hooks (Bạn sẽ tạo các file này trong src/hooks/game)
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

  // 3. Logic Vật lý Parkour (ẩn giấu hàng trăm dòng code loop 60fps)
  const {
    parkourX,
    parkourY,
    facingRight,
    walkStep,
    isNearChest, // <--- Thêm isNearChest vào đây
    handleMobileInput,
    startMiniGamePosition,
  } = useParkourPhysics(viewMode, visualStageIdx, setToastMsg, setViewMode);

  // --- STATE QUẢN LÝ CÂU HỎI ---
  const [frozenQuestion, setFrozenQuestion] = useState<GameQuestion | null>(
    null,
  );
  const [frozenIdx, setFrozenIdx] = useState<number | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [damageAnim, setDamageAnim] = useState(false);

  const [stageCorrectCount, setStageCorrectCount] = useState(0);
  const [stageIncorrectQuestions, setStageIncorrectQuestions] = useState<
    GameQuestion[]
  >([]);

  // ==========================================
  // CÁC HÀM ĐIỀU KHIỂN LUỒNG GAME
  // ==========================================

  const handleStartGame = () => {
    setHasStarted(true);
    setVisualStageIdx(1);
    // Có thể tự động gọi toggleFullScreen() ở đây nếu muốn
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
    startMiniGamePosition(); // Gọi hàm reset vị trí từ Custom Hook
    setViewMode("MINI_GAME");
  };

  const handleRestartGame = () => {
    setHasStarted(false);
    setVisualStageIdx(0);
    setViewMode("MAIN_MAP");
    setStageCorrectCount(0);
    setStageIncorrectQuestions([]);
    game.resetGame();
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

    const isLastQuestion =
      game.currentQuestionIdx === game.totalQuestionsInStage - 1;
    const currentQuestionSnapshot = game.currentQuestion;

    // Kiểm tra đúng / sai
    const correctKey = currentQuestionSnapshot?.correctOption;
    const isCorrect = key === correctKey;

    setFrozenQuestion(currentQuestionSnapshot as GameQuestion);
    setFrozenIdx(game.currentQuestionIdx);
    setSelectedKey(key);

    if (isCorrect) {
      setStageCorrectCount((prev) => prev + 1);
    } else if (currentQuestionSnapshot) {
      setStageIncorrectQuestions((prev) => [
        ...prev,
        currentQuestionSnapshot as GameQuestion,
      ]);
    }

    game.handleAnswer(key);

    setTimeout(() => {
      setFrozenQuestion(null);
      setFrozenIdx(null);
      setSelectedKey(null);

      if (isLastQuestion) {
        setViewMode("STAGE_RESULT");
      } else {
        startMiniGamePosition(); // Trả nhân vật về vạch xuất phát chặng
        setViewMode("MINI_GAME");
      }
    }, 1500);
  };

  // UI RENDER SIÊU GỌN
  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center touch-none select-none overflow-hidden font-sans">
      {/* Component khóa xoay màn hình đã tách */}
      <PortraitLock />

      <div
        ref={gameContainerRef}
        className={`game-board-scale relative bg-blue-50 overflow-hidden md:rounded-2xl border-0 md:border-8 border-gray-800 shadow-2xl transition-transform flex items-center justify-center mx-auto `
        ${damageAnim ? "animate-damage-shake" : ""} 
        ${isFullscreen ? "max-w-none h-screen w-screen rounded-none border-0" : ""}`}
      >
        {/* Nút Fullscreen */}
        <button
          onClick={toggleFullScreen}
          className="absolute top-4 right-4 z-[60] bg-black/50 text-white px-3 py-2 rounded-lg font-bold"
        >
          {isFullscreen ? "🗗 Thu nhỏ" : "⛶ Toàn màn hình"}
        </button>

        {/* 1. MÀN HÌNH MAP LỚN */}
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

        {/* 2. POPUP CHUẨN BỊ VÀO CHẶNG */}
        {viewMode === "STAGE_READY" && (
          <StageReadyPopup
            stageName={game.currentStage?.stage}
            onStart={startMiniGame}
          />
        )}

        {/* 3. MÀN HÌNH CHƠI PARKOUR & NỀN CỦA QUESTION */}
        {(viewMode === "MINI_GAME" || viewMode === "QUESTION") && (
          <ParkourGame
            visualStageIdx={visualStageIdx}
            parkourX={parkourX}
            parkourY={parkourY}
            facingRight={facingRight}
            walkStep={walkStep}
            isNearChest={isNearChest}
            currentQuestionIdx={game.currentQuestionIdx}
            totalQuestionsInStage={game.totalQuestionsInStage}
            onMobileInput={handleMobileInput}
          />
        )}

        {/* 4. MODAL CÂU HỎI */}
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

        {/* 5. MODAL TỔNG KẾT CHẶNG */}
        {viewMode === "STAGE_RESULT" && (
          <StageResultModal
            correctCount={stageCorrectCount}
            totalQuestions={game.totalQuestionsInStage}
            incorrectQuestions={stageIncorrectQuestions}
            onClose={handleCloseStageResult}
          />
        )}

        {/* 6. OVERLAY KẾT THÚC GAME (THẮNG/THUA) */}
        {(game.gameState === "WON" || game.gameState === "LOST") &&
          viewMode === "MAIN_MAP" && (
            <GameEndOverlay
              gameState={game.gameState}
              onRestart={handleRestartGame}
            />
          )}
      </div>
    </div>
  );
}
