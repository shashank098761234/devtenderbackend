const express = require("express");

const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditprofileData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log(user);
    res.send(user);
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditprofileData(req)) {
      throw new Error("Invalid Edit request");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    // res.send("Profile was Updated Successfully!!!!");
    res.json({
      message: `${loggedInUser.firstName}, Profile was Updated Successfully!!!!`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

profileRouter.patch("/profile/passwordEdit", userAuth, async (req, res) => {
  try {
    const { emailId, password, newPassword } = req.body;
    const user = await User.findOne({ emailId: emailId });
    const previousPasswordValidate = await user.validatePassword(password);

    if (!previousPasswordValidate) {
      throw new Error("Current password is incorrect");
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const updatedPassword = await User.findByIdAndUpdate(
      { _id: user._id },
      { password: passwordHash }
    );

    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.send("User password updated successfully>>>>");
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

module.exports = profileRouter;
