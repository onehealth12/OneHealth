const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const labResultSchema = new Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "appointment",
      required: true,
    },
    labFile: {
      public_id: {
          type: String,
          required: true
      },
      url: {
          type: String,
          required: true
      }
  },
  },
  {
    timestamps: true,
  }
);

const LabResultModel = mongoose.model("labResult", labResultSchema);

module.exports = LabResultModel;
