/*jwt is usedto securely transmit data between parties as a JSON object
bcrypt is used to hash password in the database
*/
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");

//Creates a token using a user id will expire in one day
const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      role: user.role,
    },
    process.env.JWT_SECRET || "airbnb_secret_key",
    { expiresIn: "1d" }
  );
};

//Creates a new user, check if the user does not have duplicate accounts
const signup = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username,
      password: hashedPassword,
      role: role || "user",
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not create user",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const loginName = (username || email || "").trim();

    if (!loginName || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    // Case-insensitive username search
    const user = await User.findOne({
      username: new RegExp(
        `^${loginName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        "i"
      ),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const token = createToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

module.exports = {
  signup,
  login,
};
