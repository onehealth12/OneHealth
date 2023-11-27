const asyncHandler = require("express-async-handler");
const cloudinary = require("../utils/cloudinary");
const LabResult = require("../models/labResultModel");
const Appointment = require("../models/appointment.model");

const createLabResult = asyncHandler(async (req, res) => {
  const { appointmentId, labFiles } = req.body;

  try {
    if (!appointmentId) {
      return res.status(400).json({ error: "appointmentId is required" });
    }

    const uploadedFiles = await Promise.all(
      labFiles.map(async (labFile) => {
        const result = await cloudinary.uploader.upload(labFile, {
          resource_type: "auto", // Set resource_type to 'raw' to preserve original file type
          folder: "lab_results",
        });

        return {
          public_id: result.public_id,
          url: result.secure_url,
        };
      })
    );

    // Create LabResult documents
    const labResults = await LabResult.create(
      uploadedFiles.map((file) => ({
        appointmentId,
        labFile: file,
      }))
    );

    // Update the Appointment model with references to the created LabResult documents
    await Appointment.findByIdAndUpdate(
      appointmentId,
      { $push: { labResult: { $each: labResults.map(result => result._id) } } },
      { new: true }
    );

    res.status(201).json(labResults);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = {
  createLabResult,
};



module.exports = {
  createLabResult,
};
