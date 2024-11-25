
const express = require("express");
const router = express.Router();
const {
  getAllTours,
  getTour,
  addTour,
  updateTour,
  deleteTour,
} = require("../controllers/tourControllers");

const requireAuth = require("../middleware/requireAuth");
router.use(requireAuth);


router.get("/", getAllTours);
// router.use(auth);
router.post("/", addTour);
router.get("/:tourId", getTour);
router.put("/:tourId", updateTour);
router.delete("/:tourId", deleteTour);

module.exports = router;
