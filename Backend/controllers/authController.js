const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const register = async (req, res) => {
  try {
    const { userName, email, role, password, userId, groupBy, createdBy } =
      req.body;

    if (!userName || !email || !password || !role) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = new User({
      userName,
      email,
      role,
      password: hash,
      userId,
      groupBy,
      createdBy,
    });
    await user.save();
    res
      .status(201)
      .json({ message: "User created successfully", userId: user.userId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, timeZone } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not Found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (!timeZone || typeof timeZone !== "string") {
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
      userName: user.userName,
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
}