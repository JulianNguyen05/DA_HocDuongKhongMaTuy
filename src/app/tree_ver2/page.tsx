import TreeInteractive from "./TreeInteractive";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cây Pháp Luật VER2",
  description: "Phiên bản hard-code của Cây Pháp Luật tương tác với Mindmap",
};

export default async function TreeVer2Page() {
  return (
    <main>
      <TreeInteractive />
    </main>
  );
}