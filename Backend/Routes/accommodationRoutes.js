const express = require("express");
const router = express.Router();
const accommodationController = require("../Controllers/AccommodationController");
const auth = require("../Middleware/auth");
const role = require("../Middleware/role");

router.post("/", auth, role(["host"]), accommodationController.createAccommodation);

router.get("/", accommodationController.getAllAccommodations);

router.get("/host", auth, role(["host"]), accommodationController.getHostAccommodations);

router.post("/host/claim-featured", auth, role(["host"]), accommodationController.claimFeaturedHostListings);

router.get("/:id", accommodationController.getAccommodation);

router.put("/:id", auth, role(["host"]), accommodationController.updateAccommodation);

router.delete("/:id", auth, role(["host"]), accommodationController.deleteAccommodation);

module.exports = router;
