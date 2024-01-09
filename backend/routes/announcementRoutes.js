const {
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  activeAnnouncements,
} = require("../controllers/announcementController");

const router = require("express").Router();

//Get announcements
router.get("/", activeAnnouncements);

//Post new announcement
router.post("/create", createAnnouncement);


//Update announcement
router.put("/:id", updateAnnouncement);

//Delete announcement
router.delete("/:id", deleteAnnouncement);

module.exports = router;
