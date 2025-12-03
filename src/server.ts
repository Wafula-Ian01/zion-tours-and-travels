import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { rateLimit } from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

// ROUTES
import packageRoutes from "./routes/packages";
import articleRoutes from "./routes/articles";
import galleryRoutes from "./routes/gallery";
import faqRoutes from "./routes/faqs";
import partnerRoutes from "./routes/partners";
import categoryRoutes from "./routes/categories";
import creditationRoutes from "./routes/creditations";
import contactRoutes from "./routes/contact";
import bookingRoutes from "./routes/bookings";
import settingsRoutes from "./routes/settings";
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ----------------------------------------------------------------------
// DEFAULT FALLBACKS (DEV ONLY)
// ----------------------------------------------------------------------

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "dev-secret-key-change-in-production";
  console.warn(
    "⚠️ WARNING: Using default JWT_SECRET. Set JWT_SECRET in .env for production!"
  );
}

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db";
}

// ----------------------------------------------------------------------
// MIDDLEWARE
// ----------------------------------------------------------------------

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP. Try again later.",
});
app.use("/api/", limiter);

// ----------------------------------------------------------------------
// HEALTH CHECK
// ----------------------------------------------------------------------

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ----------------------------------------------------------------------
// API ROUTES
// ----------------------------------------------------------------------

app.use("/api/auth", authRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/creditations", creditationRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/settings", settingsRoutes);

// ----------------------------------------------------------------------
// SERVE FRONTEND BUILD (IMPORTANT FOR RENDER)
// ----------------------------------------------------------------------

// Required to resolve correct path after TypeScript compilation
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static /dist folder
app.use(express.static(path.join(__dirname, "../dist")));

// React Router support (SPA fallback)
// MUST come *after* API routes but *before* the 404 handler
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

// ----------------------------------------------------------------------
// ERROR HANDLER
// ----------------------------------------------------------------------

app.use((err: any, req: express.Request, res: express.Response) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
      status: err.status || 500,
    },
  });
});

// ----------------------------------------------------------------------
// START SERVER
// ----------------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`🚀 Server running on PORT ${PORT}`);
});
