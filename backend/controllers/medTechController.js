const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const MedTech = require('../models/medTechModel')
const Admin = require("../models/adminModel");
const { generateToken } = require("../middlewares/generateToken");


const getMedTech = asyncHandler(async (req, res) => {
    MedTech.find({})
      .then((medTech) => res.json(medTech))
      .catch((err) => res.status(400).json("Error: " + err));
  });

const registerMedTech = asyncHandler(async (req, res) => {
    const admin = req.user.id;
    const { firstName, lastName, email, password, licenseNumber} = req.body;
  
    if (!firstName || !lastName || !email || !password || !licenseNumber) {
      res.status(400);
      throw new Error("Please fill all fields");
    }
  
    //Check if medTech exists
    const medTechExists = await MedTech.findOne({ email });
    if (medTechExists) {
      res.status(400);
      throw new Error("medTech already exists");
    }
  
    //Create medTech
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const medTech = await MedTech.create({
      admin,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      licenseNumber,
    });
  
    if (medTech) {
      res.status(200).json({
        _id: medTech.id,
        name: medTech.name,
        email: medTech.email,
        token: generateToken(medTech._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid medTech data");
    }
  });

  // Update Medtech
const updateMedtech = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.user.id);
  
    if (!admin) {
      res.status(401);
      throw new Error("admin not found");
    }
  
    const medTechId = req.params.id;
  
    MedTech.findById(medTechId)
      .then(async (medTech) => {
        if (!medTech) {
          res.status(404);
          throw new Error("medTech record not found");
        }
  
        if (medTech.admin.toString() !== admin.id) {
          res.status(401);
          throw new Error("User not authorized");
        }
  
        const { firstName, lastName, email, licenseNumber} = req.body;
  
        medTech.firstName = firstName;
        medTech.lastName = lastName;
        medTech.email = email;
        medTech.licenseNumber = licenseNumber;
  
  
        medTech
          .save()
          .then(() => res.json("Med Tech was updated"))
          .catch((err) => res.status(400).json("Error: " + err));
      })
      .catch((err) => res.status(400).json("Error: " + err));
  });
  
//Delete medTech
const deleteMedTech = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.user.id);

  if (!admin) {
    res.status(401);
    throw new Error("Admin not found");
  }

  MedTech.findById(req.params.id)
    .then((medTech) => {
      if (!medTech) {
        res.status(404);
        throw new Error("medTech not found");
      }

      // If the user is authorized, proceed with the deletion
      return MedTech.findByIdAndDelete(req.params.id);
    })
    .then(() => {
      res.json("MedTech was deleted");
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// Login MedTech
const loginMedTech = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const medTech = await MedTech.findOne({ email });

  if (medTech && (await bcrypt.compare(password, medTech.password))) {
    res.json({
      _id: medTech.id,
      name: medTech.name,
      email: medTech.email,
      token: generateToken(medTech._id),
      message: "Nurse logged in",
    });
  } else {
    res.status(400);
    throw new Error("Invalid medTech data");
  }
});

// logout MedTech
const logoutMedTech = asyncHandler(async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while logging out" });
  }
  res.json({ message: "MedTech logged out" });
});

module.exports = {
    getMedTech,
    registerMedTech,
    updateMedtech,
    loginMedTech,
    deleteMedTech,
    logoutMedTech
}