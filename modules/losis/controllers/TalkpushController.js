require("dotenv").config();

const axios = require("axios");

const utils = require("../../../helpers/utils");

const {
  HTTP_STATUS,
  errorResponse,
  successResponse,
} = require("../../../helpers/httpStatus");

const requestOptions = {
  method: "GET",
  redirect: "follow",
};

class TalkpushController {
  async getCandidates(req, res) {
    if (utils.empty(req.query)) {
      return errorResponse(
        res,
        HTTP_STATUS.BAD_REQUEST,
        "Missing Parameter(s)",
        {}
      );
    }

    const { status } = req.query;

    const payload = {
      "filter[status_selected]": status,
      "filter[others][msa]": "24091 - Block Inc - 980005835",
      "filter[others][job_requisition_primary_location]":
        "PHL Quezon City - Giga Tower, 10th, 11th, 19th Flr",
    };

    const queryStr = utils.queryToStr(payload, true);

    await fetch(
      `${process.env.TALKPUSH_CONCENTRIX_API_URL}campaign_invitations?api_key=${process.env.TALKPUSH_API_KEY}&${queryStr}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        successResponse(
          res,
          HTTP_STATUS.OK,
          "Talkpush Candidate Data",
          JSON.parse(result),
          true
        );
      })
      .catch((error) => {
        console.log(error);
        errorResponse(
          res,
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          "Error retrieving data",
          error
        );
      });
  }

  async getFolders(req, res) {
    await fetch(
      `${process.env.TALKPUSH_CONCENTRIX_API_URL}company/folders?api_key=${process.env.TALKPUSH_API_KEY}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        successResponse(
          res,
          HTTP_STATUS.OK,
          "Talkpush Folder Data",
          JSON.parse(result),
          true
        );
      })
      .catch((error) => {
        console.log(error);
        errorResponse(
          res,
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          "Error retrieving data",
          error
        );
      });
  }
}

module.exports = new TalkpushController();
