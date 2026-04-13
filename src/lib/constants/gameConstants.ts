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
    { id: 201, left: 81, width: 25, bottom: 54, height: 5 }, // Đứng ở 59
  ],
  2: [
    { id: 1, left: 0, width: 22, bottom: 32, height: 5 }, 
    { id: 2, left: 45, width: 30, bottom: 32, height: 5 }, 
    { id: 3, left: 82, width: 20, bottom: 32, height: 5 }, 
  ],
  3: [
    { id: 1, left: 0, width: 13, bottom: 25, height: 5 }, // Đứng ở 30
    { id: 2, left: 1, width: 16, bottom: 16, height: 2 }, // Đứng ở 18
    { id: 3, left: 14, width: 20, bottom: 18, height: 2 }, // Đứng ở 20
    { id: 4, left: 23, width: 48, bottom: 41, height: 2 }, // Đứng ở 43
    { id: 6, left: 81, width: 20, bottom: 30, height: 5 }, // Đứng ở 35
  ],
  4: [
    { id: 1, left: 0, width: 14, bottom: 31, height: 5 }, // Đứng ở 36
    { id: 4, left: 23, width: 8, bottom: 33, height: 5 }, // Đứng ở 38
    { id: 7, left: 39, width: 9, bottom: 37, height: 5 }, // Đứng ở 42
    { id: 9, left: 56, width: 10, bottom: 39, height: 5 }, // Đứng ở 44
    { id: 11, left: 76, width: 9, bottom: 46, height: 5 }, // Đứng ở 51
    { id: 12, left: 90, width: 11, bottom: 53, height: 5 }, // Đứng ở 58
  ],
  5: [
    { id: 1, left: 0, width: 14, bottom: 31, height: 5 },
    { id: 4, left: 23, width: 8, bottom: 33, height: 5 },
    { id: 7, left: 39, width: 9, bottom: 37, height: 5 },
    { id: 9, left: 56, width: 10, bottom: 39, height: 5 },
    { id: 11, left: 76, width: 9, bottom: 46, height: 5 },
    { id: 12, left: 90, width: 11, bottom: 53, height: 5 },
  ],
};
