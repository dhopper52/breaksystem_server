const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  // phoneNo: {
  //   type: String,
  //   required: Number,
  // },
  // gender: {
  //   type: String,
  //   required: true,
  // },
  shiftHours: {
    type: String,
    required: true,
  },
  floorId: {
    type: Number,
    required: true,
  },
  shiftStarts: {
    type: String,
    required: true,
  },
  shiftEnds: {
    type: String,
    required: true,
  },
  // shiftStarts: {
  //   type: String,
  //   required: true,
  // },
  shiftEnds: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Users", userSchema);
