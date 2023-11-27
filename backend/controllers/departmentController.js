const asyncHandler = require("express-async-handler");
const Department = require("../models/department.model");
const Admin = require("../models/adminModel");

//Get Department
const getDepartment = asyncHandler(async (req, res) => {
  Department.find({})
    .then((department) => res.json(department))
    .catch((err) => res.status(400).json("Error: " + err));
});

//Create Department
const createDepartment = asyncHandler(async (req, res) => {
  const admin = req.user.id;
  const name = req.body.name;

  const newDepartment = new Department({
    admin,
    name,
  });

  //Check if department exists
  const departmentExists = await Department.findOne({ name });
  if (departmentExists) {
    res.status(400);
    throw new Error("Department already exists");
  }

  newDepartment
    .save()
    .then((department) => res.json("New Department Added"))
    .catch((err) => res.status(400).json("Error: " + err));
});



//Delete Department
const deleteDepartment = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.user.id);

  if (!admin) {
    res.status(401);
    throw new Error("Admin not found");
  }

  Department.findById(req.params.id)
    .then((department) => {
      if (!department) {
        res.status(404);
        throw new Error("Department not found");
      }
      
      // If the user is authorized, proceed with the deletion
      return Department.findByIdAndDelete(req.params.id);
    })
    .then(() => {
      res.json("Department was deleted");
    })
    .catch((err) => res.status(400).json("Error: " + err));
});



//Update Department
const updateDepartment = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.user.id);

  if (!admin) {
    res.status(401);
    throw new Error("Admin not found");
  }

  const departmentId = req.params.id;

  Department.findById(departmentId)
    .then((department) => {
      if (!department) {
        res.status(404);
        throw new Error("Department not found");
      }
      if (department.admin.toString() !== admin.id) {
        res.status(401);
        throw new Error("User not authorized");
      }

      const { name } = req.body;

      // Check if the new name already exists
      if (name !== department.name) {
        Department.findOne({ name }).then((existingDepartment) => {
          if (existingDepartment) {
            res.status(400);
            throw new Error("Department with the new name already exists");
          }

          // Update department name
          department.name = name;
          department
            .save()
            .then(() => res.json("Department was updated"))
            .catch((err) => res.status(400).json("Error: " + err));
        });
      } else {
        // Update department name
        department.name = name;
        department
          .save()
          .then(() => res.json("Department was updated"))
          .catch((err) => res.status(400).json("Error: " + err));
      }
    })
    .catch((err) => res.status(400).json("Error: " + err));
});


module.exports = { getDepartment, createDepartment, updateDepartment, deleteDepartment };
