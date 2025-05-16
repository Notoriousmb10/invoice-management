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

const updateUser = async (req, res) => {
  try {
    const { userId, newRole } = req.body;
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    user.role = newRole;
    await user.save();
    res.json({
      msg: "User updated",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error updating user" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOneAndDelete({ userId });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({
      msg: "User deleted",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error deleting user" });
  }
};

const listUsers = async (req, res) => {
  try {
    const theOneWhoMadeTheRequest = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    let filter = {};
    if (theOneWhoMadeTheRequest.role === "USER") {
      return res.status(403).json({ msg: "Unauthorized to list users" });
    } else if (theOneWhoMadeTheRequest.role === "UNITMANAGER") {
      filter = {
        $or: [{ createdBy: theOneWhoMadeTheRequest.userId }, { groupId: theOneWhoMadeTheRequest.groupId }],
        role: "USER",
      };
    } else if (req.user.role === "ADMIN") {
      filter = {
        $or: [{ createdBy: theOneWhoMadeTheRequest.userId }, { groupId: theOneWhoMadeTheRequest.groupId }],
      };
    } else if (req.user.role === "SUPERADMIN") {
      filter = {
        $or: [{ createdBy: theOneWhoMadeTheRequest.userId }, { groupId: theOneWhoMadeTheRequest.groupId }],
      };
    }
    const users = await User.find(filter)
      .select("-password")
      .skip(skip)
      .limit(limit);

    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error listing users" });
  }
};

module.exports = {
  createUser,
  deleteUser,
  updateUser,
  listUsers,
};
