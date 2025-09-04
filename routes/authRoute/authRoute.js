const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Auth = require("../../models/authModels/authModel");
const authenticateRole = require("../../middleware/authenticateRole/authenticateRole");
const authenticateUser = require("../../middleware/authenticateUser");
const jwtString = process.env.JWT_STRING;

router.post("/signup", authenticateRole, async (req, res) => {
  const { _id, floorName, password, role } = req.body;

  try {
    const isExist = await Auth.findOne({ _id: _id });

    if (isExist) {
      return res.json({ status: "failed", message: "Floor Already Exist" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const auth = new Auth({
      _id,
      floorName,
      password: hashPassword,
      role: role,
    });
    const saveAuth = await auth.save();

    return res.json({ status: "success", data: saveAuth });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "failed", message: "internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { floorId, password } = req.body;
  try {
    const user = await Auth.findOne({ _id: floorId });
    // console.log(user);
    if (!user) {
      return res.json({ status: "failed", message: "Error Floor not Found" });
    }
    const passwordCompare = await bcrypt.compare(password, user?.password);

    if (!passwordCompare) {
      return res.json({
        status: "failed",
        message: "Please login with correct credentials",
      });
    }
    
    // Create JWT with user data and password hash
    const tokenData = {
      user: {
        _id: user._id,
        floorName: user.floorName,
        role: user.role
      },
      passwordHash: user.password, // Store current password hash
      iat: Math.floor(Date.now() / 1000), // Issued at
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    };
    
    const authToken = jwt.sign(tokenData, jwtString);
    
    return res.json({
      status: "success",
      data: {
        _id: user?._id,
        floorName: user?.floorName,
        authToken: authToken,
        role: user?.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ status: "failed", message: "internal server error" });
  }
});

router.get("/getFloor", authenticateUser, async (req, res) => {
  try {
    const floorList = await Auth.find();

    return res.json({
      status: "success",
      data: { floorList: floorList },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "failed", message: "internal server error" });
  }
});

router.get("/getFr", async (req, res) => {
  return res.send({ status: "failed", message: "internal server error" });
});

router.put("/updateFloor", authenticateUser, async (req, res) => {
  const { _id, floorName, password, role } = req.body;
  // console.log(req.body);
  
  try {
    const isExist = await Auth.findOne({ _id: _id });
    // console.log({ isExist });
    if (!isExist) {
      return res.json({ status: "failed", message: "Floor Doesn't Exist" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const now = new Date();

    const saveAuth = await Auth.findByIdAndUpdate(
      _id,
      {
        _id,
        floorName,
        password: hashPassword,
        role: role,
        passwordChangedAt: now,
        lastPasswordChange: now
      },
      { new: true }
    );
 
    return res.json({ 
      status: "success", 
      data: saveAuth,
      message: "Password updated successfully. All active sessions will be invalidated."
    });
  } catch (error) {
    console.error("Update floor error:", error);
    return res
      .status(500)
      .json({ status: "failed", message: "internal server error" });
  }
});

module.exports = router;
