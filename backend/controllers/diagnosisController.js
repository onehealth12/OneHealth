const asyncHandler = require("express-async-handler");
const Diagnosis = require('../models/diagnosisModel');
const Admin = require('../models/adminModel');

const createDiagnosis = asyncHandler(async (req, res) => {
    const { name, department } = req.body.diagnosis;
  
    try {
      const newDiagnosis = await Diagnosis.create({ name, department });
      res.status(201).json(newDiagnosis);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

const getDiagnosis = asyncHandler(async (req, res) => {
  Diagnosis.find({}).populate("department")
    .then((diagnosis) => res.json(diagnosis))
    .catch((err) => res.status(400).json("Error: " + err));
});

const getDiagnosesByDepartment = asyncHandler(async (req, res) => {
  const department = req.params.department;
  Diagnosis.find({ department: department })
    .then(diagnoses => {
      res.json(diagnoses);
    })
    .catch(error => {
      res.status(500).json("Error: " + error);
    });
});

const deleteDiagnosis = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.user.id);

  if (!admin) {
    res.status(401);
    throw new Error("Admin not found");
  }

  Diagnosis.findById(req.params.id)
    .then((diagnosis) => {
      if (!diagnosis) {
        res.status(404);
        throw new Error("Diagnosis not found");
      }

      // If the user is authorized, proceed with the deletion
      return Diagnosis.findByIdAndDelete(req.params.id);
    })
    .then(() => {
      res.json("Diagnosis was deleted");
    })
    .catch((err) => res.status(400).json("Error: " + err));
})

module.exports = {
  createDiagnosis,
  getDiagnosis,
  getDiagnosesByDepartment,
  deleteDiagnosis
};
