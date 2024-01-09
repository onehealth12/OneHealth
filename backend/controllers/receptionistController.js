const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const Admin = require("../models/adminModel");
const Receptionist = require('../models/receptionistModel')
const { generateToken } = require("../middlewares/generateToken");

//Get Receptionist
const getReceptionist = asyncHandler(async (req, res) => {
  Receptionist.find({})
    .then((receptionist) => res.json(receptionist))
    .catch((err) => res.status(400).json("Error: " + err));
});


//Register Receptionist
const registerReceptionist = asyncHandler(async (req, res) => {
  const admin = req.user.id;
  const { firstName, lastName, email, password} = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  //Check if receptionist exists
  const receptionistExists = await Receptionist.findOne({ email });
  if (receptionistExists) {
    res.status(400);
    throw new Error("Receptionist already exists");
  }

  //Create Receptionist
  const hashedPassword = await bcrypt.hash(password, 10);

  const receptionist = await Receptionist.create({
    admin,
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  if (receptionist) {
    res.status(200).json({
      _id: receptionist.id,
      name: receptionist.name,
      email: receptionist.email,
      token: generateToken(receptionist._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid receptionist data");
  }
});

// Update Receptionist
const updateReceptionist = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.user.id);
  
    if (!admin) {
      res.status(401);
      throw new Error("admin not found");
    }
  
    const receptionistId = req.params.id;
  
    Receptionist.findById(receptionistId)
      .then(async (receptionist) => {
        if (!receptionist) {
          res.status(404);
          throw new Error("receptionist record not found");
        }
  
        if (receptionist.admin.toString() !== admin.id) {
          res.status(401);
          throw new Error("User not authorized");
        }

        const { firstName, lastName, email, licenseNumber} = req.body;
  
        receptionist.firstName = firstName;
        receptionist.lastName = lastName;
        receptionist.email = email;
        receptionist.licenseNumber = licenseNumber;
  
  
        receptionist
          .save()
          .then(() => res.json("Receptionist was updated"))
          .catch((err) => res.status(400).json("Error: " + err));
      })
      .catch((err) => res.status(400).json("Error: " + err));
  });
  
//Delete Receptionist
const deleteReceptionist = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.user.id);

  if (!admin) {
    res.status(401);
    throw new Error("Admin not found");
  }

  Receptionist.findById(req.params.id)
    .then((receptionist) => {
      if (!receptionist) {
        res.status(404);
        throw new Error("Receptionist not found");
      }

      // If the user is authorized, proceed with the deletion
      return Receptionist.findByIdAndDelete(req.params.id);
    })
    .then(() => {
      res.json("Receptionist was deleted");
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// Login Receptionist
const loginReceptionist = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const receptionist = await Receptionist.findOne({ email });

  if (receptionist && (await bcrypt.compare(password, receptionist.password))) {
    res.json({
      _id: receptionist.id,
      name: receptionist.name,
      email: receptionist.email,
      token: generateToken(receptionist._id),
      message: "Receptionist logged in",
    });
  } else {
    res.status(400);
    throw new Error("Invalid receptionist data");
  }
});

// logout Receptionist
const logoutReceptionist = asyncHandler(async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while logging out" });
  }
  res.json({ message: "Receptionist logged out" });
});

module.exports = {
    getReceptionist,
    registerReceptionist,
    updateReceptionist,
    deleteReceptionist,
    loginReceptionist,
    logoutReceptionist
};
