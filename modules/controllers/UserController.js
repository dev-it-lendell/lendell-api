const User = require("../models/User");
const bcrypt = require("bcryptjs");
const sequelize = require("../../config/database");

const {
  HTTP_STATUS,
  errorResponse,
  successResponse,
} = require("../../helpers/httpStatus");

class UserController {
  async create(req, res) {
    const transaction = await sequelize.transaction(); // Start a transaction
    try {
      req.body.createdBy = req.user.username;
      req.body.updatedBy = req.user.username;
      const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hash password
      delete req.body.password;
      const user = await User.insert(
        {
          ...req.body,
          password: hashedPassword,
        },
        transaction
      );
      await transaction.commit();
      successResponse(
        res,
        HTTP_STATUS.CREATED,
        "User created successfully",
        user
      );
    } catch (err) {
      await transaction.rollback();
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error creating user",
        err.message
      );
    }
  }

  async selectAll(req, res) {
    try {
      // { active: 1 }
      const users = await User.select();
      successResponse(
        res,
        HTTP_STATUS.OK,
        "User(s) fetched successfully",
        users
      );
    } catch (err) {
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error fetching users",
        err.message
      );
    }
  }

  async selectById(req, res) {
    try {
      const user = await User.select({ id: req.params.id });
      if (!user) {
        return errorResponse(res, HTTP_STATUS.NOT_FOUND, "User not found");
      }
      successResponse(res, HTTP_STATUS.OK, "User fetched successfully", user);
    } catch (err) {
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error fetching user",
        err.message
      );
    }
  }

  async update(req, res) {
    const transaction = await sequelize.transaction(); // Start a transaction
    try {
      req.body.updatedBy = req.user.username;

      if (req.body.password !== undefined) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;
      }

      const user = await User.update(
        req.body,
        { id: req.params.id },
        transaction
      );
      if (!user) {
        return errorResponse(res, HTTP_STATUS.NOT_FOUND, "User not found");
      }
      await transaction.commit();
      successResponse(res, HTTP_STATUS.OK, "User updated successfully", user);
    } catch (err) {
      await transaction.rollback();
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error updating user",
        err.message
      );
    }
  }

  async resetPassword(req, res) {
    const transaction = await sequelize.transaction(); // Start a transaction
    try {
      req.body.updatedBy = req.user.username;
      const hashedPassword = await bcrypt.hash(req.body.username, 10);
      const user = await User.update(
        {
          password: hashedPassword,
          initialLogin: 1,
        },
        { id: req.params.id },
        transaction
      );
      if (!user) {
        return errorResponse(res, HTTP_STATUS.NOT_FOUND, "User not found");
      }

      await transaction.commit();
      successResponse(res, HTTP_STATUS.OK, "User updated successfully", user);
    } catch (err) {
      await transaction.rollback();
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error resetting user password",
        err.message
      );
    }
  }
}

module.exports = new UserController(); // Export using CommonJS syntax
