/* Import the Express framework and create a new router
Import the controller */
const express = require("express");
const router = express.Router();
const userController = require("../Controllers/UserController");

/*Receives the user's username and password.
Checks if the username already exists.
Hashes the password using bcrypt.*/ 

router.post("/signup", userController.signup);
router.post("/login", userController.login);

module.exports = router;
