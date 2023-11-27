const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const doctorSchema = new Schema(
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
      required: true,
      trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      trim: true,
    },
    signature:{
      public_id: {
          type: String,
          required: true
      },
      url: {
          type: String,
          required: true
      }
  },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      required:true,
      ref: 'admin'
    },
    dept_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'department'
    },
  },
  {
    timestamps: true,
  },

);

doctorSchema.virtual('department', {
  ref: 'department',
  localField: 'dept_id',
  foreignField: '_id', 
  justOne: true,
})



const DoctorModel = mongoose.model("doctor", doctorSchema);

module.exports = DoctorModel;
