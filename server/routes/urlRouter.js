const { Router } = require("express");

const Url = require("../models/UrlModel");
const {
  createUrl,
  deleteUrlByUrlCode,
  updateUrlCode,
} = require("../services/urlServices");

const router = Router();

// GET /api/links -> list all links
router.get("/", async (req, res) => {
  try {
    const data = await Url.find({}).exec();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json("Internal server error");
  }
});

// POST /api/links -> create
router.post("/", async (req, res) => {
  const { originalLink } = req.body;

  if (originalLink) {
    try {
      let urlData = await Url.findOne({ originalLink });
      if (urlData) {
        res.status(200).json(urlData);
      } else {
        const data = await createUrl({ ...req.body });
        res.status(201).json(data);
      }
    } catch (error) {
      const msg = error && error.message ? error.message : "Internal server error";
      if (msg === "Invalid URL") return res.status(400).json(msg);
      if (msg === "Invalid urlCode") return res.status(400).json(msg);
      if (msg === "URL code already in use") return res.status(409).json(msg);
      if (msg === "Failed to generate unique code") return res.status(409).json(msg);
      console.log(error);
      res.status(500).json("Internal server error");
    }
  } else {
    res.status(400).json("Missing required paramaters");
  }
});

// GET /api/links/:code -> stats
router.get("/:code", async (req, res) => {
  const code = req.params.code;
  if (!code) {
    return res.status(400).send("Bad request");
  }
  try {
    const data = await Url.findOne({ urlCode: code }).exec();
    if (!data) return res.status(404).json("Not found");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json("Internal server error");
  }
});

router.put(
  "/:urlCode",
  async (req, res) => {
    const urlCode = req.params.urlCode;
    if (!urlCode) {
      res.status(400).send("Bad request");
    }
    try {
      const udpatedData = await updateUrlCode(req.body);
      res.status(200).json(udpatedData);
    } catch (error) {
      res.status(500).json("Internal server error");
    }
  }
);

// DELETE /api/links/:code -> delete
router.delete(
  "/:urlCode",
  async (req, res) => {
    const urlCode = req.params.urlCode;
    if (!urlCode) {
      res.status(400).send("Bad request");
    }
    try {
      const data = await deleteUrlByUrlCode(urlCode);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json("Internal server error");
    }
  }
);

module.exports = router;
