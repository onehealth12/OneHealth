const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const departmentSchema = new Schema(
  {
    name: {
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
  }
);

const DepartmentModel = mongoose.model("department", departmentSchema);

module.exports = DepartmentModel;
