const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate Tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "30m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

// Cookie Options
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
};

// REGISTER
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = generateTokens(user);

    user.refreshToken = refreshToken;
    await user.save();

    // Set Cookies
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 30 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// LOGIN
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const { accessToken, refreshToken } =
      generateTokens(user);

    user.refreshToken = refreshToken;

    await user.save();

    // Set Cookies
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 30 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// REFRESH TOKEN
exports.refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No refresh token",
      });
    }

    const user = await User.findOne({
      refreshToken: token,
    });

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET,
      async (err) => {
        if (err) {
          return res.status(403).json({
            success: false,
            message: "Invalid refresh token",
          });
        }

        const accessToken = jwt.sign(
          { id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: "30m" }
        );

        res.cookie("accessToken", accessToken, {
          ...cookieOptions,
          maxAge: 30 * 60 * 1000,
        });

        return res.status(200).json({
          success: true,
          message: "Access token refreshed",
        });
      }
    );
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// LOGOUT
exports.logoutUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.refreshToken = null;

    await user.save();

    // Clear Cookies
    res.clearCookie("accessToken", cookieOptions);

    res.clearCookie("refreshToken", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};





