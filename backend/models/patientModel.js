const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const patientSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    mobileNumber: {
      type: String,
      trim: true,
    },
    landline: {
      type: String,
      trim: true,
    },
    birthday: {
      type: Date,
      trim: true,
    },
    sex: {
      type: String,
      trim: true,
    },
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "address",
    },
  },
  {
    timestamps: true,
  }
);

const PatientModel = mongoose.model("patient", patientSchema);

module.exports = PatientModel;
