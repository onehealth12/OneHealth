const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const daySchema = new Schema(
  {
    day: {
      type: String,
      enum:["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      required: true,
    },
    startTime: {
      type: String, // Assuming time is represented as a string, you can use Date if you prefer
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  { _id: false } // This will prevent MongoDB from automatically creating _id for each day
);

const availabilitySchema = new Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
      required: true,
    },
    daysAvailability: [daySchema],
  },
  {
    timestamps: true,
  }
);

const AvailabilityModel = mongoose.model("availability", availabilitySchema);

module.exports = AvailabilityModel;
