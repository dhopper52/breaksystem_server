const mongoose = require("mongoose");

const breakTimeSchema = new mongoose.Schema({
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
});
const usedBreaksSchema = new mongoose.Schema({
  breakKey: {
    type: Number,
    required: true,
  },
  breakValue: {
    type: Number,
    required: true,
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
    required: true,
  },
  emergencyShortBreak: {
    type: Number,
    required: true,
  },
  floorId: {
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
    required: true,
  },
});

module.exports = mongoose.model("Breaks", breakSchema);
