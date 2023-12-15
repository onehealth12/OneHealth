const router = require("express").Router();
const { getAllTodaysAppointment } = require("../controllers/appointmentController");
const { loginMedTech, logoutMedTech } = require("../controllers/medTechController");
const { createLabResult } = require("../controllers/labResultController");



//Get patients for the day.

router.post('/login', loginMedTech)
router.post('/logout', logoutMedTech)


router.get('/appointment/get', getAllTodaysAppointment)
router.post('/appointment/labresult/create', createLabResult)

module.exports = router;