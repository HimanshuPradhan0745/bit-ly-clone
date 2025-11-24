require("dotenv").config();

const SESSION_SECRET = process.env.SESSION_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = { SESSION_SECRET, JWT_SECRET };
