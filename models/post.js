const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    author: {
        id:{
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true
        },
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },

        text: {
          type: String,
          required: true,
        },

        // name: {
        //   type: String,
        // },

        // image: {
        //   type: String,
        // },

        date: {
          type: Date,
          default: Date.now,
        },
        
        totalPost: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
