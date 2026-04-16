export interface GameQuestion {
  id: number;
  question: string;
  options: Record<string, string>; // Ví dụ: { A: "Đáp án 1", B: "Đáp án 2" }
  correctOption?: string; // Khóa của đáp án đúng (A, B, C...)
  correctAnswer?: string; // Dùng dự phòng nếu data của bạn dùng key này
  reference?: string;
}


// 1. TỌA ĐỘ CÁC RƯƠNG (Điều chỉnh lại để rương nằm CHÍNH GIỮA mặt đường xám)
export const MAP_COORDINATES = [
  { top: "67%", left: "12%" }, // 0: BẮT ĐẦU
  { top: "54%", left: "24%" }, // 1: CHẶNG 1
  { top: "28%", left: "29%" }, // 2: CHẶNG 2
  { top: "28%", left: "45%" }, // 3: CHẶNG 3
  { top: "52%", left: "62%" }, // 4: CHẶNG 4
  { top: "25%", left: "76%" }, // 5: CHẶNG 5
];

// 2. ĐƯỜNG ĐI ZIG-ZAG (Góc cua 90 độ bám sát nét vẽ của map)
export const PATH_WAYPOINTS = [
  { top: "67%", left: "12%" }, // 0. Bắt đầu
  { top: "67%", left: "24%" }, // 1. Khúc cua 1: Rẽ lên
  { top: "54%", left: "24%" }, // 2. Đi qua: CHẶNG 1
  { top: "28%", left: "24%" }, // 3. Khúc cua 2: Rẽ phải
  { top: "28%", left: "29%" }, // 4. Đi qua: CHẶNG 2
  { top: "28%", left: "34%" }, // 5. Khúc cua 3: Rẽ xuống
  { top: "52%", left: "34%" }, // 6. Khúc cua 4: Rẽ phải
  { top: "52%", left: "45%" }, // 7. Khúc cua 5: Đi ngang qua nhà -> Rẽ lên
  { top: "28%", left: "45%" }, // 8. Đi qua: CHẶNG 3 (Nằm ở góc cua)
  { top: "28%", left: "54%" }, // 9. Khúc cua 6: Rẽ xuống
  { top: "52%", left: "54%" }, // 10. Khúc cua 7: Rẽ phải
  { top: "52%", left: "62%" }, // 11. Đi qua: CHẶNG 4
  { top: "52%", left: "68%" }, // 12. Khúc cua 8: Rẽ lên
  { top: "48%", left: "68%" }, // 13. Khúc cua 9 (Ngã ba): Đi thẳng lên
  { top: "25%", left: "68%" }, // 14. Khúc cua 10: Rẽ phải
  { top: "25%", left: "76%" }, // 15. Đi qua: CHẶNG 5
  { top: "25%", left: "86%" }, // 16. Tới KẾT THÚC 1
];

// (Tùy chọn) Nhánh phụ cho Kết Thúc 2
export const PATH_TO_ENDING_2 = [
  { top: "48%", left: "68%" }, // Rẽ phải từ ngã ba (Điểm số 13 ở mảng trên)
  { top: "48%", left: "86%" }, // Tới KẾT THÚC 2
];

// 3. KẾT NỐI: Rương số mấy sẽ tương ứng với Waypoint số mấy?
export const STAGE_WAYPOINT_INDICES = [
  0,  // Chặng Bắt đầu = WP 0
  2,  // Chặng 1 = WP 2
  4,  // Chặng 2 = WP 4
  8,  // Chặng 3 = WP 8
  11, // Chặng 4 = WP 11
  15, // Chặng 5 = WP 15
];

export const STAGE_PLATFORMS: Record<
  number,
  { id: number; left: number; width: number; bottom: number; height: number }[]
