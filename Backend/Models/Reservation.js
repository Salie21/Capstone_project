const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    bookedBy: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    accommodation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Accommodation",
    },
    property: {
      type: String,
      required: true,
    },
    checkin: {
      type: String,
      required: true,
    },
    checkout: {
      type: String,
      required: true,
    },
    guests: {
      type: Number,
      default: 1,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reservation", reservationSchema);
