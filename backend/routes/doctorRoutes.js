const router = require("express").Router();
const {  updateAppointment, doctorGetAppointments, addDiagnosis, getAppointmentById, doctorGetAppointmentsWithPatient, doctorGetTodaysAppointments } = require("../controllers/appointmentController");
const { createAvailability, getAvailability, deleteAvailability, getAvailabilityByDoctorId, updateAvailability } = require("../controllers/availabilityController");
const { getDepartment } = require("../controllers/departmentController");
const { getDiagnosis, getDiagnosesByDepartment,  } = require("../controllers/diagnosisController");
const { loginDoctor, logoutDoctor, getDoctorByDepartment, getDoctorInfo, } = require("../controllers/doctorController");
const { createPrescription } = require("../controllers/prescriptionController");
const {protect} = require('../middlewares/authMiddleware');
const Doctor = require("../models/doctor.model");

router.get('/get', protect(Doctor), getDoctorInfo)

//Department Route
router.get('/department', getDepartment)
router.get('/department/:id', getDoctorByDepartment)

//Diagnosis Route
router.get('/diagnosis/get', getDiagnosis )
router.get('/diagnosis/:department', getDiagnosesByDepartment )

//Auth Routes
router.post('/login', loginDoctor)
router.post('/logout', logoutDoctor)

//Appointment Routes
router.get('/appointment/get', protect(Doctor), doctorGetAppointments )
router.get('/appointment/today', protect(Doctor), doctorGetTodaysAppointments )
router.get('/appointment/:id', protect(Doctor), doctorGetAppointmentsWithPatient)
router.get('/appointment/spec/:appointmentId', getAppointmentById)
router.put('/appointment/diagnosis/:id/:selectedDiagnosis', addDiagnosis)
router.put('/appointment/:id', updateAppointment )
router.post('/appointment/prescription/create', createPrescription)

//Availability Route
router.get('/availability/get',protect(Doctor),getAvailability)
router.get('/availability/:id',getAvailabilityByDoctorId)
router.post('/availability/create', protect(Doctor),createAvailability)
router.put('/availability/:id', protect(Doctor), updateAvailability); 
router.delete('/availability/:id', protect(Doctor),deleteAvailability)




module.exports = router;