> = {
  1: [
    { id: 101, left: 0, width: 12, bottom: 27, height: 5 }, // Đứng ở 32
    { id: 102, left: 9, width: 10, bottom: 35, height: 5 }, // Đứng ở 40
    { id: 103, left: 16, width: 9, bottom: 38, height: 5 }, // Đứng ở 43
    { id: 104, left: 24, width: 8, bottom: 33, height: 5 }, // Đứng ở 38
    { id: 105, left: 32, width: 8, bottom: 43, height: 5 }, // Đứng ở 48
    { id: 198, left: 38, width: 25, bottom: 34, height: 5 }, // Đứng ở 39
    { id: 199, left: 60, width: 23, bottom: 37, height: 5 }, // Đứng ở 42
    { id: 200, left: 63, width: 8, bottom: 47, height: 5 }, // Đứng ở 52
    { id: 201, left: 81, width: 25, bottom: 34, height: 25 }, // Đứng ở 59
    { id: 202, left: 56, width: 3, bottom: 39, height: 7 }, // Thung  rac
    { id: 203, left: 85, bottom: 59, width: 9, height: 9 },  // bệ đở cuối 
  ],
  // Map 2: Cổng Đại Học Nha Trang - đường lát đá phẳng sát đáy ảnh
  2: [
    { id: 1, left: 0, width: 100, bottom: 6, height: 4 },
    { id: 2, left: 61, bottom: 9, width: 4, height: 8 },  // Thùng rác 
    { id: 3, left: 80, bottom: 9, width: 8, height: 8 },  // bệ đở cuối 
  ],
  3: [
    { id: 1, left: 0, width: 13, bottom: 25, height: 5 }, // Đứng ở 30
    { id: 2, left: 1, width: 16, bottom: 16, height: 2 }, // Đứng ở 18
    { id: 3, left: 14, width: 20, bottom: 18, height: 2 }, // Đứng ở 20
    { id: 4, left: 23, width: 48, bottom: 41, height: 2 }, // Đứng ở 43
    { id: 5, left: 21, width: 45, bottom: 1, height: 2 }, // Đứng ở 43
    { id: 7, left: 63, width: 25, bottom: 1, height: 25 }, // Đứng ở 43
    { id: 6, left: 81, width: 20, bottom: 30, height: 5 }, // Đứng ở 35
    { id: 8, left: 40, bottom: 3, width: 4, height: 8 },// Thùng rác 
    { id: 9, left: 86, bottom: 36, width: 9, height: 9 } // rương cuối 
  ],
  // Map 4: Tòa nhà Trường Học - sân gạch phẳng rộng sát đáy ảnh
  4: [
    { id: 1, left: 0, width: 100, bottom: 17, height: 4 },
    { id: 3, left: 42, width: 7.1, bottom: 21, height: 8 },
    { id: 2, left: 88, width: 13, bottom: 21, height: 4 },   // Bệ rương cuối map (nhân vật phải đi tới đây)
  ],
  5: [
    { id: 1, left: 0, width: 14, bottom: 31, height: 5 },
    { id: 4, left: 25, width: 6, bottom: 33, height: 5 },
    { id: 7, left: 41, width: 6.2, bottom: 37, height: 5 },
    { id: 8, left: 30, width: 2.5, bottom: 36, height: 8 }, // thùng rác 
    { id: 9, left: 56, width: 10, bottom: 39, height: 5 },
    { id: 11, left: 76, width: 9, bottom: 46, height: 5 },
    { id: 12, left: 90, width: 11, bottom: 53, height: 5 },
  ],
};

// ============================================
// VẬT CẢN (OBSTACLES) - Chạm vào sẽ bị trừ 1 máu
// type: "canxa" -> canxa.png, "kim" -> Kim.png, "thungrac" -> ThungRac.png, "mathuy" -> mathuy.png
// ============================================
export const OBSTACLE_IMAGE_MAP: Record<string, string> = {
  canxa: "/images/game/canxa.png",
  kim: "/images/game/Kim.png",
  thungrac: "/images/game/ThungRac.png",
  mathuy: "/images/game/mathuy.png",
};

export const STAGE_OBSTACLES: Record<
  number,
  { id: number; type: string; left: number; bottom: number; width: number; height: number }[]
> = {
  // Map 1
  1: [
    { id: 1001, type: "canxa", left: 40, bottom: 39, width: 5, height: 8 },
    { id: 1002, type: "kim", left: 70, bottom: 42, width: 5, height: 10 },
    { id: 1003, type: "thungrac", left: 55.5, bottom: 39, width: 4, height: 8 },
    { id: 1004, type: "mathuy", left: 20, bottom: 40, width: 5, height: 8 },
  ],
  // Map 2: mặt bệ = 16
  2: [
    { id: 2001, type: "kim", left: 73, bottom: 10, width: 7, height: 10 },
    { id: 2002, type: "canxa", left: 45, bottom: 9, width: 5, height: 8 },
    { id: 2003, type: "thungrac", left: 60, bottom: 9, width: 6, height: 8 },
    { id: 2004, type: "mathuy", left: 27, bottom: 9, width: 5, height: 8 },
  ],
  // Map 3
  3: [
    { id: 3001, type: "thungrac", left: 40, bottom: 3, width: 4, height: 8 },
    { id: 3002, type: "kim", left: 40, bottom: 43, width: 5, height: 8 },
    { id: 3003, type: "canxa", left: 19, bottom: 18, width: 5, height: 8 },
    { id: 3004, type: "mathuy", left: 30, bottom: 43, width: 5, height: 8 },
  ],
  // Map 4: mặt bệ = 21
  4: [
    { id: 4001, type: "canxa", left: 55, bottom: 45, width: 5, height: 8 },
    { id: 4002, type: "kim", left: 55, bottom: 21, width: 5, height: 8 },
    { id: 4003, type: "thungrac", left: 42, bottom: 21, width: 4, height: 8 },
    { id: 4005, type: "thungrac", left: 46, bottom: 21, width: 3.8, height: 8 },
    { id: 4004, type: "mathuy", left: 28, bottom: 21, width: 5, height: 8 },
  ],
  // Map 5
  5: [
    { id: 5001, type: "thungrac", left: 30, width: 3, bottom: 36, height: 8 },
    { id: 5002, type: "canxa", left: 38, bottom: 40, width: 5, height: 7 },
    { id: 5003, type: "kim", left: 62, bottom: 44, width: 5, height: 8 },
    { id: 5004, type: "mathuy", left: 80, bottom: 51, width: 5, height: 8 },
  ],
};
