const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn("⚠ MONGODB_URI not set");
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log("✔ MongoDB connected");
  } catch (err) {
    console.error("✖ MongoDB connection failed:", err);
  }
}

module.exports = connectDB;