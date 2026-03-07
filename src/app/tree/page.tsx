"use client";
import { useState } from "react";

// 1. Định nghĩa cấu trúc dữ liệu của Sơ đồ cây (Bám sát Bộ luật Hình sự)
interface TreeNodeData {
  id: string;
  name: string;
  summary: string;
  details: string[];
  children?: TreeNodeData[];
}

const lawTreeData: TreeNodeData = {
  id: "root",
  name: "Tội Phạm Về Ma Túy",
  summary: "Chương XX - Bộ luật Hình sự 2015",
  details: ["Bao gồm các tội xâm phạm chế độ quản lý của Nhà nước đối với chất ma túy.", "Hình phạt vô cùng nghiêm khắc, cao nhất là Tử hình."],
  children: [
    {
      id: "nhom-1",
      name: "Sản xuất, Tàng trữ, Mua bán",
      summary: "Nhóm hành vi cốt lõi, nguy hiểm nhất",
      details: ["Đây là nguồn cơn đưa ma túy vào cộng đồng."],
      children: [
        {
          id: "d248",
          name: "Điều 248: Sản xuất",
          summary: "Tội sản xuất trái phép chất ma túy",
          details: [
            "Khung 1: Phạt tù từ 02 năm đến 07 năm.",
            "Khung cao nhất: Phạt tù 20 năm, tù chung thân hoặc tử hình (nếu sản xuất số lượng lớn).",
            "Người phạm tội còn có thể bị phạt tiền từ 5 - 500 triệu đồng."
          ]
        },
        {
          id: "d249",
          name: "Điều 249: Tàng trữ",
          summary: "Tội tàng trữ trái phép chất ma túy",
          details: [
            "Cất giữ ma túy không nhằm mục đích mua bán.",
            "Khung 1: Phạt tù từ 01 năm đến 05 năm.",
            "Khung cao nhất: Tù chung thân."
          ]
        },
        {
          id: "d251",
          name: "Điều 251: Mua bán",
          summary: "Tội mua bán trái phép chất ma túy",
          details: [
            "Bán, trao đổi hoặc dùng ma túy để thanh toán.",
            "Khung cao nhất: Phạt tù 20 năm, tù chung thân hoặc tử hình."
          ]
        }
      ]
    },
    {
      id: "nhom-2",
      name: "Tổ chức, Lôi kéo sử dụng",
      summary: "Nhóm hành vi lây lan tệ nạn",
      details: ["Làm lây lan tệ nạn ma túy, đặc biệt nguy hiểm khi nhắm vào học sinh, sinh viên."],
      children: [
        {
          id: "d255",
          name: "Điều 255: Tổ chức sử dụng",
          summary: "Cung cấp địa điểm, dụng cụ, ma túy...",
          details: [
            "Khung 1: Phạt tù từ 02 năm đến 07 năm.",
            "Tổ chức cho người dưới 18 tuổi: Có thể bị phạt tù đến chung thân."
          ]
        },
        {
          id: "d258",
          name: "Điều 258: Lôi kéo",
          summary: "Rủ rê, dụ dỗ người khác sử dụng",
          details: [
            "Khung 1: Phạt tù từ 01 năm đến 05 năm.",
            "Lôi kéo người dưới 18 tuổi (học sinh): Phạt tù từ 05 năm đến 10 năm hoặc cao hơn."
          ]
        }
      ]
    }
  ]
};

// 2. Component Đệ quy để vẽ từng nhánh của cây
const TreeNode = ({ node, onNodeClick }: { node: TreeNodeData; onNodeClick: (node: TreeNodeData) => void }) => {
  return (
    <div className="relative flex items-center py-2">
      {/* Khối hiển thị (Lá cây) */}
      <div 
        onClick={() => onNodeClick(node)}
        className="group relative z-10 flex flex-col items-center justify-center min-w-[180px] bg-white border-2 border-brand-green/80 rounded-xl p-4 shadow-sm cursor-pointer hover:bg-brand-cream hover:shadow-md hover:scale-105 transition-all"
      >
        <span className="font-bold text-brand-green text-center">{node.name}</span>
        
        {/* Tooltip hiện ra khi Hover */}
        <div className="absolute bottom-full mb-3 hidden group-hover:block w-48 bg-gray-800 text-white text-xs text-center p-2 rounded-lg shadow-xl pointer-events-none z-50 animate-fade-in-up">
          {node.summary}
          {/* Mũi tên của Tooltip */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      </div>

      {/* Nếu có nhánh con, tiếp tục vẽ đệ quy */}
      {node.children && node.children.length > 0 && (
        <div className="relative flex flex-col gap-4 ml-12 pl-8 border-l-2 border-brand-green/40">
          {node.children.map((child, index) => (
            <div key={child.id} className="relative">
              {/* Đường gạch ngang nối từ thân cây vào nhánh */}
              <div className="absolute -left-8 top-1/2 w-8 h-[2px] bg-brand-green/40 -translate-y-1/2"></div>
              <TreeNode node={child} onNodeClick={onNodeClick} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 3. Trang hiển thị chính
export default function TreePage() {
  const [selectedNode, setSelectedNode] = useState<TreeNodeData | null>(null);

  return (
    <div className="min-h-[75vh] py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-brand-green uppercase mb-4">
          Sơ đồ Pháp luật về Ma túy
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Hover (di chuột) để xem tóm tắt, nhấn vào từng tội danh để xem chi tiết chế tài xử lý theo Bộ luật Hình sự hiện hành.
        </p>
      </div>

      {/* Khu vực vẽ sơ đồ (Cho phép cuộn ngang nếu màn hình nhỏ) */}
      <div className="overflow-x-auto pb-10 custom-scrollbar">
        <div className="min-w-max p-8 flex justify-start lg:justify-center">
          <TreeNode node={lawTreeData} onNodeClick={setSelectedNode} />
        </div>
      </div>

      {/* Modal chi tiết khi Click vào Node */}
      {selectedNode && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative shadow-2xl animate-fade-in-up">
            <button 
              onClick={() => setSelectedNode(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-brand-green mb-2 border-b pb-2 uppercase">{selectedNode.name}</h2>
            <p className="text-gray-500 italic mb-4">{selectedNode.summary}</p>
            
            <div className="space-y-3 mb-6">
              {selectedNode.details.map((detail, index) => (
                <div key={index} className="bg-brand-cream p-3 rounded-lg border border-brand-green/20 flex items-start">
                  <span className="text-red-500 mr-2 font-bold">⚖️</span>
                  <span className="text-gray-800 text-sm leading-relaxed">{detail}</span>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => setSelectedNode(null)}
              className="w-full bg-brand-green text-white py-2 rounded-full font-bold hover:bg-green-600 transition"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}