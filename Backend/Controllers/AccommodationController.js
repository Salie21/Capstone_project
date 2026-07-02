const Accommodation = require("../Models/Accommodation");

const featuredHostListingQuery = {
  $or: [
    { title: /Central\s+Studio\s+Apt.*Sandton\s+City.*Rosebank.*Pool.*Gym/i },
    { title: /Luxury\s+Balcony\s+Retreat.*Rooftop\s+Pool.*City\s+Views/i },
  ],
};

const assignFeaturedListingsToHost = async (hostId) => {
  await Accommodation.updateMany(featuredHostListingQuery, { $set: { host: hostId } });
};

const validateAccommodation = (data) => {
  if (!data.title || data.title.trim().length < 3) {
    return "Title must be at least 3 characters";
  }

  if (!data.location) {
    return "Location is required";
  }

  if (!data.description || data.description.trim().length < 10) {
    return "Description must be at least 10 characters";
  }

  if (!data.type) {
    return "Type is required";
  }

  if (Number(data.price) <= 0) {
    return "Price must be more than 0";
  }

  if (Number(data.guests) <= 0 || Number(data.bedrooms) <= 0 || Number(data.bathrooms) <= 0) {
    return "Guests, bedrooms and bathrooms must be more than 0";
  }

  if (
    Number(data.weeklyDiscount || 0) < 0 ||
    Number(data.cleaningFee || 0) < 0 ||
    Number(data.serviceFee || 0) < 0 ||
    Number(data.occupancyTaxes || 0) < 0
  ) {
    return "Fees and discount cannot be negative";
  }

  return "";
};

const createAccommodation = async (req, res) => {
  try {
    const validationError = validateAccommodation(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const accommodation = await Accommodation.create({
      ...req.body,
      host: req.user.id,
    });

    res.status(201).json(accommodation);
  } catch (error) {
    res.status(400).json({ message: "Could not create accommodation", error: error.message });
  }
};

const getAllAccommodations = async (req, res) => {
  try {
    const accommodations = await Accommodation.find().populate("host", "username email");
    res.json(accommodations);
  } catch (error) {
    res.status(500).json({ message: "Could not get accommodations", error: error.message });
  }
};

const getAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id).populate("host", "username email");

    if (!accommodation) {
      return res.status(404).json({ message: "Accommodation not found" });
    }

    res.json(accommodation);
  } catch (error) {
    res.status(500).json({ message: "Could not get accommodation", error: error.message });
  }
};

const getHostAccommodations = async (req, res) => {
  try {
    await assignFeaturedListingsToHost(req.user.id);
    const accommodations = await Accommodation.find({ host: req.user.id });
    res.json(accommodations);
  } catch (error) {
    res.status(500).json({ message: "Could not get host accommodations", error: error.message });
  }
};

const claimFeaturedHostListings = async (req, res) => {
  try {
    await assignFeaturedListingsToHost(req.user.id);

    const accommodations = await Accommodation.find({ host: req.user.id });
    res.json(accommodations);
  } catch (error) {
    res.status(500).json({ message: "Could not assign host listings", error: error.message });
  }
};

const updateAccommodation = async (req, res) => {
  try {
    const validationError = validateAccommodation(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const currentAccommodation = await Accommodation.findById(req.params.id);

    if (!currentAccommodation) {
      return res.status(404).json({ message: "Accommodation not found" });
    }

    if (!currentAccommodation.host || currentAccommodation.host.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only update your own listings" });
    }

    const accommodation = await Accommodation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!accommodation) {
      return res.status(404).json({ message: "Accommodation not found" });
    }

    res.json(accommodation);
  } catch (error) {
    res.status(400).json({ message: "Could not update accommodation", error: error.message });
  }
};

const deleteAccommodation = async (req, res) => {
  try {
    const currentAccommodation = await Accommodation.findById(req.params.id);

    if (!currentAccommodation) {
      return res.status(404).json({ message: "Accommodation not found" });
    }

    if (!currentAccommodation.host || currentAccommodation.host.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own listings" });
    }

    await Accommodation.findByIdAndDelete(req.params.id);

    res.json({ message: "Accommodation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete accommodation", error: error.message });
  }
};

module.exports = {
  createAccommodation,
  getAllAccommodations,
  getAccommodation,
  getHostAccommodations,
  claimFeaturedHostListings,
  updateAccommodation,
  deleteAccommodation,
};
