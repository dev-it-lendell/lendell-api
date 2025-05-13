const Client = require("../models/Client");
const bcrypt = require("bcryptjs");
const sequelize = require("../../../config/database");

const {
  HTTP_STATUS,
  errorResponse,
  successResponse,
} = require("../../helpers/httpStatus");

class ClientsController {
  async create(req, res) {
    const transaction = await sequelize.transaction(); // Start a transaction
    try {
      req.body.createdBy = req.user.username;
      req.body.updatedBy = req.user.username;
      const client = await User.insert(
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
        "Client created successfully",
        client
      );
    } catch (err) {
      await transaction.rollback();
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error creating client",
        err.message
      );
    }
  }

  async selectAll(req, res) {
    try {
      // { active: 1 }
      const clients = await User.select();
      successResponse(
        res,
        HTTP_STATUS.OK,
        "User(s) fetched successfully",
        clients
      );
    } catch (err) {
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error fetching clients",
        err.message
      );
    }
  }

  async selectById(req, res) {
    try {
      const client = await Client.select({ id: req.params.id });
      if (!client) {
        return errorResponse(res, HTTP_STATUS.NOT_FOUND, "Client not found");
      }
      successResponse(
        res,
        HTTP_STATUS.OK,
        "Client fetched successfully",
        client
      );
    } catch (err) {
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error fetching client",
        err.message
      );
    }
  }

  async update(req, res) {
    const transaction = await sequelize.transaction(); // Start a transaction
    try {
      req.body.updatedBy = req.client.username;

      if (req.body.password !== undefined) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;
      }

      const client = await Client.update(
        req.body,
        { id: req.params.id },
        transaction
      );
      if (!client) {
        return errorResponse(res, HTTP_STATUS.NOT_FOUND, "Client not found");
      }
      await transaction.commit();
      successResponse(
        res,
        HTTP_STATUS.OK,
        "Client updated successfully",
        client
      );
    } catch (err) {
      await transaction.rollback();
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error updating client",
        err.message
      );
    }
  }
}

module.exports = new ClientsController(); // Export using CommonJS syntax
