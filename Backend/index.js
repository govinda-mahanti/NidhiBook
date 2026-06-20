import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import connectDB from "./db/db.js"
dotenv.config();


import authRoutes from "./routes/authRoutes.js"
import expenseRoutes from "./routes/expenseRoutes.js"
import incomeRoutes from "./routes/incomeRoutes.js"
import geminiRoutes from "./routes/geminiRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({
    origin: "*"
}));
app.use(express.json());
connectDB()

app.get("/", (req, res) => {
    res.send("Welcome to Nidhibook server");
});

app.use("/auth", authRoutes)
app.use("/api", expenseRoutes)
app.use("/api", incomeRoutes)
app.use("/api", geminiRoutes)
app.use("/api", chatRoutes)
app.use("/api", adminRoutes)

const PORT=process.env.PORT || 5000

app.listen(PORT, () => {
    console.log("Server is running on port 5000");
});
