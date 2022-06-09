const mongoose = require("mongoose");

const connectDB = async () => {
  console.log("In Connect DB fnct");
  try {
    const url = `mongodb+srv://adnanahmed:cspass@cluster0.zpkqq.mongodb.net/myFirstDatabase?authSource=admin&replicaSet=atlas-u63gi2-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true`;

    mongoose
      .connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Database Successfully Connected");
      });
  } catch (error) {
    console.log("Error connecting to Database");
    process.exit(1);
  }
};

module.exports = connectDB;