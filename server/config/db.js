const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const dbConnect = async () => {
  try {
    const uri = process.env.MONGO_URL;
    if (!uri || typeof uri !== "string" || uri.trim() === "") {
      console.error("MONGO_URL is not set. Create a .env with MONGO_URL=<mongodb-uri>.");
      process.exit(1);
    }
    await mongoose.connect(uri);
    console.log("Database Connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = dbConnect;
