import morgan from "morgan";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/authRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();

// ================= SECURITY =================

// 🔒 Helmet (secure HTTP headers)
app.use(helmet());

// 🚫 Hide Express signature
app.disable("x-powered-by");

// 🌐 Strict CORS (allow only your frontend)
app.use(
  cors({
    origin: "http://localhost:5173", // Vite frontend
    credentials: true,
  })
);

// ================= MIDDLEWARE =================

app.use(express.json());

// 📝 Request logging (DEV only)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// ================= ROUTES =================

app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/transactions", transactionRoutes);
app.use("/stats", statsRoutes);

// ================= HEALTH =================

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/health", (req, res) => {
  res.send("OK");
});

// 🔐 Test protected route
app.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "Access granted" });
});

// ================= ERROR HANDLER =================
// (MUST be last)
app.use(errorMiddleware);

export default app;