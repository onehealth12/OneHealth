const router = require("express").Router();
const {registerAdmin, loginAdmin, logoutAdmin, getAdmin} = require('../controllers/adminController');
const { getDepartment, createDepartment, deleteDepartment, updateDepartment } = require("../controllers/departmentController");
const { createDiagnosis, getDiagnosisByCategory } = require("../controllers/diagnosisController");
const { getDoctor, registerDoctor, updateDoctor, deleteDoctor } = require("../controllers/doctorController");
const { getMedTech, registerMedTech, deleteMedTech } = require("../controllers/medTechController");
const { getNurse, registerNurse, deleteNurse, updateNurse } = require("../controllers/nurseController");
const { getRadTech, registerRadTech, deleteRadTech } = require("../controllers/radTechController");
const { getReceptionist, registerReceptionist, updateReceptionist, deleteReceptionist } = require("../controllers/receptionistController");
const {protect} = require('../middlewares/authMiddleware');
const AdminModel = require("../models/adminModel");




//For admin
router.get('/', protect(AdminModel), getAdmin)
router.post('/register', registerAdmin)
router.post('/login', loginAdmin)
router.post('/logout', logoutAdmin)

//For Diagnosis
router.post('/diagnosis/create', createDiagnosis)


//For department
router.get('/department/get', protect(AdminModel), getDepartment)
router.post('/department/create', protect(AdminModel), createDepartment)
router.delete('/department/:id', protect(AdminModel), deleteDepartment)
router.delete('/department/:id', protect(AdminModel), updateDepartment)

//For Doctor
router.get("/doctor/get", protect(AdminModel), getDoctor);
router.post("/doctor/create", protect(AdminModel), registerDoctor);
// router.put('/doctor/:id', protect(AdminModel), updateDoctor)
router.delete('/doctor/:id', protect(AdminModel), deleteDoctor)

//For Nurse
router.get('/nurse/get', protect(AdminModel), getNurse)
router.post('/nurse/create', protect(AdminModel), registerNurse)
// router.put('/nurse/:id', protect(AdminModel), updateNurse)
router.delete('/nurse/:id', protect(AdminModel), deleteNurse)

//For MedTech
router.get('/medTech/get', protect(AdminModel), getMedTech)
router.post('/medTech/create', protect(AdminModel), registerMedTech)
// router.put('/medTech/:id', protect(AdminModel), updateMedTech)
router.delete('/medTech/:id', protect(AdminModel), deleteMedTech)

//For RadTech
router.get('/radTech/get', protect(AdminModel), getRadTech)
router.post('/radTech/create', protect(AdminModel), registerRadTech)
// router.put('/radTech/:id', protect(AdminModel), updateRadTech)
router.delete('/radTech/:id', protect(AdminModel), deleteRadTech)

//For Receptionist
router.get('/receptionist/get', protect(AdminModel), getReceptionist)
router.post('/receptionist/create', protect(AdminModel), registerReceptionist)
// router.put('/receptionist/:id', protect(AdminModel), updateReceptionist)
router.delete('/receptionist/:id', protect(AdminModel), deleteReceptionist)



module.exports = router;