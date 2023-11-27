const router = require("express").Router();
const { getDepartment } = require("../controllers/departmentController");





router.get('/get', getDepartment)

module.exports = router