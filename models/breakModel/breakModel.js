const mongoose = require("mongoose");

const breakTimeSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: false,
  },
  endTime: {
    type: String,
    required: false,
  },
});
const usedBreaksSchema = new mongoose.Schema({
  breakKey: {
    type: Number,
    required: false,
  },
  breakValue: {
    type: Number,
    required: false,
  },
});

const breakSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  // breakType: {
  //   type: String,
  //   required: true,
  // },
  shiftHours: {
    type: String,
    required: true,
  },
  usedbreaks: {
    type: [usedBreaksSchema],
    required: false,
  },
  emergencyShortBreak: {
    type: Number,
    required: true,
  },
  floorId: {
    type: Number,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  fine: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    // default: () => new Date(),
    required: true,
  },
  breakTime: {
    type: [breakTimeSchema],
    required: false,
  },
});

module.exports = mongoose.model("Breaks", breakSchema);
