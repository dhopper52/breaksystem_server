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
    phoneNo,
    gender,
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
            phoneNo,
            gender,
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
        phoneNo,
        gender,
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
// router.post("/createUser", authenticateUser, async (req, res) => {
//   const {
//     _id,
//     name,
//     phoneNo,
//     gender,
//     shiftHours,
//     floorId,
//     shiftStarts,
//     shiftEnds,
//     actionFor,
//   } = req.body;
//   console.log(req.body);
//   // try {
//   const isExist = await User.findOne({ _id: _id });
//   if (isExist) {
//     return res.json({ status: "failed", message: "User Already Exist" });
//   }
//   const user = new User({
//     _id,
//     gender,
//     name,
//     phoneNo,
//     shiftHours,
//     floorId,
//     shiftStarts,
//     shiftEnds,
//   });
//   console.log(user);
//   if (actionFor === "update") {
//     console.log("update.................");
//     const saveUser = await User.findByIdAndUpdate({ _id: _id, user });
//     return res.json({ status: "success", data: saveUser });
//   }
//   console.log("create.................");

//   const saveUser = await user.save();
//   return res.json({ status: "success", data: saveUser });
//   // } catch (error) {
//   //   return res.json({ status: "failed", message: "internal server error" });
//   // }
// });

router.post(
  "/getUser",
  //  authenticateUser,
  async (req, res) => {
    const { floorId, _id } = req.body;
    let query = {};
    if (floorId) query.floorId = floorId;
    if (_id) query._id = Number(_id);

    try {
      const userList = await User.find(query);
      console.log(userList, "userrrrrrrrrrrrrrrr");
      if (userList.length === 0) {
        return res.json({
          status: "failed",
          message: "No User Exist to this floor Id",
        });
      }

      return res.json({ status: "success", data: userList });
    } catch (error) {
      return res
        .status(500)
        .json({ status: "failed", message: "internal server error" });
    }
  }
);

router.post(
  "/getUsers",
  //  authenticateUser,
  async (req, res) => {
    const { floorId } = req.body;
    console.log(req.body, "........................body");
    try {
      let query = {};
      if (floorId) query.floorId = floorId;
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
  }
);
module.exports = router;
