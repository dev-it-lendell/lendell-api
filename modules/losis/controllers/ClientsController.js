const Client = require("../models/Client");
const Supervisor = require("../models/Supervisor");
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
          sql: `a.company_name like :company_name`,
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
        "Client(s) fetched successfully",
        client
      );
    } catch (err) {
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error fetching client(s)",
        err.message
      );
    }
  }

  async selectSupervisor(req, res) {
    try {
      const customClauses = [];
      const condition = {};

      if (!utils.empty(req.query.supervisor_id)) {
        customClauses.push({
          sql: `supervisor_id = :supervisor_id`,
          value: {
            supervisor_id: req.query.supervisor_id,
          },
        });
      }

      const supervisor = await Supervisor.select(
        condition,
        customClauses,
        ""
      );

      successResponse(
        res,
        HTTP_STATUS.OK,
        "Supervisor(s) fetched successfully",
        supervisor
      );
    } catch (err) {
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error fetching supervisor(s)",
        err.message
      );
    }
  }
}

module.exports = new ClientsController();
