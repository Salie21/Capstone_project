/* Import the Express framework and create a new router
Import the auth controller and asweel for middleware for authentication and role-based authorization */
const express = require("express");
const router = express.Router();
const reservationController = require("../Controllers/ReservationController");
const auth = require("../Middleware/auth");
const role = require("../Middleware/role");

//Uses CRUD operations for reservations
router.post("/", auth, reservationController.createReservation);

//Read reservation
router.get("/host", auth, role(["host"]), reservationController.getHostReservations);

router.get("/user", auth, reservationController.getUserReservations);

//Deletes reservation 
router.delete("/:id", auth, reservationController.deleteReservation);

module.exports = router;
