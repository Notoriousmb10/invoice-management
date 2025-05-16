const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },  
    role: {
      type: String,
      enum: ["SUPERADMIN", "ADMIN", "UNITMANAGER", "USER"],
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: false,
    },
    groupBy: {
      type: String,
    },
    createdBy: {
      type: String,
    },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const rolePrefix = {
      ADMIN: "A",
      UNITMANAGER: "UM",
      USER: "U",
    }[this.role];

    if (rolePrefix) {
      const count = await mongoose.models.User.countDocuments({ role: this.role });
      this.userId = `${rolePrefix}${count + 1}`;
    } else if (this.role === "SUPERADMIN") {
      this.userId = "S1";
    }
  }

  next();
});




module.exports = mongoose.model('User', userSchema);