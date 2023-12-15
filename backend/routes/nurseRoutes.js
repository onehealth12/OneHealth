const router = require("express").Router();
const { getAllTodaysAppointment } = require("../controllers/appointmentController");
const {loginNurse, logoutNurse} = require('../controllers/nurseController')

//Get patients for the day.

router.post('/login', loginNurse)
router.post('/logout', logoutNurse)


router.get('/appointment/get', getAllTodaysAppointment)

module.exports = router;