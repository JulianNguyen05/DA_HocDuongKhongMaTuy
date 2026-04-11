export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cây Pháp Luật VER2",
  description: "Phiên bản hard-code của Cây Pháp Luật",
};

export default async function TreeVer2Page() {
  return (
    /* THAY ĐỔI: Bỏ overflow-hidden, dùng padding-top để thay cho top-[11%] */
    <div className="relative min-h-screen bg-slate-50 flex flex-col items-center pt-[11dvh] md:pt-[17dvh] pb-5 px-4">
      
      {/* ==================== GLASS FRAME CONTAINER ==================== */}
      {/* THAY ĐỔI: Chuyển từ absolute sang relative để nó đẩy chiều cao trang web một cách tự nhiên */}
      <div
        className="
          relative
          w-full 
          md:w-[50vw] 
          h-auto 
          z-10

          /* --- HIỆU ỨNG KHUNG KÍNH NỔI --- */
          bg-white/40       /* Tăng độ đặc một chút để nhìn rõ hơn trên nền xám */
          backdrop-blur-xl 
          rounded-3xl 
          border border-white/40 
          shadow-2xl 
          p-4 md:p-6 
          flex flex-col 
          gap-4
        "
      >
        {/* --- Tiêu đề --- */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0D593E]">CÂY PHÁP LUẬT</h1>
          <p className="text-sm md:text-base text-slate-600 mt-1">Pháp luật về phòng chống ma túy</p>
        </div>

        {/* ==================== BỨC ẢNH CHÍNH ==================== */}
        <img
          src="/images/tree/tree_ver2.jpg"
          alt="Cây Pháp Luật"
          className="w-full h-auto rounded-2xl shadow-inner"
        />
      </div>
    </div>
  );
}