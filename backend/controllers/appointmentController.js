const asyncHandler = require("express-async-handler");
const Appointment = require("../models/appointment.model");
const { DateTime } = require("luxon");
const nodemailer = require("nodemailer");
const Patient = require("../models/patientModel");

//Nurse get appointments
const getAllTodaysAppointment = asyncHandler(async (req, res) => {
  // Get tomorrow's date in Singapore time zone
  const tomorrowInSingapore = DateTime.now().setZone("Asia/Singapore");
  const startOfTomorrow = tomorrowInSingapore.startOf("day");
  const endOfTomorrow = tomorrowInSingapore.endOf("day");

  Appointment.find({
    appointmentDateTime: {
      $gte: startOfTomorrow.toJSDate(),
      $lt: endOfTomorrow.toJSDate(),
    },
  })
    .populate("patientId")
    .populate("labResult")
    .populate({
      path: "doctorId",
      select: "firstName lastName dept_id",
      populate: {
        path: "dept_id",
        select: "name",
      },
    })
    .then((appointments) => res.json(appointments))
    .catch((err) => res.status(400).json("Error: " + err));
});

const getAllAppointments = asyncHandler(async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate("patientId")
      .populate("doctorId")
      .populate("diagnosis")
      .populate("labResult");
    if (appointments.length === 0) {
      return res.status(200).json("No Appointments");
    }
    res.json(appointments);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

//Patient get appointments
const getAppointment = asyncHandler(async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user.id })
      .sort({ appointmentDateTime: -1 })
      .populate("patientId")
      .populate({
        path: "doctorId",
        select: "firstName lastName  dept_id ",
        populate: {
          path: "dept_id",
          select: "name",
        },
      })
      .populate("diagnosis")
      .populate("labResult")
      .populate('prescription')
    if (appointments.length === 0) {
      return res.status(200).json("No Appointments");
    }
    io.emit("patientRealTimeAppointments", appointments);
    res.json(appointments);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

const getAppointmentById = asyncHandler(async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId; // Assuming the ID is in the request parameters
    const appointment = await Appointment.findById(appointmentId)
      .populate("doctorId")
      .populate("prescription")
      .populate("patientId")
      .populate("labResult")
      .populate("diagnosis"); // Populate the diagnosis field

    if (!appointment) {
      return res.status(404).json("Appointment not found");
    }

    
    // Fetch past diagnoses for the patient
    const pastAppointments = await Appointment.find({
      patientId: appointment.patientId,
      appointmentDateTime: { $lt: appointment.appointmentDateTime }, // Find appointments before the current one
    })
      .sort({ appointmentDateTime: -1 }) // Sort in descending order
      .populate("diagnosis");

      
    // Use a Set to store unique past diagnosis names
    const uniquePastDiagnoses = new Set();

    // Extract unique past diagnoses
    pastAppointments.forEach((pastAppointment) => {
      const pastDiagnosis = pastAppointment.diagnosis;
      if (pastDiagnosis) {
        uniquePastDiagnoses.add(pastDiagnosis.name);
      }
    });

    const lastAppointment = pastAppointments.length > 0 ? pastAppointments[0].appointmentDateTime : null;

    const appointmentWithPastDiagnoses = {
      ...appointment.toObject(),
      lastAppointment,
      pastDiagnoses: Array.from(uniquePastDiagnoses),
    };
    
    res.json(appointmentWithPastDiagnoses);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});


//Doctor get all appointments
const doctorGetAppointments = asyncHandler(async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user.id })
      .sort({ appointmentDateTime: -1 }) // Sort in descending order
      .populate("patientId")
      .populate("diagnosis")
      .populate("labResult");

    if (appointments.length === 0) {
      return res.status(200).json("No Appointments");
    }

    // Group appointments by patientId
    const appointmentsByPatient = appointments.reduce((acc, appointment) => {
      const patientId = appointment.patientId.toString(); // Convert ObjectId to string
      acc[patientId] = acc[patientId] || [];
      acc[patientId].push(appointment);
      return acc;
    }, {});

    // Calculate the last appointment date for each patient
    const appointmentsWithLastAppointment = Object.values(appointmentsByPatient).flatMap(patientAppointments => {
      patientAppointments.sort((a, b) => a.appointmentDateTime - b.appointmentDateTime);

      // Use a Set to store unique diagnosis names
      const uniqueDiagnoses = new Set();

      const appointmentsWithDiagnoses = patientAppointments.map((appointment, index) => {
        const diagnosis = appointment.diagnosis;

        // Add the diagnosis name to the Set
        if (diagnosis) {
          uniqueDiagnoses.add(diagnosis.name);
        }

        return {
          ...appointment.toObject(),
          lastAppointment: index > 0 ? patientAppointments[index - 1].appointmentDateTime : null,
          pastDiagnoses: Array.from(uniqueDiagnoses), // Convert Set to array for JSON response
        };
      });

      return appointmentsWithDiagnoses;
    });

    io.emit("doctorRealTimeAppointments", appointmentsWithLastAppointment);
    res.json(appointmentsWithLastAppointment);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});


