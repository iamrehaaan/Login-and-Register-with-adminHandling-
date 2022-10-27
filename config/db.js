const mongoose = require("mongoose");
const { dev } = require(".");

exports.connectDB = async () => {
  try {
    await mongoose.connect(dev.url.DB_URL);
    console.log("Database is connected perfectly");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
