const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://shashank:shashank@cluster0.chxsh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/devTender"
  );
};

module.exports = connectDb;
