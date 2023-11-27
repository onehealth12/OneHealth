const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const addressSchema = new Schema(
  {
    addressLine1: {
      type: String,
      required: true,
      trim: true,
    },
    addressLine2: {
      type: String,
      required: true,
      trim: true,
    },
    barangay: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
        type: String,
        required: true,
        trim: true,
    },
    province: {
      type: String,
      required: true,
      trim: true,
  },
  },
  {
    timestamps: true,
  }
);

const AddressModel = mongoose.model("address", addressSchema);

module.exports = AddressModel;
