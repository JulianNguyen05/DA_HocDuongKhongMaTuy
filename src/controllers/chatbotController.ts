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
      answer = "Để xem chi tiết quy định pháp luật, bạn có thể **gõ trực tiếp số Điều** vào khung chat (Ví dụ: *'Chi tiết Điều 247'* hoặc *'Điều 251'*). Hệ thống sẽ hiển thị đầy đủ các Khoản, Điểm và mức phạt tương ứng.";
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

    // B. LỌC TỪ KHÓA
    const stopWords = /là gì|thế nào|cho tôi biết|chi tiết|của|và|các|những|có|khi|làm sao|để|về|cách|dấu hiệu|nhận biết|biểu hiện|tác hại|nguy hiểm|hậu quả|pháp luật|hình phạt|điều|khoản|tội|mức phạt|bao nhiêu năm/g;
    
    let keyword = lowerQuery.replace(stopWords, "").trim().replace(/\s+/g, " ");
    if (!keyword) keyword = lowerQuery.trim(); // Khôi phục nếu xoá nhầm hết từ khóa chính

    // C. TRUY VẤN DATABASE & TRẢ LỜI
    
    // ƯU TIÊN 1: TÌM TRONG PHÁP LUẬT NẾU CÂU HỎI CÓ CHỨA SỐ HOẶC TỪ KHÓA LUẬT
    const matchNumber = query.match(/\d+/);
    if (matchNumber || /pháp luật|tù|phạt|điều|khoản|tội/i.test(lowerQuery)) {
      const lawKeyword = matchNumber ? matchNumber[0] : keyword;

      const laws = await prisma.lawArticle.findMany({
        where: {
          OR: [
            { articleNum: { contains: lawKeyword, mode: "insensitive" } },
            { name: { contains: keyword, mode: "insensitive" } },
          ],
        },
        include: {
          clauses: {
            orderBy: { clauseNum: 'asc' }, // Sắp xếp Khoản 1, 2, 3...
            include: {
              points: {
                orderBy: { pointLetter: 'asc' } // Sắp xếp Điểm a, b, c...
              }
            }
          }
        },
        take: 1, // Lấy 1 Điều chính xác nhất
      });

      if (laws.length > 0) {
        const law = laws[0];
        answer = `Dưới đây là chi tiết quy định về **Điều ${law.articleNum} - ${law.name}**:\n\n`;

        if (law.clauses && law.clauses.length > 0) {
          law.clauses.forEach((clause) => {
            if (clause.isAdditional) {
               answer += `**Hình phạt bổ sung:** ${clause.penaltySummary}\n`;
            } else {
               answer += `**Khoản ${clause.clauseNum}:** ${clause.penaltySummary}\n`;
            }

            if (clause.points && clause.points.length > 0) {
              clause.points.forEach((point) => {
                const prefix = point.pointLetter ? `Điểm ${point.pointLetter})` : "-";
                answer += `  ${prefix} ${point.content}\n`;
              });
            }
            answer += `\n`;
          });
        } else {
          answer += `*(Nội dung chi tiết đang được cập nhật vào cơ sở dữ liệu)*\n`;
        }
        return answer.trimEnd() + defaultFooter;
      }
    }

    // ƯU TIÊN 2: TÌM TRONG BẢNG MA TÚY (FLASHCARD)
    const flashcards = await prisma.flashcard.findMany({
      where: {
        OR: [
          { name: { contains: keyword, mode: "insensitive" } },
          { otherNames: { contains: keyword, mode: "insensitive" } }
        ],
      },
      take: 2,
    });

    if (flashcards.length > 0) {
      flashcards.forEach((card) => {
        answer += `Về **${card.name}**:\n`;

        const sign = card.identification?.length ? card.identification.join(";\n- ") : "Chưa cập nhật";
        const harm = card.harmfulEffects?.length ? card.harmfulEffects.join(";\n- ") : "Chưa cập nhật";

        if (isAskingSign && !isAskingHarm) {
          answer += `- 🔍 **Dấu hiệu nhận biết:**\n- ${sign}\n\n`;
        } else if (isAskingHarm && !isAskingSign) {
          answer += `- ⚠️ **Tác hại:**\n- ${harm}\n\n`;
        } else {
          answer += `- 🔍 **Nhận biết:**\n- ${sign}\n\n- ⚠️ **Tác hại:**\n- ${harm}\n\n`;
        }
      });
      return answer.trimEnd() + defaultFooter;
    }

    // D. KHÔNG TÌM THẤY GÌ CẢ
    return `Xin lỗi, tôi không tìm thấy thông tin chi tiết về **"${query}"** trong cơ sở dữ liệu hiện tại. Bạn hãy thử dùng từ khóa chính xác hơn (ví dụ: "Heroin", "Cần sa", "Điều 247").` + defaultFooter;

  } catch (error) {
    console.error("Chatbot Error:", error);
    return "Xin lỗi, hệ thống đang bận hoặc quá tải. Vui lòng thử lại sau.";
  }
}