export interface TreeBranchConfig {
  id: number;
  title: string;
  bgColorClass: string; 
  textColorClass: string; 
  top: string; 
  left: string; 
  width: string; 
  contentKey: string; 
}

// ==================== CẤU HÌNH CÂY PHÁP LUẬT (tree_ver2) ====================
export const treeBranches: TreeBranchConfig[] = [
  {
    id: 1,
    title: "Trách nhiệm trong việc phòng, chống ma túy",
    bgColorClass: "bg-transparent",
    textColorClass: "text-[#6A9B49]", 
    top: "14%",
    left: "21%", 
    width: "33%", // Đã đổi sang %
    contentKey: "responsibility",
  },
  {
    id: 2,
    title: "Phòng ngừa ma túy",
    bgColorClass: "bg-transparent",
    textColorClass: "text-[#D54D53]", 
    top: "27%",
    left: "65%",
    width: "30%", // Đã đổi sang %
    contentKey: "prevention",
  },
  {
    id: 3,
    title: "Cai nghiện ma túy và phục hồi nhân phẩm",
    bgColorClass: "bg-transparent",
    textColorClass: "text-[#B33FB6]", 
    top: "32%",
    left: "5%",
    width: "40%", // Đã đổi sang %
    contentKey: "rehabilitation",
  },
  {
    id: 4,
    title: "Đấu tranh chống hành vi vi phạm pháp luật về ma túy",
    bgColorClass: "bg-transparent",
    textColorClass: "text-[#DF7F25]", 
    top: "49%",
    left: "57%",
    width: "42%", // Đã đổi sang %
    contentKey: "enforcement",
  },
  {
    id: 5,
    title: "KHUNG PHÁP LÝ VỀ PHÒNG, CHỐNG MA TÚY",
    bgColorClass: "bg-transparent",
    textColorClass: "text-[#EAC875]", 
    top: "86%",
    left: "30%",
    width: "50%",
    contentKey: "legalFramework",
  },
];