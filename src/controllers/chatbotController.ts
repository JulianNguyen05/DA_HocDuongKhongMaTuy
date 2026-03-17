"use server";

import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function getChatbotResponse(query: string) {
  let answer = "";
  const defaultFooter =
    "\n\n---\n*Nếu bạn muốn biết thêm chi tiết về câu hỏi vui lòng liên hệ qua số điện thoại 058. 528181 của Phòng Cảnh sát điều tra tội phạm về ma túy (PC17).*";

  try {
    // ==========================================
    // 1. XỬ LÝ NÚT BẤM (CÂU HỎI CỐ ĐỊNH)
    // ==========================================
    if (query === "q_tac_hai") {
      const cards = await prisma.flashcard.findMany({ take: 3 });
      if (cards.length > 0) {
        answer = "Dưới đây là thông tin của một số loại ma túy phổ biến:\n\n";
        cards.forEach((card) => {
          const sign = card.identification?.length ? card.identification[0] : "Chưa có thông tin nhận biết";
          const warning = card.harmfulEffects?.length ? card.harmfulEffects[0] : "Chưa có thông tin cảnh báo";
          answer += `**${card.name}**\n- 🔍 **Dấu hiệu:** ${sign}\n- ⚠️ **Tác hại:** ${warning}\n\n`;
        });
      } else {
        answer = "Hiện tại hệ thống đang cập nhật dữ liệu về các loại ma túy.";
      }
      return answer + defaultFooter;
    } 
    
    if (query === "q_phap_luat") {
      const laws = await prisma.lawArticle.findMany({ take: 3 });
      if (laws.length > 0) {
        answer = "Một số quy định pháp luật cơ bản về phòng chống ma túy:\n\n";
        laws.forEach((law) => {
          answer += `**Điều ${law.articleNum} - ${law.name}**\n`;
        });
      } else {
        answer = "Hiện tại hệ thống đang cập nhật dữ liệu pháp luật.";
      }
      return answer + defaultFooter;
    } 
    
    if (query === "q_ky_nang") {
      answer = "**Kịch bản phản ứng nhanh và kỹ năng thoát hiểm khi bị lôi kéo:**\n\n1. **Giữ bình tĩnh và từ chối dứt khoát**: Nhìn thẳng vào mắt họ và nói 'Không' một cách thẳng thắn.\n2. **Đánh lạc hướng/Viện cớ**: Tìm một lý do hợp lý để rời đi ngay lập tức.\n3. **Rời khỏi hiện trường**: Di chuyển ngay đến khu vực an toàn, đông người.\n4. **Tìm kiếm sự trợ giúp**: Gọi điện cho người thân hoặc cảnh sát.\n5. **Tuyệt đối không thử dù chỉ 1 lần**: Tránh xa đồ uống lạ tại các buổi tiệc.";
      return answer + defaultFooter;
    }

    // ==========================================
    // 2. XỬ LÝ CHAT THÔNG MINH (TÌM KIẾM TỰ DO)
    // ==========================================
    
    const lowerQuery = query.toLowerCase();

    // A. NHẬN DIỆN Ý ĐỊNH (INTENT)
    const isAskingSign = /dấu hiệu|nhận biết|biểu hiện|cách phát hiện|làm sao biết|nhìn như thế nào/i.test(lowerQuery);
    const isAskingHarm = /tác hại|nguy hiểm|hậu quả|bị gì|chết|ảnh hưởng/i.test(lowerQuery);
    const isAskingLaw = /pháp luật|phạt|tù|điều|khoản|tội|bắt/i.test(lowerQuery);

    // B. LỌC TỪ KHÓA (Bóc tách tên ma túy hoặc luật ra khỏi câu hỏi dài)
    // Thêm rất nhiều từ thừa tiếng Việt vào đây để bot tự động loại bỏ
    const stopWords = /là gì|thế nào|cho tôi biết|của|và|các|những|có|khi|làm sao|để|về|cách|dấu hiệu|nhận biết|biểu hiện|tác hại|nguy hiểm|hậu quả|pháp luật|hình phạt|điều|khoản|tội|mức phạt|bao nhiêu năm/g;
    
    const keyword = lowerQuery
      .replace(stopWords, "")
      .trim()
      .replace(/\s+/g, " "); // Gom nhiều khoảng trắng thành 1 khoảng trắng

    // Nếu người dùng chỉ gõ linh tinh mà lọc xong không còn từ khóa nào
    if (!keyword) {
      return "Xin lỗi, tôi chưa hiểu rõ câu hỏi của bạn. Bạn có thể nói rõ hơn về tên loại ma túy hoặc Điều luật bạn muốn tìm không?" + defaultFooter;
    }

    // C. TRUY VẤN DATABASE & TRẢ LỜI THEO Ý ĐỊNH
    const flashcards = await prisma.flashcard.findMany({
      where: {
        OR: [
          { name: { contains: keyword, mode: "insensitive" } },
          { otherNames: { contains: keyword, mode: "insensitive" } } // Thêm tìm kiếm theo tiếng lóng (nếu có)
        ],
      },
      take: 3,
    });

    if (flashcards.length > 0) {
      flashcards.forEach((card) => {
        answer += `Về **${card.name}**:\n`;

        const sign = card.identification?.length ? card.identification.join("; ") : "Chưa cập nhật";
        const harm = card.harmfulEffects?.length ? card.harmfulEffects.join("; ") : "Chưa cập nhật";

        // Trả lời linh hoạt theo ý định người dùng
        if (isAskingSign && !isAskingHarm) {
          answer += `- 🔍 **Dấu hiệu nhận biết:** ${sign}\n\n`;
        } else if (isAskingHarm && !isAskingSign) {
          answer += `- ⚠️ **Tác hại:** ${harm}\n\n`;
        } else {
          // Nếu hỏi chung chung thì trả lời cả hai
          answer += `- 🔍 **Nhận biết:** ${sign}\n- ⚠️ **Tác hại:** ${harm}\n\n`;
        }
      });
      return answer + defaultFooter;
    }

    // Nếu không thấy ma túy, tìm thử trong luật
    const laws = await prisma.lawArticle.findMany({
      where: {
        OR: [
          { articleNum: { contains: keyword, mode: "insensitive" } },
          { name: { contains: keyword, mode: "insensitive" } },
        ],
      },
      take: 2,
    });

    if (laws.length > 0) {
      answer = `Tôi tìm thấy thông tin pháp luật liên quan đến **"${keyword}"**:\n\n`;
      laws.forEach((law) => {
        answer += `**Điều ${law.articleNum} - ${law.name}**\n\n`;
      });
      return answer + defaultFooter;
    }

    // D. KHÔNG TÌM THẤY GÌ CẢ
    return `Xin lỗi, tôi không tìm thấy thông tin chi tiết về **"${query}"** trong cơ sở dữ liệu hiện tại. Bạn hãy thử dùng từ khóa chính xác hơn (ví dụ: "Heroin", "Cần sa", "Điều 251").` + defaultFooter;

  } catch (error) {
    console.error("Chatbot Error:", error);
    return "Xin lỗi, hệ thống đang bận hoặc quá tải. Vui lòng thử lại sau.";
  }
}