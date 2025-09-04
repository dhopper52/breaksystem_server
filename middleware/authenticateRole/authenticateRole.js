const authenticateRole = (req, res, next) => {
  try {
    const role = req.body?.localUser?.role;
    if (role !== "superAdmin") {
      // console.log("not superAdmin");
      return res
        .status(403)
        .send({ error: "You are not authorized to perform this task" });
    }
    // console.log("its super admin");
    next();
  } catch (error) {
    res.status(401).send({ error: "Internal server error" });
  }
};
module.exports = authenticateRole;
