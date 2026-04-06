export interface GameQuestion {
  id: number;
  question: string;
  options: Record<string, string>; // Ví dụ: { A: "Đáp án 1", B: "Đáp án 2" }
  correctOption?: string; // Khóa của đáp án đúng (A, B, C...)
  correctAnswer?: string; // Dùng dự phòng nếu data của bạn dùng key này
}

export const ADVICE_DATA = [
  {
    id: 1,
    advice:
      "Ma túy là các chất hóa học (tự nhiên hoặc tổng hợp) có tác động mạnh lên hệ thần kinh trung ương, gây ảo giác, kích thích hoặc ức chế, và đặc biệt là gây ra tình trạng lệ thuộc (nghiện).",
  },
  {
    id: 2,
    advice:
      "Sử dụng ma túy dù chỉ một lần cũng có thể kích thích não bộ, phá vỡ hoạt động bình thường của hệ thần kinh, dẫn đến sự lệ thuộc không thể kiểm soát cả về thể chất lẫn tinh thần (nghiện).",
  },
  {
    id: 3,
    advice:
      "Ma túy tác động trực tiếp và tàn phá hệ thần kinh trung ương (não bộ), làm biến đổi cấu trúc và chức năng của não, gây ra các rối loạn về nhận thức, ảo giác và mất kiểm soát hành vi.",
  },
  {
    id: 4,
    advice:
      '"Nói không với ma túy" là thông điệp tuyên truyền cốt lõi, ngắn gọn và mạnh mẽ nhất trên toàn cầu để nâng cao nhận thức cộng đồng về việc kiên quyết tránh xa hiểm họa này.',
  },
  {
    id: 5,
    advice:
      "Ma túy không phân biệt tuổi tác, giới tính hay tầng lớp xã hội. Bất kỳ ai vô tình hay cố ý sử dụng đều sẽ bị tổn hại nghiêm trọng về sức khỏe, tinh thần và mất đi tương lai.",
  },
  {
    id: 6,
    advice:
      "Ma túy đá (Methamphetamine) thường được tổng hợp dưới dạng tinh thể trong suốt hoặc có màu nhạt, trông rất giống những mảnh đá vỡ hay hạt muối to.",
  },
  {
    id: 7,
    advice:
      "Cần sa (Marijuana) thường được chế biến từ hoa, lá khô và thân của cây cần sa, sau đó được băm nhỏ để hút trực tiếp như hút thuốc lá.",
  },
  {
    id: 8,
    advice:
      "Thuốc lắc (MDMA) thường được sản xuất dưới dạng các viên nén nhiều màu sắc rực rỡ, có in các hình thù hoặc logo bắt mắt nhằm thu hút sự tò mò của giới trẻ.",
  },
  {
    id: 9,
    advice:
      "Heroin nguyên chất thường xuất hiện dưới dạng bột tơi xốp màu trắng (hoặc màu nâu/vàng tùy mức độ lẫn tạp chất), không mùi và có vị đắng.",
  },
  {
    id: 10,
    advice:
      "Các loại ma túy tổng hợp (như thuốc lắc, ma túy đá, ketamine) chủ yếu được điều chế hóa học trong các phòng thí nghiệm và thường có dạng viên nén hoặc tinh thể.",
  },
  {
    id: 11,
    advice:
      "Dấu hiệu sinh lý thường thấy ở người dùng ma túy là mắt hay bị đỏ, đồng tử giãn, kèm theo các hành vi bất thường, lén lút, né tránh đám đông hoặc hay nói dối.",
  },
  {
    id: 12,
    advice:
      "Ma túy làm rối loạn hệ tiêu hóa và quá trình chuyển hóa, gây chán ăn, mất ngủ triền miên khiến cơ thể suy kiệt và sút cân nghiêm trọng chỉ trong thời gian ngắn.",
  },
  {
    id: 13,
    advice:
      "Hóa chất trong ma túy làm rối loạn hệ thần kinh, khiến cảm xúc của người dùng thay đổi cực đoan: lúc hưng phấn, bay bổng thái quá, lúc lại trầm cảm, cáu bẳn và dễ kích động.",
  },
  {
    id: 14,
    advice:
      "Rối loạn giấc ngủ (thức trắng nhiều đêm liền) và dễ nổi nóng, mất kiểm soát cảm xúc là những triệu chứng lâm sàng rất phổ biến của người nghiện, đặc biệt là người dùng ma túy đá.",
  },
  {
    id: 15,
    advice:
      "Ma túy tàn phá nội tạng, làm suy giảm hệ miễn dịch trầm trọng, khiến cơ thể luôn trong trạng thái yếu ớt, mệt mỏi và rất dễ mắc các bệnh lây nhiễm.",
  },
  {
    id: 16,
    advice:
      "Độc tính của ma túy tàn phá toàn diện cơ thể người nghiện: làm teo não, hoang tưởng, nhồi máu cơ tim, viêm gan, suy thận và các bệnh hô hấp nghiêm trọng.",
  },
  {
    id: 17,
    advice:
      "Lạm dụng ma túy lâu dài sẽ dẫn đến suy đa tạng, có nguy cơ cao bị sốc thuốc (quá liều) hoặc mắc các bệnh truyền nhiễm (HIV/AIDS do dùng chung kim tiêm), cuối cùng dẫn đến cái chết.",
  },
  {
    id: 18,
    advice:
      "Người nghiện thường vắt kiệt tài chính gia đình để mua ma túy, sinh ra tính bạo lực, bạo hành người thân, làm mất niềm tin và cuối cùng dẫn đến gia đình ly tán, tan vỡ.",
  },
  {
    id: 19,
    advice:
      "Để có tiền thỏa mãn cơn nghiện, người dùng ma túy dễ dàng bị lôi kéo vào con đường phạm pháp như trộm cắp, cướp giật, lừa đảo hoặc buôn bán ma túy, làm mất an ninh trật tự xã hội.",
  },
  {
    id: 20,
    advice:
      "Ma túy làm suy giảm nghiêm trọng trí nhớ, làm mất khả năng tập trung và tư duy, dẫn đến việc người dùng chểnh mảng học hành, thường xuyên trốn học và cuối cùng là bỏ học.",
  },
  {
    id: 21,
    advice:
      'Kỹ năng quan trọng nhất là phải có bản lĩnh nói "Không" một cách dứt khoát. Việc từ chối ngay từ đầu giúp bảo vệ bản thân khỏi bước sa chân đầu tiên vào vực thẳm nghiện ngập.',
  },
  {
    id: 22,
    advice:
      "Buôn bán ma túy là tội phạm hình sự rất nghiêm trọng. Bạn cần báo cáo ngay cho công an, thầy cô hoặc người lớn đáng tin cậy một cách bí mật để có biện pháp ngăn chặn kịp thời.",
  },
  {
    id: 23,
    advice:
      'Hiện nay có nhiều loại ma túy "trá hình" được pha trộn tinh vi vào đồ uống. Tuyệt đối không nhận đồ ăn/thức uống từ người lạ hoặc uống tiếp ly nước đã bị khuất tầm mắt để tự bảo vệ mình.',
  },
  {
    id: 24,
    advice:
      "Người nghiện là người mang bệnh và rất cần sự hỗ trợ y tế, tâm lý. Gia đình không nên bỏ mặc hay che giấu, mà cần kiên nhẫn đưa họ đến các trung tâm cai nghiện để được điều trị đúng cách.",
  },
  {
    id: 25,
    advice:
      "Sức khỏe và tương lai của bạn là tài sản vô giá. Kiên quyết tránh xa ma túy là cách duy nhất, an toàn nhất để bảo vệ chính bản thân, gia đình và có một cuộc sống ý nghĩa.",
  },
];

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
    { id: 1, left: 0, width: 70, bottom: 30, height: 5 }, // Đứng ở 35
    { id: 2, left: 84, width: 30, bottom: 31, height: 5 }, // Đứng ở 36
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
