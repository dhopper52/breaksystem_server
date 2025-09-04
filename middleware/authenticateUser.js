const jwtString = process.env.JWT_STRING;
const jwt = require("jsonwebtoken");
const Auth = require("../models/authModels/authModel");

const authenticateUser = async (req, res, next) => {
  const token = req.header("auth-token");
console.log("Authenticate User Middleware Started");
  console.log(token);
  if (!token) {
    console.log("Token missing");
    return res.status(401).json({ 
      error: "Please authenticate using a valid token",
      code: "TOKEN_MISSING"
    });
  }
  
  try {
    // Verify JWT token
    const decoded = jwt.verify(token, jwtString);
    console.log(decoded,"decoded");
    // Check if token has expired
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      console.log("token expired");
      return res.status(401).json({ 
        error: "Token expired. Please login again.",
        code: "TOKEN_EXPIRED"
      });
    }
    
    // Fetch current user data from database
    const currentUser = await Auth.findById(decoded.user._id);
    console.log(currentUser,"currentUser");
    if (!currentUser) {
      return res.status(401).json({ 
        error: "User not found",
        code: "USER_NOT_FOUND"
      });
    }
    
    // Compare password hash from token with current database password
    if (decoded.passwordHash !== currentUser.password) {
      console.log("password changed");
      return res.status(401).json({ 
        error: "Password changed. Please login again.",
        code: "PASSWORD_CHANGED"
      });
    }
    
    // Token is valid, attach user data to request
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: "Token expired. Please login again.",
        code: "TOKEN_EXPIRED"
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: "Invalid token. Please authenticate again.",
        code: "INVALID_TOKEN"
      });
    }
    
    return res.status(401).json({ 
      error: "Authentication failed. Please login again.",
      code: "AUTH_FAILED"
    });
  }
};
module.exports = authenticateUser;
