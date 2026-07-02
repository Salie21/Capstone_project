/* Import the Express framework and create a new router
Import the auth controller and asweel for middleware for authentication and role-based authorization */
const express = require("express");
const router = express.Router();
const accommodationController = require("../Controllers/AccommodationController");
const auth = require("../Middleware/auth");
const role = require("../Middleware/role");

//Uses CRUD operations for accomadition to get, create, update and delete accomodations
router.post("/", auth, role(["host"]), accommodationController.createAccommodation);

router.get("/", accommodationController.getAllAccommodations);

router.get("/host", auth, role(["host"]), accommodationController.getHostAccommodations);

router.post("/host/claim-featured", auth, role(["host"]), accommodationController.claimFeaturedHostListings);

router.get("/:id", accommodationController.getAccommodation);

router.put("/:id", auth, role(["host"]), accommodationController.updateAccommodation);

router.delete("/:id", auth, role(["host"]), accommodationController.deleteAccommodation);

module.exports = router;
