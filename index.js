require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const PORT = 5000;
const cors = require("cors");
const cron = require("node-cron");
const URI = process.env.MONGODB_URI_STRING;
const Auth = require("./models/authModels/authModel");
const authRouter = require("./routes/authRoute/authRoute");
const userRoute = require("./routes/userRoute/userRoute");
const breakRoute = require("./routes/breakRoute/breakRoute");
const clockRoute = require("./routes/clockRoute/clockRoute");
const DELETE_AFTER_DAYS = process.env.DELETE_AFTER_DAYS || 75;
const Break = require("./models/breakModel/breakModel");
// const ipFilter = require("./middleware/ipAuthenticate/ipAuthenticate");

// app.use(ipFilter);
app.use(cors());
app.use(bodyParser.json());

app.use("/auth", authRouter);
app.use("/user", userRoute);
app.use("/break", breakRoute);
app.use("/clock", clockRoute);

app.get("/home", (req, res) => {
  res.status(200).json("Welcome, your app is working well");
});

const deleteOldData = async () => {
  const seventyFiveDaysAgo = new Date();
  seventyFiveDaysAgo.setDate(seventyFiveDaysAgo.getDate() - 75);
  const pktOffset = 5 * 60;
  const localTime = new Date(
    seventyFiveDaysAgo.getTime() + pktOffset * 60 * 1000
  );
  const pktISOString = localTime.toISOString();
  console.log({ pktISOString });

  try {
    const result = await Break.deleteMany({
      date: { $lt: pktISOString },
    });
    console.log({ result }, { pktISOString });
  } catch (error) {
    console.error("Error deleting old data:", error);
  }
};

const connectDB = async (URI) => {
  try {
    await mongoose.connect(URI);
    console.log("Connected to DB");
  } catch (error) {
    console.error("Failed to connect to DB:", error);
    process.exit(1);
  }
};

cron.schedule("0 0 * * *", () => {
  console.log("Running scheduled task to delete old data");
  deleteOldData();
});

// cron.schedule("*/20 * * * * *", () => {
//   console.log("Running scheduled task to delete old data every 10 seconds");
//  deleteOldData();
// });

const startServer = async () => {
  try {
    await connectDB(URI);
    app.listen(PORT, () => {
      console.log(`app is runinng on ${PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
};

startServer();

module.exports = app;
