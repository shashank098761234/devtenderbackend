const express = require("express");
const connectDb = require("./config/dataBase");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error : " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Please enter correct email address!!!");
    }
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid creditials!!!!");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.send("Login successfull");
    } else {
      throw new Error("Invalid creditials!!!!");
    }
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

// Get particular user from the database
app.get("/feed", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail });
    if (user.length === 0) {
      res.status(404).send("User Not found");
    } else {
      res.send(result);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

//Get all user from the database
app.get("/feedAll", async (req, res) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// Delete user based on id
app.delete("/deleteUser", async (req, res) => {
  const userId = req.body.userId;
  try {
    const deleteduser = await User.findByIdAndDelete(userId);
    res.send("user deleted succesfully");
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// Update user based on id
app.patch("/updateUser/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    console.log("isUpdateAllowed>>>>>>", isUpdateAllowed);
    if (!isUpdateAllowed) {
      throw new Error("UPDATE NOT ALLOWED!!!!");
    }
    const updateUser = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    // we can update user by using below line
    // const updateUser = await User.findByIdAndUpdate(userId, data);
    res.send("User updated successfully>>>>>>>");
  } catch (error) {
    res.status(400).send("Something went wrong" + error.message);
  }
});

// Update user based on email
app.patch("/updateUserByEmail", async (req, res) => {
  // const userData = req.body.emailId;
  // console.log(userData);
  try {
    const filter = { emailId: req.body.emailId }; // Filter by email
    const updateDoc = { $set: req.body };

    const result = await User.updateOne(filter, updateDoc);
    res.send("User updated successfully");
  } catch (error) {
    res.status(400).send("Something went wrong", error);
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
