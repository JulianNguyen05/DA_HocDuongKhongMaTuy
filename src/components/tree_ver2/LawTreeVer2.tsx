"use client";

import { LawArticleData } from "@/models/Tree";
import LawTree from "@/components/tree/LawTree";   // ← Reuse component cũ

interface Props {
  initialData: LawArticleData[];   // ← Type đúng, không còn "any"
}

export default function LawTreeVer2({ initialData }: Props) {
  return <LawTree initialData={initialData} />;
}