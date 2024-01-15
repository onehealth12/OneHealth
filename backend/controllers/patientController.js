const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Patient = require("../models/patientModel");
const { generateToken } = require("../middlewares/generateToken");
const AddressModel = require("../models/addressModel");
const nodemailer = require("nodemailer");

const getPatient = asyncHandler(async (req, res) => {
  Patient.findById(req.user.id)
    .then((patient) => res.json(patient))
    .catch((err) => res.status(400).json("Error: " + err));
});



const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  //Check if the email exists in the database then get the ID
  const patient = await Patient.findOne({ email })
  
  if (!patient) {
    res.status(404);
    throw new Error("Patient not found");
  }

  //if it exists, generate a random 8 letter password to change its password
  if (patient) {
    const newPassword = Math.random().toString(36).slice(-8);
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    patient.password = hashedNewPassword;

    //Send it to email
    await patient.save()
                  .then(() => {
                    sendPasswordResetEmail(email, newPassword);
                    res.status(200).json({ message: "Password reset email sent" });
                  })
                  .catch((err) => {
                    res.status(400).json("Error: " + err);
                  })
  }


})


const searchPatient = asyncHandler(async (req, res) =>{
  try {
    const searchTerm = req.query.q; // Get the search term from the query parameter

    // Perform the search query on your Patient model using case-insensitive regex
    const patients = await Patient.find({
      $or: [
        { firstName: new RegExp(searchTerm, "i") }, // Case-insensitive search by first name
        { lastName: new RegExp(searchTerm, "i") },  // Case-insensitive search by last name
      ],
    });

    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
})

//Register Patient
const registerPatient = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    sex,
    birthday,
    mobileNumber,
    landline,
    addressLine1,
    addressLine2,
    barangay,
    city,
    province,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !password ||
    !sex ||
    !birthday ||
    !addressLine1 ||
    !barangay ||
    !city ||
    !province
  ) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  //Check if patient exists
  const patientExists = await Patient.findOne({ $or: [ { email }, { mobileNumber } ] });
  if (patientExists) {
    res.status(400);
    throw new Error("Patient already exists");
  }

  //Create Patient
  const hashedPassword = await bcrypt.hash(password, 10);

  const address = await AddressModel.create({
    addressLine1,
    addressLine2,
    barangay,
    city,
    province
  })

  const patient = await Patient.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    sex,
    birthday,
    mobileNumber,
    landline,
    addressId: address._id
  });

  res.status(201).json(patient);
});

//Create Patient account by receptionist
const createPatient = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    mobileNumber,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !password
  ) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  //Check if patient exists
  const patientExists = await Patient.findOne({ $or: [ { email }, { mobileNumber } ] });
  if (patientExists) {
    res.status(400);
    throw new Error("Patient already exists");
  }

  //Create Patient
  const hashedPassword = await bcrypt.hash(password, 10);


  const patient = await Patient.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    mobileNumber,
  });

  res.status(201).json(patient);
});

//Update Patient
const updatePatient = asyncHandler(async (req, res) => {
  const loggedInPatient = await Patient.findById(req.user.id);

  if (!loggedInPatient) {
    res.status(401);
    throw new Error("Patient not found");
  }

  const patientId = req.params.id;

  try {
    const patientToUpdate = await Patient.findById(patientId);

    if (!patientToUpdate) {
      res.status(404);
      throw new Error("Patient data not found");
    }

    if (loggedInPatient.id !== patientId) {
      res.status(401);
      throw new Error("User not authorized");
    }

    const { firstName, lastName, email, mobileNumber, newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    patientToUpdate.firstName = firstName;
    patientToUpdate.lastName = lastName;
    patientToUpdate.email = email;
    patientToUpdate.mobileNumber = mobileNumber;
    patientToUpdate.password = hashedPassword;

    //hash the password


    await patientToUpdate.save();
    res.json("Record was updated");
  } catch (err) {
    res.status(400).json("Error: " + err.message);
  }
});
//Login Patient
const loginPatient = asyncHandler(async (req, res) => {
  const { loginIdentifier, password } = req.body;

  // Check if the loginIdentifier is a valid email or mobileNumber
  const isEmail = loginIdentifier.includes('@');
  const query = isEmail ? { email: loginIdentifier } : { mobileNumber: loginIdentifier };

  const patient = await Patient.findOne(query);

  if (patient) {
    const isPasswordValid = await bcrypt.compare(password, patient.password);

    if (isPasswordValid) {
      res.json({
        _id: patient.id,
        name: patient.firstName,
        token: generateToken(patient._id),
      });
    } else {
      res.status(401); // Unauthorized
      throw new Error("Incorrect password. Please try again.");
    }
  } else {
    res.status(404); // Not Found
    throw new Error("Patient not found. Please check your login details.");
  }
});


//Logout Patient
const logoutPatient = asyncHandler(async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error while logging out" });
  }
});
//Update Patient

module.exports = { getPatient, registerPatient, loginPatient, logoutPatient, createPatient, searchPatient, updatePatient, forgotPassword };


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER ,
    pass: process.env.EMAIL_PASS 
  },
});

async function sendPasswordResetEmail(
  email,
  newPassword
) {
  // Send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"One Health Cainta" <onehealth.cainta@gmail.com>',
    to: email,
    subject: "New login password",
    text: `Dear Patient,\n\nYour new login password is: ${newPassword} \n\nThank you for choosing our clinic.\n\nSincerely,\nOne Health Cainta Team`,
    html: `<p>Dear Patient,</p><p>Your new login password is: ${newPassword}</p><p>Thank you for choosing our clinic.</p><p>Sincerely,<br>One Health Cainta Team</p>`,
  });
  console.log("Message sent: %s", info.messageId);
}