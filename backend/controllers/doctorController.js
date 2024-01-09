const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const Doctor = require("../models/doctor.model");
const Department = require("../models/department.model");
const Admin = require("../models/adminModel");
const { generateToken } = require("../middlewares/generateToken");
const cloudinary = require("../utils/cloudinary");

const getDoctorInfo = asyncHandler(async (req, res) => {
  Doctor.findById(req.user.id)
    .then((doctor) => res.json(doctor))
    .catch((err) => res.status(400).json("Error: " + err));
});

//Get Doctor by Admin User
const getDoctor = asyncHandler(async (req, res) => {
  Doctor.find({}).populate('dept_id', 'name')
    .then((doctor) => {
      io.emit("realTimeGetDoctor", doctor);
      res.json(doctor)})
    .catch((err) => res.status(400).json("Error: " + err));
});

//Get Doctor By Receptionist User
const getDoctorByReceptionist = asyncHandler(async (req, res) => {
  Doctor.find({}).populate('dept_id', 'name').populate('signature')
    .then((doctor) => res.json(doctor))
    .catch((err) => res.status(400).json("Error: " + err));
});

const getDoctorByDepartment = asyncHandler(async (req,res) => {
  const dept_id = req.params.id;
  Doctor.find({ dept_id: dept_id })
    .then(doctors => {
      res.json(doctors);
    })
    .catch(error => {
      res.status(500).json("Error: " + error);
    });
})

//Register doctor
const registerDoctor = asyncHandler(async (req, res) => {
  const admin = req.user.id;
  const { firstName, lastName, email, password, specialization, licenseNumber, departmentName, signature } = req.body;

  if (!firstName || !lastName || !email || !password || !specialization || !licenseNumber || !departmentName) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  const result = await cloudinary.uploader.upload(signature, {
    resource_type: 'auto',
    folder: "signature",
    // width: 300,
    // crop: "scale"
  });
  //Check if doctor exists
  const doctorExists = await Doctor.findOne({ email });
  if (doctorExists) {
    res.status(400);
    throw new Error("Doctor already exists");
  }

  const department = await Department.findOne({ name: departmentName });
  if (!department) {
    res.status(400);
    throw new Error("Department not found");
  }

  //Create Doctor
  const hashedPassword = await bcrypt.hash(password, 10);

  const doctor = await Doctor.create({
    admin,
    firstName,
    lastName,
    email,
    password: hashedPassword,
    specialization,
    licenseNumber,
    dept_id: department._id,
    signature:{
      public_id: result.public_id,
      url: result.secure_url,
    }
  });

  if (doctor) {
    res.status(200).json({
      _id: doctor.id,
      name: doctor.name,
      email: doctor.email,
      department: department.name,
      token: generateToken(doctor._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid doctor data");
  }
});

// Update doctor
const updateDoctor = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.user.id);
  
    if (!admin) {
      res.status(401);
      throw new Error("admin not found");
    }
  
    const doctorId = req.params.id;
  
    Doctor.findById(doctorId)
      .then(async (doctor) => {
        if (!doctor) {
          res.status(404);
          throw new Error("doctor record not found");
        }
  
        if (doctor.admin.toString() !== admin.id) {
          res.status(401);
          throw new Error("User not authorized");
        }
  
        const { firstName, lastName, email, licenseNumber} = req.body;
  
        doctor.firstName = firstName;
        doctor.lastName = lastName;
        doctor.email = email;
        doctor.licenseNumber = licenseNumber;
  
  
        doctor
          .save()
          .then(() => {
            io.emit("updatedDoctor", doctor);
            res.json("Doctor was updated")})
          .catch((err) => res.status(400).json("Error: " + err));
      })
      .catch((err) => res.status(400).json("Error: " + err));
  });
  
//Delete doctor
const deleteDoctor = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.user.id);

  if (!admin) {
    res.status(401);
    throw new Error("Admin not found");
  }

  Doctor.findById(req.params.id)
    .then((doctor) => {
      if (!doctor) {
        res.status(404);
        throw new Error("doctor not found");
      }
      if (doctor.admin.toString() !== admin.id) {
        res.status(401);
        throw new Error("User not authorized");
      }

      // If the user is authorized, proceed with the deletion
      return Doctor.findByIdAndDelete(req.params.id);
    })
    .then(() => {
      res.json("Doctor was deleted");
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// Login doctor
const loginDoctor = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const doctor = await Doctor.findOne({ email });

  if (doctor && (await bcrypt.compare(password, doctor.password))) {
    res.json({
      _id: doctor.id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: doctor.email,
      token: generateToken(doctor._id),
      message: "doctor logged in",
    });
  } else {
    res.status(400);
    throw new Error("Invalid doctor data");
  }
});

// logout doctor
const logoutDoctor = asyncHandler(async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while logging out" });
  }
  res.json({ message: "doctor logged out" });
});

module.exports = {
  getDoctorInfo,
  getDoctor,
  registerDoctor,
  deleteDoctor,
  updateDoctor,
  loginDoctor,
  logoutDoctor,
  getDoctorByDepartment,
  getDoctorByReceptionist
};
