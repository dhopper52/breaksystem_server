const jwtString = process.env.JWT_STRING;
const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  // console.log({ req });
  const token = req.header("auth-token");
  // console.log(token);

  if (!token) {
    return res
      .status(401)
      .json({ error: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, jwtString);
    req.user = data.user;
    // console.log(`middlewear  data   ${data.user}`);
    next();
  } catch (error) {
    res.status(401).send({ error: "Pleases authenticate using a valid token" });
  }
};
module.exports = authenticateUser;
