const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const announcementSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    announcementImage: [{
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    }],
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AnnouncementModel = mongoose.model("announcement", announcementSchema);

module.exports = AnnouncementModel;
