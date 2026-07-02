//The following import the Accomidation model which will interact with the database
const Accommodation = require("../Models/Accommodation");

/*Code is used to identify the featured accomidation listings
The listing is automatically assigned to the host who logs in*/
const featuredHostListingQuery = {
  $or: [
    { title: /Central\s+Studio\s+Apt.*Sandton\s+City.*Rosebank.*Pool.*Gym/i },
    { title: /Luxury\s+Balcony\s+Retreat.*Rooftop\s+Pool.*City\s+Views/i },
  ],
};

//Assigns listings to a specific host
const assignFeaturedListingsToHost = async (hostId) => {
  await Accommodation.updateMany(featuredHostListingQuery, { $set: { host: hostId } });
};

//Confirms accomidation data before creating or updating a list
const validateAccommodation = (data) => {
  if (!data.title || data.title.trim().length < 3) {
    return "Title must be at least 3 characters";
  }

  //The code ensures the user provides a location aand returns 
  if (!data.location) {
    return "Location is required";
  }

  if (!data.description || data.description.trim().length < 10) {
    return "Description must be at least 10 characters";
  }

  //Ensures the accomidation type exists
  if (!data.type) {
    return "Type is required";
  }

  // Used for price, must be greater than 0
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


/**
 * Creates a new accommodation listing.
 * The logged-in user is automatically assigned as the host.
 */
const createAccommodation = async (req, res) => {
  try {
    const validationError = validateAccommodation(req.body);
    
//Check incoming data to ensure it's correct
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }
    
//Saves new  accommodation
    const accommodation = await Accommodation.create({
      ...req.body,
      host: req.user.id,
    });

    res.status(201).json(accommodation);
  } catch (error) {
    res.status(400).json({ message: "Could not create accommodation", error: error.message });
  }
};


/**
 * Retrieves all accommodation listings.
 * Host details are included using populate().
 */
const getAllAccommodations = async (req, res) => {
  try {
    const accommodations = await Accommodation.find().populate("host", "username email");
    res.json(accommodations);
  } catch (error) {
    res.status(500).json({ message: "Could not get accommodations", error: error.message });
  }
};

//Retrives accomodation by id 

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

//Fetchs all accomodiation owned by a logged in host
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

/**
 * Updates an existing accommodation.
 * Only the owner of the listing is allowed to perform this action.
 */
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

    //Delete accomodation 
    await Accommodation.findByIdAndDelete(req.params.id);

    res.json({ message: "Accommodation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete accommodation", error: error.message });
  }
};

// Export controller functions for use in the accommodation routes  
module.exports = {
  createAccommodation,
  getAllAccommodations,
  getAccommodation,
  getHostAccommodations,
  claimFeaturedHostListings,
  updateAccommodation,
  deleteAccommodation,
};
