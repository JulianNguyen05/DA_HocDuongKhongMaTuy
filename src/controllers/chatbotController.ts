"use server";

import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function getChatbotResponse(query: string) {
  let answer = "";
  // Câu thông báo bắt buộc ở cuối
  const defaultFooter =
    "\n\n---\n*Nếu bạn muốn biết thêm chi tiết về câu hỏi vui lòng liên hệ qua số điện thoại 058. 528181 của Phòng Cảnh sát điều tra tội phạm về ma túy (PC17).*";

  try {
    // 1. XỬ LÝ CÁC NÚT BẤM CÓ SẴN
    if (query === "q_tac_hai") {
      const cards = await prisma.flashcard.findMany({ take: 3 });
      if (cards.length > 0) {
        answer = "Dưới đây là một số loại ma túy phổ biến:\n\n";
        cards.forEach((card) => {
          // SỬA LỖI Ở ĐÂY: Thay detailedContent bằng harmfulEffects
          const warning =
            card.harmfulEffects && card.harmfulEffects.length > 0
              ? card.harmfulEffects[0]
              : "Chưa có thông tin cảnh báo cụ thể";

          answer += `**${card.name}**\n- ${card.shortDesc}\n- Cảnh báo: ${warning}...\n\n`;
        });
      } else {
        answer = "Hiện tại hệ thống đang cập nhật dữ liệu.";
      }
    } else if (query === "q_phap_luat") {
      const laws = await prisma.lawNode.findMany({ take: 3 });
      if (laws.length > 0) {
        answer = "Một số quy định pháp luật cơ bản:\n\n";
        laws.forEach((law) => {
          answer += `**${law.article} - ${law.name}**\nChi tiết hình phạt vui lòng xem tại Cây Pháp Luật.\n\n`;
        });
      } else {
        answer = "Hiện tại hệ thống đang cập nhật dữ liệu.";
      }
    } else if (query === "q_ky_nang") {
      answer =
        "Kịch bản thoát hiểm khi bị lôi kéo:\n\n1. **Giữ bình tĩnh và từ chối dứt khoát**: Nói 'Không' một cách thẳng thắn.\n2. **Rời khỏi hiện trường**: Tìm cớ hợp lý để đi ngay khỏi nơi đó.\n3. **Tìm kiếm sự trợ giúp**: Di chuyển đến nơi đông người.\n4. **Báo cáo sự việc**: Cung cấp thông tin cho gia đình, nhà trường.";
    }

    // 2. XỬ LÝ NGƯỜI DÙNG TỰ GÕ CÂU HỎI (TÌM KIẾM TRONG DATABASE)
    else {
      // Làm sạch từ khóa (bỏ các từ thừa như "là gì", "tác hại của" để tìm chuẩn hơn)
      const keyword = query
        .toLowerCase()
        .replace(/là gì|thế nào|tác hại của|cho tôi biết/g, "")
        .trim();

      // Tìm trong bảng Flashcard (Tên ma túy hoặc mô tả)
      const flashcards = await prisma.flashcard.findMany({
        where: {
          OR: [
            { name: { contains: keyword, mode: "insensitive" } },
            { shortDesc: { contains: keyword, mode: "insensitive" } },
          ],
        },
        take: 3,
      });

      if (flashcards.length > 0) {
        answer = `Tôi tìm thấy thông tin liên quan đến từ khóa **"${keyword}"**:\n\n`;
        flashcards.forEach((card) => {
          const warning =
            card.harmfulEffects && card.harmfulEffects.length > 0
              ? card.harmfulEffects[0]
              : "Chưa có thông tin cảnh báo cụ thể";

          answer += `**${card.name}**\n- ${card.shortDesc}\n- Cảnh báo: ${warning}...\n\n`;
        });
      } else {
        // Nếu không có trong Flashcard, thử tìm trong Cây Pháp Luật
        const laws = await prisma.lawNode.findMany({
          where: {
            OR: [
              { article: { contains: keyword, mode: "insensitive" } },
              { name: { contains: keyword, mode: "insensitive" } },
            ],
          },
          take: 2,
        });

        if (laws.length > 0) {
          answer = `Tôi tìm thấy thông tin pháp luật liên quan đến **"${keyword}"**:\n\n`;
          laws.forEach((law) => {
            answer += `**${law.article} - ${law.name}**\n*(Bạn có thể xem chi tiết các khung hình phạt tại bản đồ Cây Pháp Luật)*\n\n`;
          });
        } else {
          // Nếu tìm không thấy cả 2 bảng
          answer = `Xin lỗi, tôi không tìm thấy thông tin chi tiết về **"${query}"** trong cơ sở dữ liệu hiện tại. Bạn hãy thử dùng từ khóa ngắn gọn hơn (ví dụ: "Heroin", "Lá khát", "Điều 251").`;
        }
      }
    }

    return answer + defaultFooter;
  } catch (error) {
    console.error("Chatbot Error:", error);
    return "Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau.";
  }
}