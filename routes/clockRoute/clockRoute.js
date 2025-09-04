const express = require("express");
const router = express.Router();
const ActiveBreak = require("../../models/activeBreakModal/activeBreakModal");
const mongoose = require("mongoose");
const authenticateUser = require("../../middleware/authenticateUser");

router.post("/startClock",authenticateUser, async (req, res) => {
  // console.log(req.body, "startclock body");

  const {
    id,
    floorId,
    breakTimeValue,
    user,
    breakInfo,
    breakType,
    count,
    startTime,
    breakKey,
  } = req.body;

  // Create a new ActiveBreak object with the data
  const activeBreakObj = new ActiveBreak({
    id,
    floorId,
    breakTimeValue,
    user: {
      _id: user?._id,
      name: user?.name,
      shiftHours: user?.shiftHours,
      floorId: user?.floorId,
      shiftStarts: user?.shiftStarts,
      shiftEnds: user?.shiftEnds,
    },
    breakInfo: breakInfo
      ? {
          _id: new mongoose.Types.ObjectId(breakInfo._id), // Convert string to ObjectId
          userId: breakInfo.userId,
          name: breakInfo.name,
          shiftHours: breakInfo.shiftHours,
          usedbreaks: breakInfo.usedbreaks?.map((usedBreak) => ({
            breakKey: usedBreak.breakKey,
            breakValue: usedBreak.breakValue,
          })),
          emergencyShortBreak: breakInfo.emergencyShortBreak,
          floorId: breakInfo.floorId,
          count: breakInfo.count,
          fine: breakInfo.fine,
          date: breakInfo.date,
          breakTime: breakInfo.breakTime?.map((bt) => ({
            breakKey: bt.breakKey,
            breakValue: bt.breakValue,
          })),
        }
      : undefined,
    breakType,
    count,
    startTime,
    breakKey,
  });

  // console.log(activeBreakObj);

  try {
    const isExist = await ActiveBreak.findOne({ id: id, floorId: floorId });

    if (isExist) {
      return res.json({
        status: "failed",
        message: "Employee's break is already active ",
      });
    }

    const breakLength = await ActiveBreak.find({ floorId: floorId });
    const allowedLength = floorId === 103 ? 4 : 3;
    if (breakLength.length >= allowedLength) {
      return res.json({
        status: "failed",
        message: "Another break is not allowed",
      });
    }

    // console.log({ breakLength });
    // console.log({ allowedLength });

    const actBreak = await activeBreakObj.save();
    // console.log({ actBreak });
    return res.json({ status: "success", data: actBreak });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "failed", message: "internal server error" });
  }
});

router.post("/getClock",authenticateUser, async (req, res) => {
  // console.log(req.body, "startclock body");
  const { _id } = req.body;
  try {
    const actBreaks = await ActiveBreak.find({ floorId: _id });
    // console.log({ actBreaks });
    return res.json({ status: "success", data: actBreaks });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "failed", message: "internal server error" });
  }
});

router.post("/getAdminClock",authenticateUser, async (req, res) => {
  try {
    const actBreaks = await ActiveBreak.find();
    // console.log({ actBreaks });
    return res.json({ status: "success", data: actBreaks });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "failed", message: "internal server error" });
  }
});

router.delete("/deleteClock", authenticateUser, async (req, res) => {
  // console.log(req.body, "....deleteClock............body");
  try {
    await ActiveBreak.deleteOne({ id: req.body.id });
    return res.json({ status: "success" });
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .json({ status: "failed", message: "internal server error" });
  }
});
module.exports = router;
