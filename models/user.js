const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      min: 6,
      max: 32,
    },

    gender: {
      type: String,
    },

    image: {
      type: String,
    },
    country: {
      type: String,
    },
    address: {
        default: "",
        type: String,
    },
  },
  { timestamps: true }
);

userSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("User", userSchema);
