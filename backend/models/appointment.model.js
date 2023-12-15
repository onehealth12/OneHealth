const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const appointmentSchema = new Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
      required: true,
    },
    prescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "prescription",
    },
    labResult: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "labResult",
    }],
    appointmentDateTime: { 
      type: Date,
      required: true
    },
    reason: { 
      type: String,
      required: true,
      trim:true
    },
    diagnosis: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'diagnosis'
    },
    diagnosisNotes: { 
      type: String,
      trim:true
    },
    appt_status: {
      type: String,
      default:"Upcoming",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);



const AppointmentModel = mongoose.model("appointment", appointmentSchema);

module.exports = AppointmentModel;
