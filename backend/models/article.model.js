const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const articleSchema = new Schema(
  {
    doctor:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'Doctor'
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

const ArticleModel = mongoose.model("article", articleSchema);

module.exports = ArticleModel;