const doctorGetTodaysAppointments = asyncHandler(async (req, res) => {
  try {
    // Get today's date in Singapore time zone
    const todayInSingapore = DateTime.now().setZone("Asia/Singapore");
    const startOfToday = todayInSingapore.startOf("day");
    const endOfToday = todayInSingapore.endOf("day");

    const appointments = await Appointment.find({
      doctorId: req.user.id,
      appointmentDateTime: {
        $gte: startOfToday.toJSDate(),
        $lt: endOfToday.toJSDate(),
      },
    })
      .populate("patientId")
      .populate('diagnosis')
      .populate("labResult")
      .populate({
        path: "doctorId",
        select: "firstName lastName dept_id",
        populate: {
          path: "dept_id",
          select: "name",
        },
      });

    if (appointments.length === 0) {
      return res.status(200).json("No Appointments for Today");
    }

    io.emit("DoctorTodayRealTime", appointments)
    res.json(appointments);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});


const doctorGetAppointmentsWithPatient = asyncHandler(async (req, res) => {
  try {
    const doctorId = req.user.id;
    const patientId = req.params.patientId; // Assuming the patientId is passed in the URL params

    const appointments = await Appointment.find({
      doctorId,
      patientId,
    })
      .populate("patientId")
      .populate("labResult");

    if (appointments.length === 0) {
      return res.status(200).json("No Appointments");
    }

    res.json(appointments);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

const createAppointment = asyncHandler(async (req, res) => {
  const patientId = req.user.id;
  const { doctorId, appointmentDateTime, reason } = req.body;

  if (!doctorId || !appointmentDateTime || !reason) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  // Convert appointmentDateTime to a Luxon DateTime object
  let appointmentDate = DateTime.fromISO(appointmentDateTime, {
    zone: "Asia/Singapore",
  });

  const formattedAppointmentDate =
    appointmentDate.toFormat("MMMM dd, yyyy - t");

  // Fetch patient's email address based on patientId
  const patient = await Patient.findById(patientId);
  if (!patient || !patient.email) {
    res.status(400);
    throw new Error("Patient not found or missing email address");
  }

  const newAppointment = new Appointment({
    patientId,
    doctorId,
    appointmentDateTime: appointmentDate.toJSDate(),
    reason,
  });

  newAppointment
    .save()
    .then((appointment) => {
      // Sending confirmation email after successfully booking the appointment
      sendAppointmentConfirmationEmail(patient.email, formattedAppointmentDate);
      res.json("Created New Appointment");
    })
    .catch((err) => res.status(400).json("Error :" + err));
});

//Need patientId validation and error handling
const createAppointmentByReceptionist = asyncHandler(async (req, res) => {
  const {
    patientId,
    patientFirstName,
    patientLastName,
    email,
    mobileNumber,
    doctorId,
    appointmentDateTime,
    reason,
  } = req.body;

  if (
    !patientId ||
    !patientFirstName ||
    !patientLastName ||
    !doctorId ||
    !appointmentDateTime ||
    !reason
  ) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  const newAppointment = new Appointment({
    patientFirstName,
    patientLastName,
    email,
    mobileNumber,
    patientId,
    doctorId,
    appointmentDateTime,
    reason,
  });

  newAppointment
    .save()
    .then((appointment) => {
      sendAppointmentConfirmationEmail(email, appointmentDate);
      res.json("Created New Appointment");
    })
    .catch((err) => res.status(400).json("Error :" + err));
});

const updateAppointment = asyncHandler(async (req, res) => {
  const appointmentId = req.params.id;
  const { status } = req.body;

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    // Check if the new status is the same as the old status
    if (appointment.appt_status === status) {
      // If yes, alternate between the current status and "Done"
      appointment.appt_status = appointment.appt_status === "Done" ? status : "Done";
    } else {
      // If not, update the appointment status with the provided status
      appointment.appt_status = status;
    }

    // Save the updated appointment
    await appointment.save();

    // Emit the event to update the client side
    io.emit("appointmentUpdated", appointment);
    return res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


const addDiagnosis = asyncHandler(async (req, res) => {
  const appointmentId = req.params.id;
  const diagnosisNotes = req.body.diagnosisNotes
  const diagnosisId = req.params.selectedDiagnosis;

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }


    // Update the appointment status
    appointment.diagnosis = diagnosisId;
    appointment.diagnosisNotes = diagnosisNotes;

    // Save the updated appointment
    await appointment.save();

    return res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = {
  getAllTodaysAppointment,
  getAppointment,
  createAppointment,
  updateAppointment,
  doctorGetAppointments,
  createAppointmentByReceptionist,
  addDiagnosis,
  getAppointmentById,
  doctorGetAppointmentsWithPatient,
  getAllAppointments,
  doctorGetTodaysAppointments,
};

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER ,
    pass: process.env.EMAIL_PASS 
  },
});

async function sendAppointmentConfirmationEmail(
  email,
  formattedAppointmentDate
) {
  // Send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"One Health Cainta" <onehealth.cainta@gmail.com>',
    to: email,
    subject: "Appointment Confirmation",
    text: `Dear Patient,\n\nYour appointment has been booked for the following date and time: ${formattedAppointmentDate}.\n\nThank you for choosing our clinic.\n\nSincerely,\nOne Health Cainta Team`,
    html: `<p>Dear Patient,</p><p>Your appointment has been booked for the following date and time: ${formattedAppointmentDate}.</p><p>Thank you for choosing our clinic.</p><p>Sincerely,<br>One Health Cainta Team</p>`,
  });

  console.log("Message sent: %s", info.messageId);
}
