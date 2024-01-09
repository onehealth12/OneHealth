const asyncHandler = require("express-async-handler");
const AnnouncementModel = require("../models/announcementModel");
const cloudinary = require("../utils/cloudinary");
const Admin = require("../models/adminModel");

const getAnnouncement = asyncHandler(async (req, res) => {
  AnnouncementModel.find({})
    .then((announcement) => res.json(announcement))
    .catch((err) => res.status(400).json("Error: " + err));
});

const createAnnouncement = asyncHandler(async (req, res) => {
  const { title, startDate, endDate, announcementImages } = req.body;

  try {
    const uploadedImages = await Promise.all(
      announcementImages.map(async (announcementImage) => {
        const result = await cloudinary.uploader.upload(announcementImage, {
          resource_type: "auto",
          folder: "announcements",
        });
        return {
          public_id: result.public_id,
          url: result.secure_url,
        };
      })
    );

    const newAnnouncement = new AnnouncementModel({
      title,
      startDate,
      endDate,
      announcementImage: uploadedImages.map((image) => ({
        public_id: image.public_id,
        url: image.url,
      })),
    });

    // Save the new announcement
    await newAnnouncement.save();

    res.status(201).json(newAnnouncement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error uploading announcement" });
  }
});




const activeAnnouncements = asyncHandler(async (req, res) => {
  try {

    const currentDateGMT = new Date();


    const currentDateGMT8 = new Date(currentDateGMT.getTime() + 8 * 60 * 60 * 1000);

    const activeAnnouncements = await AnnouncementModel.find({
      startDate: { $lte: currentDateGMT8 },
      endDate: { $gte: currentDateGMT8 },
    });

    res.json(activeAnnouncements);
  } catch (error) {
    console.error("Error fetching active announcements:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const updateAnnouncement = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "update announcements" });
});

const deleteAnnouncement = asyncHandler(async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);

    if (!admin) {
      res.status(401);
      throw new Error("Admin not found");
    }

    const announcement = await AnnouncementModel.findById(req.params.id);

    if (!announcement) {
      res.status(404);
      throw new Error("Announcement not found");
    }

    // If the user is authorized, proceed with the deletion
    await AnnouncementModel.findByIdAndDelete(req.params.id);

    res.json("Announcement was deleted");
  } catch (err) {
    res.status(400).json("Error: " + err.message);
  }
});


module.exports = {
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  activeAnnouncements,
};
