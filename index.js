require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const port = 5000;
const cors = require("cors");
const authRouter = require("./routes/authRoute/authRoute");
const URI = process.env.MONGODB_URI_STRING;
const userRoute = require("./routes/userRoute/userRoute");
const breakRoute = require("./routes/breakRoute/breakRoute");
const ipFilter = require("./middleware/ipAuthenticate/ipAuthenticate");

// app.use(ipFilter);
app.use(cors());
app.use(bodyParser.json());

app.use("/auth", authRouter);
app.use("/user", userRoute);
app.use("/break", breakRoute);

const connectDB = (URI) => {
  console.log("Connected to DB");
  return mongoose.connect(URI);
};

const start = async () => {
  try {
    await connectDB(URI);
   
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
};

 app.listen(port, () => {
   start();
      console.log(`app is runing on ${port}`);
  });




