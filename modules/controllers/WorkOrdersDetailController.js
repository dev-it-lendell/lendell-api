const WorkOrdersDetail = require("../models/WorkOrdersDetail");
const sequelize = require("../../config/database");
const utils = require("../../helpers/utils");
const {
  HTTP_STATUS,
  errorResponse,
  successResponse,
} = require("../../helpers/httpStatus");

class WorkOrdersDetailController {
  async selectWorkOrderDetails(req, res) {
    try {
      const condition = {}; // Standard condition
      const customClauses = [
        {
          sql: `a.active = :active AND DATE_FORMAT(c.createdAt, '%Y-%m') = :month AND (c.code = :workOrderCode 
          OR a.equipmentCode = :equipmentCode)`,
          value: {
            active: 1,
            status: 2,
            workOrderCode:
              req.params.workOrderCode === "null"
                ? ""
                : req.params.workOrderCode,
            equipmentCode: req.params.equipmentCode,
            month: req.query.month,
          },
        },
      ];
      const orderBy = "";

      const workOrderDetails = await WorkOrdersDetail.select(
        condition,
        customClauses,
        orderBy
      );

      successResponse(
        res,
        HTTP_STATUS.OK,
        "Work Orders Detail(s) fetched successfully",
        workOrderDetails
      );
    } catch (err) {
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error fetching Work Order Detail(s)",
        err.message
      );
    }
  }
}

module.exports = new WorkOrdersDetailController(); // Export using CommonJS syntax
