const express = require("express");
const router = express.Router();
const ActiveBreak = require("../../models/activeBreakModal/activeBreakModal");
const mongoose = require("mongoose");
const Break = require("../../models/breakModel/breakModel");

router.post("/startClock", async (req, res) => {
  console.log(req.body, "startclock body");

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

  console.log(activeBreakObj);

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

    console.log({ breakLength });
    console.log({ allowedLength });

    const actBreak = await activeBreakObj.save();
    console.log({ actBreak });
    return res.json({ status: "success", data: actBreak });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "failed", message: "internal server error" });
  }
});

router.post("/getClock", async (req, res) => {
  console.log(req.body, "startclock body");
  const { _id } = req.body;
  try {
    const actBreaks = await ActiveBreak.find({ floorId: _id });
    console.log({ actBreaks });
    return res.json({ status: "success", data: actBreaks });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "failed", message: "internal server error" });
  }
});

router.post("/getAdminClock", async (req, res) => {
  try {
    const actBreaks = await ActiveBreak.find();
    console.log({ actBreaks });
    return res.json({ status: "success", data: actBreaks });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "failed", message: "internal server error" });
  }
});

router.delete(
  "/deleteClock",
  //  authenticateUser,
  async (req, res) => {
    const {
      userId,
      name,
      usedbreaks,
      shiftHours,
      breakTime,
      floorId,
      fine,
      emergencyShortBreak,
      date,
      count,
      _id
    } = req.body;
    console.log(req.body, "...................dfff.....body");
    
    try {
      const isExist = await ActiveBreak.findOne({ id: req.body.id });
      if (!isExist) {
        console.log("Break not found");
        // Return success instead of failure since the clock is already not in the database
        // This prevents issues when the client thinks it needs to be deleted but it's already gone
        return res.json({ 
          status: "success", 
          message: "Break already removed or does not exist" 
        });
      }
      
      // Set current date if date is not provided
      const currentDate = date || new Date().toISOString().split('T')[0];
      
      // Update or create Break record
      let updateBreak;
      if (_id) {
        console.log("update the existing Break record");
        // If _id exists, update the existing Break record
        updateBreak = await Break.findByIdAndUpdate(
          _id,
          {
            userId,
            name,
            shiftHours,
            usedbreaks,
            floorId,
            breakTime,
            fine,
            emergencyShortBreak,
            date: currentDate,
            count,
          },
          { new: true } // Return the updated document
        );
      } else {
        console.log("create a new Break record");
        // If no _id, create a new Break record
        const breakObj = new Break({
          userId,
          name,
          shiftHours,
          usedbreaks,
          floorId,
          breakTime,
          fine,
          emergencyShortBreak,
          date: currentDate,
          count,
        });
        updateBreak = await breakObj.save();
      }
      
      console.log(updateBreak, "updateBreak");
      
      // Delete the active break
      await ActiveBreak.deleteOne({ id: req.body.id });
      return res.json({ 
        status: "success", 
        message: "Break successfully removed",
        data: updateBreak 
      });
    } catch (error) {
      console.error(error);

      return res
        .status(500)
        .json({ status: "failed", message: "internal server error" });
    }
  }
);
module.exports = router;
