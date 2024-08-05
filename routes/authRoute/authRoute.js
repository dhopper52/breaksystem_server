const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Auth = require("../../models/authModels/authModel");
const authenticateRole = require("../../middleware/authenticateRole/authenticateRole");

const jwtString = process.env.JWT_STRING;

// router.post("/signup", authenticateRole, async (req, res) => {
//   const { _id, floorName, password, role } = req.body;

//   try {
//     const isExist = await Auth.findOne({ _id: _id });

//     if (isExist) {
//       return res.json({ status: "failed", message: "Floor Already Exist" });
//     }

//     const hashPassword = await bcrypt.hash(password, 10);
//     const auth = new Auth({
//       _id,
//       floorName,
//       password: hashPassword,
//       role: role,
//     });
//     const saveAuth = await auth.save();

//     return res.json({ status: "success", data: saveAuth });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ status: "failed", message: "internal server error" });
//   }
// });

router.get("/login", async (req, res) => {
  return  res.status(200).json('Welcome, your login app is working well');
  // const { floorId, password } = req.body;
  // try {
  //   const user = await Auth.findOne({ _id: floorId });
  //   console.log(user);
  //   if (!user) {
  //     return res.json({ status: "failed", message: "Error Floor not Found" });
  //   }
  //   const passwordCompare = await bcrypt.compare(password, user?.password);

  //   if (!passwordCompare) {
  //     return res.json({
  //       status: "failed",
  //       message: "Please login with correct credentials",
  //     });
  //   }
  //   const data = { _id: user?._id, floorName: user?.floorName };
  //   const authToken = jwt.sign(data, jwtString);
  //   return res.json({
  //     status: "success",
  //     data: {
  //       _id: user?._id,
  //       floorName: user?.floorName,
  //       authToken: authToken,
  //       role: user?.role,
  //     },
  //   });
  // } catch (error) {
  //   return res
  //     .status(500)
  //     .json({ status: "failed", message: "internal server error" });
  // }
});

// router.get("/getFloor", async (req, res) => {
//   try {
//     const floorList = await Auth.find();

//     return res.json({
//       status: "success",
//       data: { floorList: floorList },
//     });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ status: "failed", message: "internal server error" });
//   }
// });

// router.get("/getFr", async (req, res) => {
//   return res.send({ status: "failed", message: "internal server error" });
// });

module.exports = router;
