const router = require("express").Router();
const { getAllTodaysAppointment } = require("../controllers/appointmentController");
const { loginRadTech, logoutRadTech } = require("../controllers/radTechController");



//Get patients for the day.

router.post('/login', loginRadTech)
router.post('/logout', logoutRadTech)


router.get('/appointment/get', getAllTodaysAppointment)

module.exports = router;