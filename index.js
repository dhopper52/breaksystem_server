require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const PORT = 5000;
const cors = require("cors");
const URI = process.env.MONGODB_URI_STRING;
const Auth = require("./models/authModels/authModel");
const authRouter = require("./routes/authRoute/authRoute");
const userRoute = require("./routes/userRoute/userRoute");
// const breakRoute = require("./routes/breakRoute/breakRoute");
// const ipFilter = require("./middleware/ipAuthenticate/ipAuthenticate");

// app.use(ipFilter);
app.use(cors()); 
app.use(bodyParser.json());

app.use("/auth", authRouter);
app.use("/user", userRoute);
// app.use("/break", breakRoute);

app.get('/home', (req, res) => {
  res.status(200).json('Welcome, your app is working well');
})

const connectDB = async (URI) => {
  try {
    await mongoose.connect(URI);
    console.log("Connected to DB");
  } catch (error) {
    console.error("Failed to connect to DB:", error);
    process.exit(1); 
  }
};

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

module.exports = app
  


