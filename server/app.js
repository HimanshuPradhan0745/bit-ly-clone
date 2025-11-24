const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const dbConnect = require("./config/db");
const baseRouter = require("./routes");
const { getUrlByUrlCode } = require("./services/urlServices");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const _dirname = __dirname;

// Trust proxy for secure cookies when behind Render/HTTPS
app.set("trust proxy", 1);

// CORS: allow Render frontend and local dev
const allowedOrigins = new Set([
  process.env.FRONTEND_ORIGIN,
  "https://bit-ly-clone.onrender.com",
].filter(Boolean));

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization,refresh_token",
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 5001;

// DB
dbConnect();

// LOG ROUTES
app.use((req, res, next) => {
  console.log(`Route Call: ${req.method} ${req.originalUrl}`);
  next();
});

// ------------------ SERVE REACT BUILD FIRST ------------------
const distPath = path.join(_dirname, "../client", "dist");
app.use(express.static(distPath));

// ------------------ API ROUTES ------------------
app.use("/api", baseRouter);

// ------------------ HEALTH ROUTE ------------------
app.get("/healthz", (req, res) => res.status(200).json({ ok: true }));

// ------------------ SHORT URL REDIRECT ------------------
app.get("/:urlCode", async (req, res) => {
  try {
    const data = await getUrlByUrlCode(req.params.urlCode);
    return res.redirect(302, data.originalLink);
  } catch (err) {
    return res.status(404).send("Not found");
  }
});

// ------------------ SPA FALLBACK (LAST) ------------------
app.get(/.*/, (req, res, next) => {
  const first = req.originalUrl.split("/")[1];
  const reserved = new Set(["api", "healthz", "favicon.ico"]);
  // If not API/health/static file and not empty, serve the React app
  if (!reserved.has(first) && !first.includes(".")) {
    return res.sendFile(path.join(distPath, "index.html"));
  }
  return next();
});

// ------------------ START SERVER ------------------
app.listen(port, () =>
  console.log(`Server running on port: ${port}`)
);
