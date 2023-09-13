const mongoose = require("mongoose");

/**
 * Connect to the mongodb database using mongoose
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_CONNECT, {
      dbName: "tldr-links",
    });

    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit();
  }
};

module.exports = connectDB;
