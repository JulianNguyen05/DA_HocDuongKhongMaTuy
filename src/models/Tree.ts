// 1. Cấp độ 3: ĐIỂM (Tình tiết định khung)
export interface LawPointData {
  id: string;
  pointLetter: string | null; // Ví dụ: "a", "b", "c". Có thể null nếu khoản đó không chia điểm
  content: string;            // Nội dung chi tiết của điểm đó
}

// 2. Cấp độ 2: KHOẢN (Khung hình phạt)
export interface LawClauseData {
  id: string;
  clauseNum: number;          // Số khoản: 1, 2, 3...
  penaltySummary: string;     // Tóm tắt mức phạt (VD: "Phạt tù từ 03 năm đến 07 năm")
  isAdditional: boolean;      // Hình phạt bổ sung hay không? (true/false)
  points: LawPointData[];     // Mảng chứa các Điểm thuộc Khoản này
}

// 3. Cấp độ 1: ĐIỀU LUẬT (Thay thế cho LawNodeData cũ)
export interface LawArticleData {
  id: string;
  articleNum: string;         // Số điều (Thay cho trường 'article' cũ)
  name: string;               // Tên tội danh
  x: number;                  // Tọa độ X (Lưu ý: Đã đổi sang kiểu number thay vì string)
  y: number;                  // Tọa độ Y (Lưu ý: Đã đổi sang kiểu number thay vì string)
  clauses: LawClauseData[];   // Mảng chứa các Khoản thuộc Điều này (Thay cho trường 'details' cũ)
}