const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Define a schema for the medicine
const MedicineSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  dosage: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  notes: {
    type: String
  }
});

// Update the prescription schema to include an array of medicines
const prescriptionSchema = new Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "appointment",
      required: true
    },
    medicines: [MedicineSchema] // Array of medicines
  },
  {
    timestamps: true
  }
);

const PrescriptionModel = mongoose.model("prescription", prescriptionSchema);

module.exports = PrescriptionModel;
