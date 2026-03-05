import express, { type Request, type Response } from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api", (req: Request, res: Response) => {
  res.json({ message: "Backend hệ thống phòng chống ma túy đã sẵn sàng!" });
});

const PORT = Number(process.env.PORT || 5000);

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server chạy tại http://localhost:${PORT}`),
);
