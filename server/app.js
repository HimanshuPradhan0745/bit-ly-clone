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

app.use(cors({ origin: "http://localhost:5173" }));
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
  // let API, health, favicon fall through to 404 or other handlers
  if (
    req.originalUrl.startsWith("/api") ||
    req.originalUrl.startsWith("/healthz") ||
    req.originalUrl.startsWith("/favicon")
  ) {
    return next();
  }
  return res.sendFile(path.join(distPath, "index.html"));
});

// ------------------ START SERVER ------------------
app.listen(port, () =>
  console.log(`Server running on port: ${port}`)
);
