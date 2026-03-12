// Tâm (0,0) là chính giữa màn hình. 
// Trục X: Âm là qua trái, Dương là qua phải.
// Trục Y: Âm là lên trên (ngọn cây), Dương là xuống dưới (gốc cây).

export const treeCoords = [
  // --- TẦNG ĐỈNH CHÓP ---
  { x: 0, y: -340 },    // 1. Đỉnh cao nhất (Điều 5 LPCM)
  
  // --- TẦNG CAO ---
  { x: -220, y: -280 }, // 2. Nhánh trái trên cao
  { x: 220, y: -280 },  // 3. Nhánh phải trên cao
  { x: -400, y: -180 }, // 4. Rìa ngoài cùng bên trái (trên)
  { x: 400, y: -180 },  // 5. Rìa ngoài cùng bên phải (trên)

  // --- TẦNG GIỮA (Phía trên thân cây) ---
  { x: -150, y: -140 }, // 6. Tán trong bên trái
  { x: 150, y: -140 },  // 7. Tán trong bên phải
  { x: -300, y: -40 },  // 8. Tán giữa bên trái
  { x: 300, y: -40 },   // 9. Tán giữa bên phải
  { x: -480, y: -10 },  // 10. Rìa ngoài cùng bên trái (giữa)
  { x: 480, y: -10 },   // 11. Rìa ngoài cùng bên phải (giữa)

  // --- TẦNG THẤP (Tuyệt đối né thân cây ở tọa độ x từ -150 đến 150) ---
  { x: -240, y: 90 },   // 12. Tán thấp sát rìa trái thân cây
  { x: 240, y: 90 },    // 13. Tán thấp sát rìa phải thân cây
  { x: -400, y: 140 },  // 14. Tán dưới cùng bên trái (sà xuống)
  { x: 400, y: 140 },   // 15. Tán dưới cùng bên phải (sà xuống)
  
  // (Dự phòng thêm nếu dữ liệu của bạn có nhiều hơn 15 điều luật)
  { x: -90, y: -240 },  // 16. Lấp chỗ trống đỉnh trái
  { x: 90, y: -240 },   // 17. Lấp chỗ trống đỉnh phải
  { x: -340, y: 70 },   // 18. Lấp chỗ trống dưới trái
  { x: 340, y: 70 },    // 19. Lấp chỗ trống dưới phải
  { x: 0, y: -180 },    // 20. Ngay chính giữa (cao hơn thân)
];