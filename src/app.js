const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("Good morning");
});

app.use("/test", (req, res) => {
  res.send("Hello from the test serverc tutorial");
});

app.use("/hello", (req, res) => {
  res.send("Hello from the hello server");
});

app.listen(3000, () => {
  console.log("Server is listening on 3000");
});
