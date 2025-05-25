const Client = require("../models/Client");
const utils = require("../../../helpers/utils");

const {
  HTTP_STATUS,
  errorResponse,
  successResponse,
} = require("../../../helpers/httpStatus");

class ClientsController {
  async selectClient(req, res) {
    try {
      const customClauses = [];
      const condition = {
        // company_name: "Concentrix CVG Philippines, Inc.",
      };

      if (!utils.empty(req.query.company_name)) {
        customClauses.push({
          sql: `company_name like :company_name`,
          value: {
            company_name: `%${req.query.company_name}%`,
          },
        });
      }

      const client = await Client.select(condition, customClauses, "");

      if (client.length > 0) {
        for (const list of client) {
          list.label =
            `${list.lname}, ${list.fname} ${list.mname}`.toUpperCase();
          list.value = list.user_id;
        }
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
        "Error fetching candidate status",
        err.message
      );
    }
  }
}

module.exports = new ClientsController();
