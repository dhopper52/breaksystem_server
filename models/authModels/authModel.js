const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
  _id: {
    required: true,
    type: Number,
  },
  floorName: {
    required: true,
    type: String,
  },
  role: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now
  },
  lastPasswordChange: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Auth", authSchema);
