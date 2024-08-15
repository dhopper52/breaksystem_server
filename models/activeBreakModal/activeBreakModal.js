const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  shiftHours: String,
  floorId: Number,
  shiftStarts: String,
  shiftEnds: String,
});

const usedBreaksSchema = new mongoose.Schema({
  breakKey: Number,
  breakValue: Number,
});

const breakInfoSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: Number,
  name: String,
  shiftHours: String,
  usedbreaks: [usedBreaksSchema],
  emergencyShortBreak: Number,
  floorId: Number,
  count: Number,
  fine: Number,
  date: Date,
  breakTime: [usedBreaksSchema],
  __v: Number,
});

const activeBreak = new mongoose.Schema({
  id: Number,
  floorId: Number,
  breakTimeValue: String,
  user: userSchema,
  breakInfo: breakInfoSchema,
  breakType: String,
  count: Number,
  startTime: Number,
  breakKey: String,
});

module.exports = mongoose.model("ActiveBreak", activeBreak);

// const activeBreak = new mongoose.Schema({
//   id: {
//     type: Number,
//     require: true,
//   },
//   floorId: {
//     type: Number,
//     require: true,
//   },
//   breakTimeValue: {
//     type: String,
//     require: true,
//   },
//   user: {
//     type: {},
//     require: true,
//   },
//   breakInfo: {
//     type: {},
//     require: true,
//   },
//   breakType:{
//     type:String,
//     re
//   }
// });
