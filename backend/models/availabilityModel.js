const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const availabilitySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AvailabilityModel = mongoose.model("availability", availabilitySchema);

module.exports = AvailabilityModel;
