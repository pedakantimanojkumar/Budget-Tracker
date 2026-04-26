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

// 🔒 Secure HTTP headers
app.use(helmet());

// 🚫 Hide Express signature
app.disable("x-powered-by");

// 🌐 CORS (Production + Local support)
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev
      "https://budget-tracker-tau-henna.vercel.app" // replace with your REAL Vercel URL
    ],
    credentials: true,
  })
);

// ================= MIDDLEWARE =================

app.use(express.json());

// 📝 Logger only in development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ================= ROUTES =================

app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/transactions", transactionRoutes);
app.use("/stats", statsRoutes);

// ================= HEALTH CHECK =================

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/health", (req, res) => {
  res.send("OK");
});

// 🔐 Protected test route
app.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "Access granted" });
});

// ================= ERROR HANDLER =================
// MUST be last
app.use(errorMiddleware);

export default app;