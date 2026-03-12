import { getTreeLaws } from "@/controllers/treeController";
import LawTree from "@/components/tree/LawTree";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cây Pháp Luật",
  description: "Bản đồ tư duy tương tác về các khung hình phạt ma túy.",
};

export default async function TreePage() {
  const lawsData = await getTreeLaws();

  return (
    // ✅ Đã sửa: Thay h-screen thành min-h-screen và XÓA overflow-hidden
    <div className="min-h-screen flex flex-col bg-[#D1FAE0] pt-32"> 
      
      {/* Header thu gọn lại một chút để nhường chỗ cho đồ họa */}
      <div className="text-center shrink-0 relative z-10 px-4 mb-2 md:mb-6">
        <h1 className="text-3xl md:text-5xl font-black text-emerald-900 mb-2 uppercase tracking-tight">
          Cây Pháp Luật
        </h1>
        <p className="text-emerald-700 font-medium text-sm md:text-base max-w-2xl mx-auto">
          Chọn vào lá để xem chi tiết các khung hình phạt liên quan đến tội phạm ma túy.
        </p>
      </div>

      {/* Container của Cây */}
      <div className="flex-1 relative w-full">
        <LawTree initialData={lawsData} />
      </div>
      
    </div>
  );
}