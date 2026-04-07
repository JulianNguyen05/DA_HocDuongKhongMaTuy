export interface GameQuestion {
  id: number;
  question: string;
  options: Record<string, string>; // Ví dụ: { A: "Đáp án 1", B: "Đáp án 2" }
  correctOption?: string; // Khóa của đáp án đúng (A, B, C...)
  correctAnswer?: string; // Dùng dự phòng nếu data của bạn dùng key này
}


export const MAP_COORDINATES = [
  { top: "65%", left: "11%" }, // 0: BẮT ĐẦU
  { top: "57%", left: "26%" }, // 1: CHẶNG 1
  { top: "23%", left: "23%" }, // 2: CHẶNG 2
  { top: "23%", left: "45%" }, // 3: CHẶNG 3
  { top: "43%", left: "61%" }, // 4: CHẶNG 4
  { top: "22%", left: "80%" }, // 5: CHẶNG 5
];

export const STAGE_PATHS: Record<number, { left: string; top: string }[]> = {
  1: [
    { left: "11%", top: "65%" },
    { left: "22%", top: "62%" },
  ],
  2: [
    { left: "20%", top: "32%" },
    { left: "20%", top: "31%" },
  ],
  3: [
    { left: "26%", top: "28%" },
    { left: "29%", top: "29%" },
    { left: "29%", top: "51%" },
    { left: "41%", top: "51%" },
    { left: "41%", top: "29%" },
  ],
  4: [
    { left: "52%", top: "29%" },
    { left: "52%", top: "50%" },
    { left: "57%", top: "50%" },
  ],
  5: [
    { left: "66%", top: "51%" },
    { left: "66%", top: "25%" },
    { left: "73%", top: "25%" },
  ],
};

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
    { id: 1, left: 0, width: 10, bottom: 25, height: 5 }, // Đứng ở 30
    { id: 2, left: 1, width: 16, bottom: 16, height: 2 }, // Đứng ở 18
    { id: 3, left: 14, width: 20, bottom: 18, height: 2 }, // Đứng ở 20
    { id: 4, left: 23, width: 48, bottom: 41, height: 2 }, // Đứng ở 43
    { id: 5, left: 65, width: 50, bottom: 23, height: 5 }, // Đứng ở 28
    { id: 7, left: 19, width: 47, bottom: -3, height: 5 }, // Đứng ở 2
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
