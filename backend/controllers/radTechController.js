const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const RadTech = require('../models/radTechModel')
const Admin = require("../models/adminModel");
const { generateToken } = require("../middlewares/generateToken");

const getRadTech = asyncHandler(async (req, res) => {
    RadTech.find({})
        .then((radTech) => res.json(radTech))
        .catch((err) => res.status(400).json("Error: " + err));
});

const registerRadTech = asyncHandler(async (req, res) => {
    const admin = req.user.id;
    const { firstName, lastName, email, password, licenseNumber} = req.body;

    if (!firstName || !lastName || !email || !password || !licenseNumber) {
        res.status(400);
        throw new Error("Please fill all fields");
    }

    //Check if radTech exists
    const radTechExists = await RadTech.findOne({ email });
    if (radTechExists) {
        res.status(400);
        throw new Error("radTech already exists");
    }

    //Create radTech
    const hashedPassword = await bcrypt.hash(password, 10);

    const radTech = await RadTech.create({
        admin,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        licenseNumber,
    });

    if (radTech) {
        res.status(200).json({
            _id: radTech.id,
            name: radTech.name,
            email: radTech.email,
            token: generateToken(radTech._id),
        });
    } else {
        res.status(400);
        throw new Error("Invalid radTech data");
    }
});

// Update RadTech
const updateRadTech = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.user.id);

    if (!admin) {
        res.status(401);
        throw new Error("admin not found");
    }

    const radTechId = req.params.id;

    RadTech.findById(radTechId)
        .then(async (radTech) => {
            if (!radTech) {
                res.status(404);
                throw new Error("radTech record not found");
            }

            if (radTech.admin.toString() !== admin.id) {
                res.status(401);
                throw new Error("User not authorized");
            }

            const { name, email, password} = req.body;

            radTech.name = name;
            radTech.email = email;
            radTech.password = password;

            radTech
                .save()
                .then(() => res.json("RadTech was updated"))
                .catch((err) => res.status(400).json("Error: " + err));
        })
        .catch((err) => res.status(400).json("Error: " + err));
});

// Delete RadTech
const deleteRadTech = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.user.id);

    if (!admin) {
        res.status(401);
        throw new Error("Admin not found");
    }

    RadTech.findById(req.params.id)
        .then((radTech) => {
            if (!radTech) {
                res.status(404);
                throw new Error("radTech not found");
            }

            // If the user is authorized, proceed with the deletion
            return RadTech.findByIdAndDelete(req.params.id);
        })
        .then(() => {
            res.json("RadTech was deleted");
        })
        .catch((err) => res.status(400).json("Error: " + err));
});

// Login RadTech
const loginRadTech = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const radTech = await RadTech.findOne({ email });

    if (radTech && (await bcrypt.compare(password, radTech.password))) {
        res.json({
            _id: radTech.id,
            name: radTech.name,
            email: radTech.email,
            token: generateToken(radTech._id),
            message: "RadTech logged in",
        });
    } else {
        res.status(400);
        throw new Error("Invalid radTech data");
    }
});

// Logout RadTech
const logoutRadTech = asyncHandler(async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error while logging out" });
    }
    res.json({ message: "RadTech logged out" });
});

module.exports = {
    getRadTech,
    registerRadTech,
    updateRadTech,
    loginRadTech,
    deleteRadTech,
    logoutRadTech
};
