const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./Models/User");
const userRoutes = require("./Routes/userRoutes");
const accommodationRoutes = require("./Routes/accommodationRoutes");
const reservationRoutes = require("./Routes/reservationRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/accommodations", accommodationRoutes);
app.use("/api/reservations", reservationRoutes);

app.get("/", (req, res) => {
  res.send("Airbnb backend is running");
});

// Create demo users with hashed passwords
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
    const existingUser = await User.findOne({ username: user.username });

    if (!existingUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      await User.create({ ...user, password: hashedPassword });
      console.log(`Demo user created: ${user.username}`);
    }
  }
};

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    family: 4,
  })
  .then(async () => {
    console.log("Connected to MongoDB");
    await createDemoUsers();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });
