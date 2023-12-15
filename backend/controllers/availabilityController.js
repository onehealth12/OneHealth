const asyncHandler = require("express-async-handler");
const Availability = require('../models/availabilityModel');
const Doctor = require('../models/doctor.model')
const moment = require('moment-timezone');

const getAvailability = asyncHandler(async (req, res) => {
  Availability.find({ doctorId: req.user.id })
    .then(availabilities => {
      res.json(availabilities);
    })
    .catch(error => {
      res.status(500).json("Error: " + error);
    });
});

const getAllAvailability = asyncHandler(async (req, res) => {
  Availability.find({}).populate({
    path: "doctorId",
    select: "firstName lastName specialization dept_id",
    populate: {
      path: "dept_id",
      select: "name",
    },
  })
    .then(availabilities => {
      res.json(availabilities);
    })
    .catch(error => {
      res.status(500).json("Error: " + error);
    });
});

const getAvailabilityByDoctorId = asyncHandler(async (req, res) => {
  const doctorId = req.params.id;

  try {
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const availabilities = await Availability.find({ doctorId });
    res.json(availabilities);
  } catch (error) {
    res.status(500).json({ error: "Error fetching doctor's availability", details: error.message });
  }
});

const createAvailability = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;
  const { daysAvailability } = req.body;

  if (!daysAvailability || !Array.isArray(daysAvailability) || daysAvailability.length === 0) {
    res.status(400);
    throw new Error("Please provide valid availability data");
  }

  const newAvailability = new Availability({
    doctorId,
    daysAvailability,
  });

  newAvailability.save()
    .then(availability => res.json(availability))
    .catch(err => res.status(400).json("Error: " + err));
});

const deleteAvailability = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.user.id);

  if (!doctor) {
    return res.status(401).json({ error: "Doctor not found" });
  }

  Availability.findById(req.params.id)
    .then((availability) => {
      if (!availability) {
        return res.status(404).json({ error: "Availability not found" });
      }
      if (availability.doctorId.toString() !== doctor.id) {
        return res.status(401).json({ error: "User not authorized" });
      }

      Availability.findByIdAndDelete(req.params.id)
        .then(() => {
          return res.json({ message: "Availability was deleted" });
        })
        .catch((err) => res.status(400).json({ error: "Error: " + err }));
    })
    .catch((err) => res.status(400).json({ error: "Error: " + err }));
});

const updateAvailability = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;
  const availabilityId = req.params.id
  const {  updatedAvailability } = req.body;

  if (!availabilityId) {
    res.status(400);
    throw new Error("Please provide availabilityId");
  }

  if ( !updatedAvailability) {
    res.status(400);
    throw new Error("Please provide updatedAvailability");
  }

  try {
    const availability = await Availability.findById(availabilityId);

    if (!availability) {
      return res.status(404).json({ error: "Availability not found" });
    }

    if (availability.doctorId.toString() !== doctorId) {
      return res.status(401).json({ error: "User not authorized" });
    }

    availability.daysAvailability = updatedAvailability;

    const savedAvailability = await availability.save();
    res.json(savedAvailability);
  } catch (error) {
    res.status(500).json({ error: "Error updating availability", details: error.message });
  }
});

module.exports = {
  getAvailability,
  createAvailability,
  deleteAvailability,
  getAvailabilityByDoctorId,
  getAllAvailability,
  updateAvailability
};
