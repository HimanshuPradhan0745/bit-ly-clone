const { Router } = require("express");

const { createUser, getUserById, loginUser, updateUser } = require("../services/userServices");
const User = require("../models/UserModel");
const { getAuthToken, verifyAccessToken } = require("../middlewares/authToken");

const router = Router();

router.post("/", async (req, res, next) => {
  const payload = req.body;
  if (!payload.email || !payload.fullName || !payload.password) {
    res.status(400).json("Missing required paramaters");
  } else {
    try {
      const existingUser = await User.findOne({ email: payload.email });
      if (existingUser) {
        res.status(401).json("Email address not available!");
      } else {
        const user = await createUser(payload);
        req["user"] = user;
        getAuthToken(req, res);
      }
    } catch (error) {
      res.status(500).json("Internal server error");
    }
  }
});

router.post(
  "/login",
  async (req, res, next) => {
    const payload = req.body;
    if (!payload.email || !payload.password) {
      res.status(400).json("Missing required paramaters");
    } else {
      const userData = await loginUser(payload);

      if (typeof userData === "object" && userData.email) {
        req["user"] = userData;
        getAuthToken(req, res);
      } else {
        res.status(403).json("Invalid email/password");
      }
    }
  }
);

router.get(
  "/:userId",
  verifyAccessToken,
  async (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
      res.status(400).send("Bad request");
    }
    const user = await getUserById(userId);
    res.status(200).json(user);
  }
);

router.put(
  "/:userId",
  verifyAccessToken,
  async (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
      res.status(400).send("Bad request");
    }
    if (userId !== req["user"].id) {
      res.status(403).send("Unauthorized");
    }
    try {
      const udpatedData = await updateUser(userId, req.body);
      res.status(200).json(udpatedData);
    } catch (error) {
      res.status(500).json("Internal server error");
    }
  }
);

module.exports = router;
