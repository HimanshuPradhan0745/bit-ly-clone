const { Router } = require("express");

const urlRouter = require("./urlRouter");
const userRouter = require("./userRouter");
const authRouter = require("./authRouter");

const router = Router();

router.use("/links", urlRouter);
router.use("/user", userRouter);
router.use("/auth", authRouter);

module.exports = router;
