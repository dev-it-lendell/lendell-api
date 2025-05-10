const Department = require("../models/Department");
const sequelize = require("../../config/database");
const {
  HTTP_STATUS,
  errorResponse,
  successResponse,
} = require("../../helpers/httpStatus");

class DepartmentController {
  async create(req, res) {
    const transaction = await sequelize.transaction(); // Start a transaction
    try {
      req.body.createdBy = req.user.username;
      req.body.updatedBy = req.user.username;
      const department = await Department.insert(req.body, transaction);
      await transaction.commit();
      successResponse(
        res,
        HTTP_STATUS.CREATED,
        "Department created successfully",
        department
      );
    } catch (err) {
      await transaction.rollback();
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error creating department",
        err.message
      );
    }
  }

  async selectAll(req, res) {
    try {
      const departments = await Department.select();

      successResponse(
        res,
        HTTP_STATUS.OK,
        "Department(s) fetched successfully",
        departments
      );
    } catch (err) {
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error fetching departments",
        err.message
      );
    }
  }

  async selectById(req, res) {
    try {
      const department = await Department.select({ id: req.params.id });
      if (!department) {
        return errorResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Department not found"
        );
      }
      successResponse(
        res,
        HTTP_STATUS.OK,
        "Department fetched successfully",
        department
      );
    } catch (err) {
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error fetching department",
        err.message
      );
    }
  }

  async update(req, res) {
    const transaction = await sequelize.transaction(); // Start a transaction
    try {
      req.body.updatedBy = req.user.username;
      const department = await Department.update(
        req.body,
        {
          id: req.params.id,
        },
        transaction
      );
      if (!department) {
        return errorResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Department not found"
        );
      }
      await transaction.commit();
      successResponse(
        res,
        HTTP_STATUS.OK,
        "Department updated successfully",
        department
      );
    } catch (err) {
      await transaction.rollback();
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error updating department",
        err.message
      );
    }
  }
}

module.exports = new DepartmentController(); // Export using CommonJS syntax
