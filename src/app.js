const express = require("express");
const connectDb = require("./config/dataBase");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "shashank",
    lastName: "reddy",
    emailId: "shashank@gmail.com",
    password: "shasha@11",
    age: 31,
    gender: "male",
  });

  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user:", err.message);
  }
});

connectDb()
  .then(() => {
    console.log("DATABASE CONNECTED SUCCESSFULLY");
    app.listen(3000, () => {
      console.log("Server is listening on 3000");
    });
  })
  .catch((err) => {
    console.log("DATA BASE ERROR", err);
  });
