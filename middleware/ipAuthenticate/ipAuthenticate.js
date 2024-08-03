const allowedIPs = ["192.168.1.1", "203.0.113.5"]; // Replace with your allowed IP addresses

// Middleware function to check IP address
const ipFilter = async (req, res, next) => {
  const ipAddress = req.ip;
  console.log(ipAddress, "..............ipAddress");

  const clientIP =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  console.log(clientIP, "....clientIP");

  const newIpAddress =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  console.log(newIpAddress, "..............newIpAddress");

  const ip =
    (await (req.headers["x-forwarded-for"] || "").split(",").pop().trim()) ||
    req.socket.remoteAddress;
  console.log(ip, "....ip");

  // For IPv6 addresses, remove the leading "::ffff:" prefix if it exists
  const normalizedIP = clientIP.startsWith("::ffff:")
    ? clientIP.replace("::ffff:", "")
    : clientIP;
  console.log(normalizedIP, "....normalizedIP");

  //   if (allowedIPs.includes(normalizedIP)) {
  next(); // IP is allowed, proceed to the next middleware/route handler
  //   } else {
  // res.status(403).send("Access forbidden: Your IP address is not allowed"); // IP is not allowed, return 403 Forbidden
  //   }
};

module.exports = ipFilter;
