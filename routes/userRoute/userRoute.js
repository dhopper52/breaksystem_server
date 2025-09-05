const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/userModel/userModel");
const authenticateUser = require("../../middleware/authenticateUser");
const moment = require("moment");
// const jwtString = process.env.JWT_STRING;

router.post("/createUser", authenticateUser, async (req, res) => {
  const {
    _id,
    name,
    // phoneNo,
    // gender,
    shiftHours,
    floorId,
    shiftStarts,
    shiftEnds,
    actionFor,
  } = req.body;

  try {
    const isExist = await User.findById(_id);

    if (isExist) {
      if (actionFor === "update") {
        const updatedUser = await User.findByIdAndUpdate(
          _id,
          {
            name,
            // phoneNo,
            // gender,
            shiftHours,
            floorId,
            shiftStarts,
            shiftEnds,
          },
          { new: true }
        );

        return res.json({ status: "success", data: updatedUser });
      } else {
        return res.json({ status: "failed", message: "User already exists" });
      }
    } else {
      const user = new User({
        _id,
        name,
        // phoneNo,
        // gender,
        shiftHours,
        floorId,
        shiftStarts,
        shiftEnds,
      });

      const saveUser = await user.save();
      return res.json({ status: "success", data: saveUser });
    }
  } catch (error) {
    console.error("Error creating/updating user:", error);
    return res
      .status(500)
      .json({ status: "failed", message: "Internal server error" });
  }
});

router.post("/getUser", authenticateUser, async (req, res) => {
  // console.log(req.body, "getUser");
  const { floorId, _id, name } = req.body;
  let query = {};

  // Add floorId to query if provided
  if (floorId) query.floorId = floorId;

  // Add _id to query if provided and numeric
  if (_id && !isNaN(Number(_id))) query._id = Number(_id);

  // Add name to query if provided and valid for RegExp
  if (name) {
    try {
      query.name = { $regex: new RegExp(name, "i") }; // Case-insensitive name search
    } catch (error) {
      console.error("Invalid regular expression for name:", name);
      return res.status(400).json({
        status: "failed",
        message: "Invalid search query for name.",
      });
    }
  }

  try {
    const userList = await User.find(query);

    if (userList.length === 0) {
      return res.json({
        status: "failed",
        message: "No User Exists matching the criteria.",
      });
    }

    return res.json({ status: "success", data: userList });
  } catch (error) {
    console.error("Error fetching user list:", error);
    return res.status(500).json({
      status: "failed",
      message: "Internal Server Error.",
    });
  }
});

router.post("/getUsers", authenticateUser, async (req, res) => {
  const { floorId } = req.body;
  // console.log(req.body, "........................body");
  try {
    let query = {};
    if (floorId) query.floorId = floorId;
    if (_id) query._id = _id;
    const userList = await User.find(query);
    if (userList.length === 0) {
      return res.json({
        status: "failed",
        message: "No Users Exist",
      });
    }

    return res.json({ status: "success", data: userList });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "failed", message: "internal server error" });
  }
});

router.delete("/deleteUser", authenticateUser, async (req, res) => {
  const { floorId, _id } = req.body;
  // console.log(req.body, "........................body");
  try {
    const isExist = await User.findById(_id);
    // console.log({ isExist });
    if (!isExist) {
      return res.json({ status: "failed", message: "User doesn't exist" });
    }
    await User.findByIdAndDelete(_id);
    return res.json({ status: "success" });
  } catch (error) {
    console.error(error);

    return res
      .status(500)
      .json({ status: "failed", message: "internal server error" });
  }
});
module.exports = router;
