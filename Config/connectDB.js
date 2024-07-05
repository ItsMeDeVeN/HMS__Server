const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const is_connected = await mongoose.connect(
      "mongodb+srv://crud:crud@cluster0.ak2obel.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    if (is_connected) {
      console.log("Succesfully connected to MongoDB Server.");
    }
  } catch (error) {
    console.log(`Error connecting to MongoDB:- ${error}`);
  }
};

module.exports = connectDB;
