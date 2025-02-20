import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import notesRoutes from "./routes/routes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use("/notes", notesRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
