const express = require("express");
const router = express.Router();
const reservationController = require("../Controllers/ReservationController");
const auth = require("../Middleware/auth");
const role = require("../Middleware/role");

router.post("/", auth, reservationController.createReservation);

router.get("/host", auth, role(["host"]), reservationController.getHostReservations);

router.get("/user", auth, reservationController.getUserReservations);

router.delete("/:id", auth, reservationController.deleteReservation);

module.exports = router;
