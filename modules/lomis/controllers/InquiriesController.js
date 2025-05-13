const Inquiry = require("../models/Inquiry");
const utils = require("../../../helpers/utils");

const {
  HTTP_STATUS,
  errorResponse,
  successResponse,
} = require("../../../helpers/httpStatus");

class InquiriesController {
  async selectAll(req, res) {
    try {
      const { fromDate, toDate } = req.query;
      const customClauses = [
        {
          sql: `date_created between :fromDate and :toDate`,
          value: {
            fromDate: fromDate,
            toDate: toDate,
          },
        },
      ];

      const inquiry = await Inquiry.select(
        { active: 1 },
        customClauses,
        "date_created"
      );

      if (inquiry.length > 0) {
        for (const list of inquiry) {
          list.active_status = list.active === 1 ? "ACTIVE" : "INACTIVE";
          list.date_created = utils.formatDate({ date: list.date_created });
          list.date_updated = utils.formatDate({ date: list.date_updated });
        }
      }

      successResponse(
        res,
        HTTP_STATUS.OK,
        "Inquiries fetched successfully",
        inquiry
      );
    } catch (err) {
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error fetching inquiries",
        err.message
      );
    }
  }
}

module.exports = new InquiriesController();
