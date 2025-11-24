const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../util");
const User = require("../models/UserModel");

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      email: user.email,
      isLoggedIn: true,
      id: user.id,
    },
    JWT_SECRET,
    {
      expiresIn: "10s",
    }
  );
};

const generateResetToken = (user) => {
  return jwt.sign(
    {
      email: user.email,
      id: user.id,
    },
    JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );
};

const generateRefreshToken = async (user) => {
  const token = jwt.sign(
    {
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
  user.refreshToken = token;
  await User.findOneAndUpdate({ email: user.email }, user);

  return token;
};

const veryResetToken = async (token) => {
  return new Promise((resolve) => {
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        resolve(false);
      } else {
        try {
          resolve(decoded.email);
        } catch (error) {
          resolve(false);
        }
      }
    });
  });
};

const getAuthToken = async (req, res) => {
  const user = req["user"];
  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);
  res
    .status(200)
    .json({ email: user.email, accessToken, refreshToken, isLoggedIn: true });
};

const verifyAccessToken = async (req, res, next) => {
  var token = req.headers["authorization"]?.replace("Bearer ", "") || "";
  if (!token) {
    return res.status(401).send({ message: "No token provided" });
  }
  jwt.verify(token, JWT_SECRET, async function (err, decoded) {
    if (err) {
      return res.status(401).send({ message: "Invalid token" });
    }
    try {
      const user = await User.findOne({ email: decoded.email });
      req["user"] = user;
      next();
    } catch (error) {
      return res.status(401).send({ message: "Invalid user" });
    }
  });
};

const handleRefreshToken = async (req, res, next) => {
  const refresh_token = req.headers["refresh_token"] || "";
  if (!refresh_token) {
    return res.status(401).send({ message: "Invalid refresh token" });
  }

  try {
    const decodedRefreshToken = jwt.verify(refresh_token, JWT_SECRET);

    if (!decodedRefreshToken) {
      return res.status(401).send({ message: "Invalid refresh token" });
    }

    const user = await User.findOne({ email: decodedRefreshToken.email });
    if (user.refreshToken !== refresh_token) {
      return res.status(401).send({ message: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken(user);
    const newRefreshToken = await generateRefreshToken(user);

    return res.status(200).json({
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return res.status(401).send({ message: error });
  }
};

module.exports = {
  generateAccessToken,
  generateResetToken,
  generateRefreshToken,
  veryResetToken,
  getAuthToken,
  verifyAccessToken,
  handleRefreshToken,
};
