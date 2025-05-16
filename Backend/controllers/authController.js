const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const register = async (req, res) => {
  try {
    const { username, email, role, password } = req.body;
    console.log(req.body);

    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    if (role !== "SUPERADMIN") {
      return res.status(403).json({
        msg: "Public registration is disabled for non-SUPERADMIN roles.",
      });
    }

    const existingSuperAdmin = await User.findOne({ role: "SUPERADMIN" });
    if (existingSuperAdmin) {
      return res.status(403).json({
        msg: "SUPERADMIN already exists. Contact system administrator.",
      });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Email already exists." });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      role,
      password: hashed,
    });

    await newUser.save();

    res.status(201).json({
      msg: "SUPERADMIN registered successfully.",
      userId: newUser.userId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error during registration." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, timezone } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not Found" });
    }
    console.log(" Raw input password:", password);
    console.log(" Hashed password in DB:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);

    console.log(" Password Match:", isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    console.log(" Timezone received:", timezone);
    console.log(" Type of timezone:", typeof timezone);

    if (!timezone || typeof timezone !== "string") {
      return res.status(400).json({ message: "invalid timezone" });
    }
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    res.json({
      token,
      username: user.username,
      email: user.email,
      role: user.role,
      userId: user.userId,
      groupId: user.groupId || null,

    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  register,
  login,
};
