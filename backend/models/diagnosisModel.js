const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const diagnosisSchema = new Schema(
  {
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "department",
      },
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const DiagnosisModel = mongoose.model("diagnosis", diagnosisSchema);

module.exports = DiagnosisModel;
