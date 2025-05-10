const Supplier = require("../models/Supplier");
const sequelize = require("../../config/database");
const {
  HTTP_STATUS,
  errorResponse,
  successResponse,
} = require("../../helpers/httpStatus");

class SupplierController {
  async create(req, res) {
    const transaction = await sequelize.transaction(); // Start a transaction
    try {
      req.body.createdBy = req.user.username;
      req.body.updatedBy = req.user.username;
      const supplier = await Supplier.insert(req.body, transaction);
      await transaction.commit();
      successResponse(
        res,
        HTTP_STATUS.CREATED,
        "Supplier created successfully",
        supplier
      );
    } catch (err) {
      await transaction.rollback();
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error creating supplier",
        err.message
      );
    }
  }

  async selectAll(req, res) {
    try {
      const suppliers = await Supplier.select();

      successResponse(
        res,
        HTTP_STATUS.OK,
        "Supplier(s) fetched successfully",
        suppliers
      );
    } catch (err) {
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error fetching suppliers",
        err.message
      );
    }
  }

  async selectById(req, res) {
    try {
      const supplier = await Supplier.select({ id: req.params.id });
      if (!supplier) {
        return errorResponse(res, HTTP_STATUS.NOT_FOUND, "Supplier not found");
      }
      successResponse(
        res,
        HTTP_STATUS.OK,
        "Supplier fetched successfully",
        supplier
      );
    } catch (err) {
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error fetching supplier",
        err.message
      );
    }
  }

  async update(req, res) {
    const transaction = await sequelize.transaction(); // Start a transaction
    try {
      req.body.updatedBy = req.user.username;
      const supplier = await Supplier.update(
        req.body,
        { id: req.params.id },
        transaction
      );
      if (!supplier) {
        return errorResponse(res, HTTP_STATUS.NOT_FOUND, "Supplier not found");
      }
      await transaction.commit();
      successResponse(
        res,
        HTTP_STATUS.OK,
        "Supplier updated successfully",
        supplier
      );
    } catch (err) {
      await transaction.rollback();
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error updating supplier",
        err.message
      );
    }
  }
}

module.exports = new SupplierController(); // Export using CommonJS syntax
