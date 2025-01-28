const express = require("express");
const connectDb = require("./config/dataBase");
const app = express();
const cookieparser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieparser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDb()
  .then(() => {
    console.log("DATABASE CONNECTED SUCCESSFULLY");
    app.listen(process.env.PORT, () => {
      console.log("Server is listening on 3000");
    });
  })
  .catch((err) => {
    console.log("DATA BASE ERROR", err);
  });
