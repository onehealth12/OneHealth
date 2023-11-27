const asyncHandler = require("express-async-handler");
const Diagnosis = require('../models/diagnosisModel');

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
  Diagnosis.find({})
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

module.exports = {
  createDiagnosis,
  getDiagnosis,
  getDiagnosesByDepartment
};
