// Import required packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");

// Loads environment variables from the .env file
dotenv.config();

//User model and application routes
const User = require("./Models/User");
const userRoutes = require("./Routes/userRoutes");
const accommodationRoutes = require("./Routes/accommodationRoutes");
const reservationRoutes = require("./Routes/reservationRoutes");

// Create the Express application
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/accommodations", accommodationRoutes);
app.use("/api/reservations", reservationRoutes);

// Path to the React build
const frontendPath = path.join(
  __dirname,
  "../Frontend/Airbnb-Project/dist"
);

// Serve static React files
app.use(express.static(frontendPath));

app.use((req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({
      message: "API route not found",
    });
  }

  res.sendFile(path.join(frontendPath, "index.html"));
});


// Create demo users with hashed passwords from document brief also used in the assignment
const createDemoUsers = async () => {
  const users = [
    {
      username: "John Doe",
      password: "password123",
      role: "user",
    },
    {
      username: "Jane Doe",
      password: "password321",
      role: "host",
    },
  ];

  for (const user of users) {
    const existingUser = await User.findOne({
      username: user.username,
    });

    if (!existingUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);

      await User.create({
        ...user,
        password: hashedPassword,
      });
      
//Use to print out 
      console.log(`Demo user created: ${user.username}`);
    }
  }
};

// Connect to MongoDB and print out either Connected to MongoDB, Server running on port ${PORT 
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    family: 4,
  })
  .then(async () => {
    console.log("Connected to MongoDB");

    await createDemoUsers();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });
