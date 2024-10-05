const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user.firstName + " Sending the connection request");
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

module.exports = requestRouter;
