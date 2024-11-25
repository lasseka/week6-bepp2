const Tour = require("../models/tourModel");
const mongoose = require("mongoose");

// GET /tours
const getAllTours = async (req, res) => {
  const user_id = req.user._id;
  try { 
    const allTours = await Tour.find({user_id}).sort({ createdAt: -1 });
    res.status(200).json(allTours);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// POST /tours
const addTour= async (req, res) => {
  const { name, info, image, price } = req.body;

  try {
    const user_id = req.user._id;
    const newTour = new Tour({
      name,
      info,
      image,
      price,
      user_id,
    });
    await newTour.save();
    res.status(201).json(newTour);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// GET /tours/:tourId
const getTour = async (req, res) => {
  const id = req.params.tourId;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such tour" });
  }

  try {
    const user_id = req.user._id;
    const tour = await Tour.findById(id)
      .where("user_id")
      .equals(user_id);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }
    res.status(200).json(tour);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};
// PUT /tours/:tourId
const updateTour = async (req, res) => {
  const id= req.params.tourId;
  try {
    const user_id = req.user._id;
    const tour = await Tour.findOneAndUpdate(
      { _id: id, user_id: user_id },
      { ...req.body },
      { new: true }
    );
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }
    res.status(200).json(tour);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// DELETE /tours/:tourId
const deleteTour = async (req, res) => {
  const id = req.params.tourId;
  try {
    const user_id = req.user._id;
    const tour = await Tour.findByIdAndDelete({
      _id: id,
      user_id: user_id,
    });
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }
    res.status(204).send(); // 204 No Content
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = {
  getAllTours,
  getTour,
  addTour,
  updateTour,
  deleteTour,
};
