const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      following: ["SUPERADMIN", "ADMIN", "UNITMANAGER", "USER"],
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
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

userSchema.pre('save', async function(next){
    if (this.isNew){
        const rPrefix = {
            ADMIN : "AD",
            UNITMANAGER : "UM",
            USER : "US",
        }[this.role]
    }
    if (rPrefix){
        const User = mongoose.model('User', userSchema);
        const count = await User.countDocuments({ role: this.role });
        this.userId = `${rPrefix}${count + 1}`;
    } else if (this.role === "SUPERADMIN"){
        this.userId = `SA1`;
    }
    next();
})




module.exports = mongoose.model('User', userSchema);