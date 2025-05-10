const Equipment = require("../models/Equipment");
const sequelize = require("../../config/database");
const {
  HTTP_STATUS,
  errorResponse,
  successResponse,
} = require("../../helpers/httpStatus");

class EquipmentController {
  async create(req, res) {
    const transaction = await sequelize.transaction(); // Start a transaction
    try {
      req.body.createdBy = req.user.username;
      req.body.updatedBy = req.user.username;
      const equipment = await Equipment.insert(req.body, transaction);
      await transaction.commit();
      successResponse(
        res,
        HTTP_STATUS.CREATED,
        "Equipment created successfully",
        equipment
      );
    } catch (err) {
      await transaction.rollback();
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error creating equipment",
        err.message
      );
    }
  }

  async selectAll(req, res) {
    try {
      const equipments = await Equipment.select();

      successResponse(
        res,
        HTTP_STATUS.OK,
        "Equipment(s) fetched successfully",
        equipments
      );
    } catch (err) {
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error fetching equipments",
        err.message
      );
    }
  }

  async selectById(req, res) {
    try {
      const equipment = await Equipment.select({ id: req.params.id });
      if (!equipment) {
        return errorResponse(res, HTTP_STATUS.NOT_FOUND, "Equipment not found");
      }
      successResponse(
        res,
        HTTP_STATUS.OK,
        "Equipment fetched successfully",
        equipment
      );
    } catch (err) {
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error fetching equipment",
        err.message
      );
    }
  }

  async update(req, res) {
    const transaction = await sequelize.transaction(); // Start a transaction

    try {
      req.body.updatedBy = req.user.username;
      const equipment = await Equipment.update(
        req.body,
        {
          id: req.params.id,
        },
        transaction
      );
      if (!equipment) {
        return errorResponse(res, HTTP_STATUS.NOT_FOUND, "Equipment not found");
      }
      await transaction.commit();
      successResponse(
        res,
        HTTP_STATUS.OK,
        "Equipment updated successfully",
        equipment
      );
    } catch (err) {
      await transaction.rollback();
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error updating equipment",
        err.message
      );
    }
  }
}

module.exports = new EquipmentController(); // Export using CommonJS syntax
