import { useState, useRef, useEffect, useCallback } from "react";

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // Lắng nghe sự thay đổi trạng thái fullscreen từ hệ thống (khi user nhấn ESC)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullScreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        if (gameContainerRef.current?.requestFullscreen) {
          await gameContainerRef.current.requestFullscreen();
        }
        // Thử khóa màn hình ngang (Landscape) trên Mobile nếu API hỗ trợ
        if (screen.orientation && "lock" in screen.orientation) {
          try {
            await screen.orientation.lock("landscape");
          } catch (e) {
            console.warn("Trình duyệt không hỗ trợ khóa hướng màn hình.", e);
          }
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.error("Lỗi khi chuyển đổi Fullscreen:", err);
    }
  }, []);

  return {
    isFullscreen,
    toggleFullScreen,
    gameContainerRef,
  };
}
