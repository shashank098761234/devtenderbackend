const express = require("express");
const connectDb = require("./config/dataBase");
const app = express();
const cookieparser = require("cookie-parser");

app.use(express.json());
app.use(cookieparser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
