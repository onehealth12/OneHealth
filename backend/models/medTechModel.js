const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const medTechSchema = new Schema(
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
    licenseNumber: {
      type: String,
      required: true,
      trim: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      required:true,
      ref: 'admin'
    },
  },
  {
    timestamps: true,
  },

);




const MedTechModel = mongoose.model("medTech", medTechSchema);

module.exports = MedTechModel;
