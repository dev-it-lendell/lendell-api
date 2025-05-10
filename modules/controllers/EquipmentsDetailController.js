const EquipmentsDetail = require("../models/EquipmentsDetail");
const sequelize = require("../../config/database");
const {
  HTTP_STATUS,
  errorResponse,
  successResponse,
} = require("../../helpers/httpStatus");

const sqlHelper = require("../../helpers/sql");

class EquipmentsDetailController {
  async selectById(req, res) {
    try {
      const equipmentsDetail = await EquipmentsDetail.select(
        {
          equipmentCode: req.params.id,
        },
        "sequence ASC"
      );
      if (!equipmentsDetail) {
        return errorResponse(
          res,
          HTTP_STATUS.NOT_FOUND,
          "Equipments Detail not found"
        );
      }
      successResponse(
        res,
        HTTP_STATUS.OK,
        "Equipments Detail fetched successfully",
        equipmentsDetail
      );
    } catch (err) {
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error fetching Equipments Detail",
        err.message
      );
    }
  }

  async updateDetails(req, res) {
    const transaction = await sequelize.transaction(); // Start a transaction
    try {
      const { updatePayload, insertPayload, deletionPayload } = req.body;

      let returnData = [];
      if (updatePayload.length > 0) {
        for (const updateList of updatePayload) {
          const id = updateList.taskId;
          delete updateList.taskId;

          updateList.updatedBy = req.user.username;
          const updatedData = await EquipmentsDetail.update(
            updateList,
            {
              id: id,
            },
            transaction
          );

          returnData.push(updatedData[0]);
        }
      }

      if (insertPayload.length > 0) {
        for (const insertList of insertPayload) {
          insertList.createdBy = req.user.username;
          insertList.code = await sqlHelper.generateUniqueId(
            "T",
            "equipments_details",
            "createdAt",
            transaction,
            sequelize
          );
          const insertedData = await EquipmentsDetail.insert(
            insertList,
            transaction
          );
          returnData.push(insertedData[0]);
        }
      }

      if (deletionPayload.length > 0) {
        for (const deleteList of deletionPayload) {
          deleteList.updatedBy = req.user.username;
          const deletedData = await EquipmentsDetail.update(
            {
              active: 0,
            },
            {
              id: deleteList.taskId,
            },
            transaction
          );

          returnData.push(deletedData[0]);
        }
      }

      await transaction.commit();
      successResponse(
        res,
        HTTP_STATUS.OK,
        "Equipments Detail updated successfully",
        returnData
      );
    } catch (err) {
      await transaction.rollback();
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error updating Equipments Detail",
        err.message
      );
    }
  }
}

module.exports = new EquipmentsDetailController(); // Export using CommonJS syntax
