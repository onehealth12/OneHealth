const asyncHandler = require("express-async-handler");
const Prescription = require("../models/prescriptionModel");
const Appointment = require('../models/appointment.model')

const createPrescription = asyncHandler(async (req, res) => {
  const { appointmentId, medicines } = req.body;

  if (
    !appointmentId ||
    !medicines ||
    !Array.isArray(medicines) ||
    medicines.length === 0
  ) {
    res
      .status(400)
      .json("Please provide valid appointment ID and an array of medicines");
    return;
  }

  try {
    const newPrescription = new Prescription({
      appointmentId,
      medicines, // Assign the array of medicines to the prescription
    });

    // After saving the prescription successfully
    const savedPrescription = await newPrescription.save();

    // Update the respective appointment with the new prescription ID
    await Appointment.findOneAndUpdate(
      { _id: appointmentId }, // Find the appointment by ID
      { $set: { prescription: savedPrescription._id } }, // Update its prescription field
      { new: true }
    );

    res.json("Created new prescription with medicines");
  } catch (err) {
    res.status(500).json("Error: " + err);
  }
});

module.exports = {
  createPrescription,
};
