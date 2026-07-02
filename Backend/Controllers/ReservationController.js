const Reservation = require("../Models/Reservation");
const Accommodation = require("../Models/Accommodation");

const validateReservation = (data) => {
  if (!data.bookedBy || data.bookedBy.trim().length < 2) {
    return "Booked by name is required";
  }

  if (!data.property) {
    return "Property is required";
  }

  if (!data.checkin || !data.checkout) {
    return "Checkin and checkout dates are required";
  }

  if (Number(data.guests || 1) <= 0) {
    return "Guests must be more than 0";
  }

  return "";
};

const createReservation = async (req, res) => {
  try {
    const validationError = validateReservation(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    let host = req.body.host;

    if (req.body.accommodation) {
      const accommodation = await Accommodation.findById(req.body.accommodation);

      if (!accommodation) {
        return res.status(404).json({ message: "Accommodation not found" });
      }

      host = accommodation.host;
    }

    const reservation = await Reservation.create({
      ...req.body,
      user: req.user.id,
      host,
    });

    res.status(201).json(reservation);
  } catch (error) {
    res.status(400).json({ message: "Could not create reservation", error: error.message });
  }
};

const getHostReservations = async (req, res) => {
  try {
    const hostAccommodations = await Accommodation.find({ host: req.user.id });
    const accommodationIds = hostAccommodations.map((accommodation) => accommodation._id);
    const reservations = await Reservation.find({ accommodation: { $in: accommodationIds } });

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Could not get host reservations", error: error.message });
  }
};

const getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user.id });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Could not get user reservations", error: error.message });
  }
};

const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    const isUserReservation = reservation.user && reservation.user.toString() === req.user.id;
    const isHostReservation = reservation.host && reservation.host.toString() === req.user.id;

    if (!isUserReservation && !isHostReservation) {
      return res.status(403).json({ message: "You can only delete your own reservations" });
    }

    await Reservation.findByIdAndDelete(req.params.id);

    res.json({ message: "Reservation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Could not delete reservation", error: error.message });
  }
};

module.exports = {
  createReservation,
  getHostReservations,
  getUserReservations,
  deleteReservation,
};
