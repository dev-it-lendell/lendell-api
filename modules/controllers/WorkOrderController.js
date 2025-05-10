const WorkOrder = require("../models/WorkOrder");
const WorkOrdersDetail = require("../models/WorkOrdersDetail");
const Equipment = require("../models/Equipment");
const sequelize = require("../../config/database");
const utils = require("../../helpers/utils");
const {
  HTTP_STATUS,
  errorResponse,
  successResponse,
} = require("../../helpers/httpStatus");

const sqlHelper = require("../../helpers/sql");

class WorkOrderController {
  async create(req, res) {
    const transaction = await sequelize.transaction(); // Start a transaction
    try {
      const {
        description,
        status,
        scheduleAt,
        startWorkAt,
        assessAt,
        completedAt,
        workStatus,
        equipmentCode,
        type,
        taskList,
      } = req.body;

      const uniqueId = await sqlHelper.generateUniqueId(
        "WO",
        "work_orders",
        "createdAt",
        transaction,
        sequelize
      );

      const payloadWorkOrder = {
        code: uniqueId,
        description: description,
        status: status,
        scheduleAt: utils.formatDate({ date: scheduleAt, straightDate: true }),
        startWorkAt: utils.formatDate({
          date: startWorkAt,
          straightDateTime: true,
        }),
        assessAt: utils.formatDate({ date: assessAt, straightDateTime: true }),
        completedAt:
          completedAt === null
            ? null
            : utils.formatDate({ date: completedAt, straightDateTime: true }),
        workStatus: workStatus,
        equipmentCode: equipmentCode,
        type: type,
        createdBy: req.user.username,
        updatedBy: req.user.username,
      };

      const workOrder = await WorkOrder.insert(payloadWorkOrder, transaction);

      if (!utils.isObjAndEmpty(workOrder)) {
        for (const list of taskList) {
          const payload = {
            workOrderCode: workOrder.code,
            taskCode: list.taskCode,
            description: list.description,
            taskStatus: utils.empty(list.taskStatus) ? null : list.taskStatus,
          };

          await WorkOrdersDetail.insert(payload, transaction);
        }
      }
      await transaction.commit();
      successResponse(
        res,
        HTTP_STATUS.CREATED,
        "Work Order created successfully",
        true
      );
    } catch (err) {
      await transaction.rollback();
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error creating Work Order",
        err.message
      );
    }
  }

  async repair(req, res) {
    const transaction = await sequelize.transaction(); // Start a transaction
    try {
      const uniqueId = await sqlHelper.generateUniqueId(
        "WO",
        "work_orders",
        "createdAt",
        transaction,
        sequelize
      );

      const payload = {
        code: uniqueId,
        equipmentCode: req.body.equipmentCode,
        description: req.body.description,
        status: 1,
        scheduleAt: utils.currentDateTime(),
        startWorkAt: utils.currentDateTime(),
        assessAt: utils.currentDateTime(),
        type: "CORRECTIVE",
        createdBy: req.user.username,
        updatedBy: req.user.username,
      };

      const workOrder = await WorkOrder.insert(payload, transaction);

      await Equipment.update(
        { active: 2 },
        { code: payload.equipmentCode },
        transaction
      );
      await transaction.commit();
      successResponse(
        res,
        HTTP_STATUS.CREATED,
        "Work Order Repair created successfully",
        workOrder
      );
    } catch (err) {
      await transaction.rollback();
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error creating Work Order",
        err.message
      );
    }
  }

  async selectAll(req, res) {
    try {
      const condition = {}; // Standard condition
      const customClauses = [
        {
          sql: `a.active = :active2 OR (a.warrantyPeriod < CURDATE() AND a.active = :active1)
          `,
          value: {
            active2: 2, // Bind value for a.active = 2
            active1: 1, // Bind value for a.active = 1
            month: req.query.month, // Bind value for the date filter
          },
        },
      ];
      const orderBy = "b.createdAt DESC";

      const workOrders = await WorkOrder.select(
        condition,
        customClauses,
        orderBy
      );

      successResponse(
        res,
        HTTP_STATUS.OK,
        "Work Order(s) fetched successfully",
        workOrders
      );
    } catch (err) {
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error fetching Work Orders",
        err.message
      );
    }
  }

  async selectById(req, res) {
    try {
      const workOrder = await WorkOrder.select({ id: req.params.id });
      if (!workOrder) {
        return errorResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Work Order not found"
        );
      }
      successResponse(
        res,
        HTTP_STATUS.OK,
        "Work Order fetched successfully",
        workOrder
      );
    } catch (err) {
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error fetching Work Order",
        err.message
      );
    }
  }

  async selectByEquipment(req, res) {
    try {
      const condition = {};
      const customClauses = [
        {
          sql: `b.active = :active and DATE_FORMAT(b.createdAt, '%Y-%m') <> :month and b.equipmentCode = :equipmentCode`,
          value: {
            active: 1,
            month: req.query.month,
            equipmentCode: req.query.equipmentCode,
          },
        },
      ];
      const orderBy = "b.createdAt";

      const workOrders = await WorkOrder.selectByEquipment(
        condition,
        customClauses,
        orderBy
      );

      successResponse(
        res,
        HTTP_STATUS.OK,
        "Work Order(s) fetched successfully",
        workOrders
      );
    } catch (err) {
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error fetching Work Orders",
        err.message
      );
    }
  }

  async update(req, res) {
    const transaction = await sequelize.transaction(); // Start a transaction
    try {
      const {
        description,
        status,
        scheduleAt,
        equipmentCode,
        type,
        taskList,
        startWorkAt,
        assessAt,
        completedAt,
        workStatus,
        rating,
      } = req.body;

      const payloadWorkOrder = {
        description: description,
        status: status,
        startWorkAt: utils.formatDate({
          date: startWorkAt,
          straightDateTime: true,
        }),
        assessAt: utils.formatDate({ date: assessAt, straightDateTime: true }),
        scheduleAt: utils.formatDate({ date: scheduleAt, straightDate: true }),
        completedAt:
          completedAt === null
            ? null
            : utils.formatDate({ date: completedAt, straightDateTime: true }),
        workStatus: workStatus,
        rating: rating,
        updatedBy: req.user.username,
      };

      if (type === "CORRECTIVE" && status === 2) {
        await Equipment.update(
          { active: 1 },
          { code: equipmentCode },
          transaction
        );
      }

      if (workStatus === "FOR REPAIR") {
        await Equipment.update(
          { active: 2 },
          { code: equipmentCode },
          transaction
        );

        payloadWorkOrder.type = "CORRECTIVE";
      }

      const workOrder = await WorkOrder.update(
        payloadWorkOrder,
        { code: req.params.id },
        transaction
      );

      if (!utils.isObjAndEmpty(workOrder)) {
        for (const list of taskList) {
          const payload = {
            workOrderCode: workOrder.code,
            taskCode: list.taskCode,
            description: list.description,
            taskStatus: utils.empty(list.taskStatus) ? null : list.taskStatus,
          };
          if (list.taskId === null) {
            payload.createdBy = req.user.username;
            await WorkOrdersDetail.insert(payload, transaction);
          } else {
            if (list.taskId !== undefined) {
              payload.updatedBy = req.user.username;
              await WorkOrdersDetail.update(
                payload,
                { id: list.taskId },
                transaction
              );
            }
          }
        }
      }
      await transaction.commit();
      successResponse(
        res,
        HTTP_STATUS.CREATED,
        "Work Order created successfully",
        true
      );
    } catch (err) {
      await transaction.rollback();
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error creating Work Order",
        err.message
      );
    }
  }
}

module.exports = new WorkOrderController(); // Export using CommonJS syntax
