const User = require("../models/User");

const createUser = async (req, res) => {
  try {
    const creatorRole = req.user.role;
    const creatorId = req.user.userId;

    const { userName, email, role, password, groupBy } = req.body;

    const roles = {
      SUPERADMIN: "ADMIN",
      ADMIN: "UNITMANAGER",
      UNITMANAGER: "USER",
    };

    if (roles[creatorRole] !== role) {
      return res
        .status(403)
        .json({ msg: `${creatorRole} cannot create a ${role}` });
    }
    const exisitng = await User.findOne({ email });
    if (exisitng) {
      return res.status(400).json({ msg: "User already exists" });
    }
    const bcrypt = require("bcrypt");
    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({
      userName,
      email,
      role,
      password: hash,
      groupBy,
      createdBy: req.user.userId,
    });
    res.status(201).json({ msg: "User created", userId: newUser.userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error creating user" });
  }
};
