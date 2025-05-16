const jwt = require("jsonwebtoken");

const authenticateUserr = (req, res, next) => {
  const authenticateHeader = req.headers.authorization;

  if (!authenticateHeader || !authenticateHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token provided" });
  }
  const token = authenticateHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res.status(400).json({ msg: "Invalid token" });
  }
};

const authorizeDRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Access denied: Unauthorized Role" });
    }
    next();
  };
};

module.exports = { authenticateUserr, authorizeDRoles };