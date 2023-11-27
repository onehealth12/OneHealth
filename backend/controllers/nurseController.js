const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const Admin = require("../models/adminModel");
const Nurse = require('../models/nurseModel')
const { generateToken } = require("../middlewares/generateToken");

//Get Nurse
const getNurse = asyncHandler(async (req, res) => {
  Nurse.find({})
    .then((nurse) => res.json(nurse))
    .catch((err) => res.status(400).json("Error: " + err));
});


//Register Nurse
const registerNurse = asyncHandler(async (req, res) => {
  const admin = req.user.id;
  const { firstName, lastName, email, password, licenseNumber} = req.body;

  if (!firstName || !lastName || !email || !password || !licenseNumber) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  //Check if nurse exists
  const nurseExists = await Nurse.findOne({ email });
  if (nurseExists) {
    res.status(400);
    throw new Error("Nurse already exists");
  }

  //Create Nurse
  const hashedPassword = await bcrypt.hash(password, 10);

  const nurse = await Nurse.create({
    admin,
    firstName,
    lastName,
    email,
    password: hashedPassword,
    licenseNumber,
  });

  if (nurse) {
    res.status(200).json({
      _id: nurse.id,
      name: nurse.name,
      email: nurse.email,
      token: generateToken(nurse._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid nurse data");
  }
});

// Update Nurse
const updateNurse = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.user.id);
  
    if (!admin) {
      res.status(401);
      throw new Error("admin not found");
    }
  
    const nurseId = req.params.id;
  
    Nurse.findById(nurseId)
      .then(async (nurse) => {
        if (!nurse) {
          res.status(404);
          throw new Error("nurse record not found");
        }
  
        if (nurse.admin.toString() !== admin.id) {
          res.status(401);
          throw new Error("User not authorized");
        }
  
        const { name, email, password} = req.body;
  
        nurse.name = name;
        nurse.email = email;
        nurse.password = password;
  
  
        nurse
          .save()
          .then(() => res.json("Nurse was updated"))
          .catch((err) => res.status(400).json("Error: " + err));
      })
      .catch((err) => res.status(400).json("Error: " + err));
  });
  
//Delete Nurse
const deleteNurse = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.user.id);

  if (!admin) {
    res.status(401);
    throw new Error("Admin not found");
  }

  Nurse.findById(req.params.id)
    .then((nurse) => {
      if (!nurse) {
        res.status(404);
        throw new Error("Nurse not found");
      }

      // If the user is authorized, proceed with the deletion
      return Nurse.findByIdAndDelete(req.params.id);
    })
    .then(() => {
      res.json("Nurse was deleted");
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// Login Nurse
const loginNurse = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const nurse = await Nurse.findOne({ email });

  if (nurse && (await bcrypt.compare(password, nurse.password))) {
    res.json({
      _id: nurse.id,
      name: nurse.name,
      email: nurse.email,
      token: generateToken(nurse._id),
      message: "Nurse logged in",
    });
  } else {
    res.status(400);
    throw new Error("Invalid nurse data");
  }
});

// logout Nurse
const logoutNurse = asyncHandler(async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while logging out" });
  }
  res.json({ message: "Nurse logged out" });
});

module.exports = {
    getNurse,
    registerNurse,
    updateNurse,
    deleteNurse,
    loginNurse,
    logoutNurse
};
