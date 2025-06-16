const sequelize = require("../../../config/database");
const utils = require("../../../helpers/utils");
const sql = require("../../../helpers/sql");
const FormData = require("form-data");
const axios = require("axios");

const CandidateStatus = require("../models/CandidateStatus");
const EndorsedTo = require("../models/EndorsedTo");
const Endorsement = require("../models/Endorsement");
const EndorsementBIProcess = require("../models/EndorsementBIProcess");
const EndorsementLog = require("../models/EndorsementLog");

const {
  HTTP_STATUS,
  errorResponse,
  successResponse,
} = require("../../../helpers/httpStatus");

class CandidatesController {
  async selectCandidateStatus(req, res) {
    try {
      const customClauses = [];

      const candidateStatus = await CandidateStatus.select(
        { active: 1 },
        customClauses,
        ""
      );

      successResponse(
        res,
        HTTP_STATUS.OK,
        "Candidate Status fetched successfully",
        candidateStatus
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

  async insertCandidatesEndorsement(req, res) {
    const transaction = await sequelize.transaction(); // Start a transaction
    try {
      // console.log(req.body);

      let payloadToDisplay = [];
      if (req.body.length > 0) {
        for (const list of req.body) {
          const currentMonth = new Date().getMonth() + 1;
          const endoCode = await sql.generateUniqueCode(
            "lendellp_losis_test.tbl_endo",
            `CNX-0${utils.pad(currentMonth)}`,
            "endo_code",
            10000000,
            99999999,
            transaction
          );

          const applicationCode = await sql.generateUniqueCode(
            "lendellp_losis_test.tbl_endo",
            `APPL-0${utils.pad(currentMonth)}`,
            "application_code",
            10000000,
            99999999,
            transaction
          );

          let endorsementPayload = {
            fname: list.fname,
            mname: list.mname,
            lname: list.lname,
            suffix: list.suffix,
            birthdate: utils.formatDate({
              date: list.birthdate,
              straightDate: true,
            }),
            endo_id: await sql.generateUniqueCode(
              "lendellp_losis_test.tbl_endo",
              `LOSI-0${utils.pad(currentMonth)}`,
              "endo_id",
              10000000,
              99999999,
              transaction
            ),
            endo_desc: list.endo_desc,
            endo_code: endoCode,
            endo_date: utils.formatDate({
              date: list.endo_date,
              straightDate: true,
            }),
            endo_status: "0",
            folder_name: endoCode,
            client_id: list.client_id,
            endorsed_to: list.user_supervisor_id, // User Supervisor
            turn_around_date:
              list.turn_around_date === null
                ? null
                : utils.formatDate({
                    date: list.turn_around_date,
                    straightDate: true,
                  }),
            endo_services: list.endo_services,
            endo_requestor: list.endo_requestor,
            site_id: list.site_id,
            importance: list.importance,
            account: list.account,
            package_desc: list.package_desc,
            application_code: applicationCode,
            is_rerun: list.is_rerun,
            external_client_id: list.external_client_id,
          };

          let endorsedToPayload = {
            endo_code: endoCode,
            endorsed_by: list.client_id,
            endorsed_to: list.team_id,
          };

          let endorsementBIProcessPayload = {
            assigned_supervisor: list.user_supervisor_id, // User Supervisor
            percentage_: "15",
            endo_code: endoCode,
            datetime_added: utils.currentDateTime(),
          };

          let endorsementLogsPayload = {
            client_id: list.client_id,
            endo_code: endoCode,
            endo_action: "Create New Endorsement",
            assigned_poc: list.user_supervisor_id, // User Supervisor
            assigned_team: list.team_id, // TEAM
            datetime_added: utils.currentDateTime(),
          };

          const endorsement = await Endorsement.select({
            external_client_id: list.external_client_id,
          });


          if (endorsement.length === 0) {
            endorsementPayload = await Endorsement.insert(
              endorsementPayload,
              transaction
            );
            endorsedToPayload = await EndorsedTo.insert(
              endorsedToPayload,
              transaction
            );
            endorsementBIProcessPayload = await EndorsementBIProcess.insert(
              endorsementBIProcessPayload,
              transaction
            );
            endorsementLogsPayload = await EndorsementLog.insert(
              endorsementLogsPayload,
              transaction
            );
            
          console.log(endorsementPayload, endorsedToPayload)
            payloadToDisplay.push({
              endorsement: endorsementPayload,
              endorsedTo: endorsedToPayload,
              endorsementBIProcess: endorsementBIProcessPayload,
              endorsementLogs: endorsementLogsPayload,
            });
          }
        }
      }
      // const candidateEndorsement = await Department.insert(req.body, transaction);
      await transaction.commit();
      successResponse(
        res,
        HTTP_STATUS.CREATED,
        "Candidate endorsement created successfully",
        payloadToDisplay
      );
    } catch (err) {
      console.log(err);
      await transaction.rollback();
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error creating Candidate endorsement",
        err.message
      );
    }
  }

  async sendFinalReport(req, res) {
    if (utils.empty(req.params.id) || req.params.id === "undefined") {
      return errorResponse(
        res,
        HTTP_STATUS.BAD_REQUEST,
        "Missing Parameter(s)",
        {}
      );
    }

    try {
      const file = req.file;

      if (!file) {
        errorResponse(
          res,
          HTTP_STATUS.BAD_REQUEST,
          "No file uploaded",
          err.message
        );
      }

      try {
        const candidateId = req.params.id;
        const apiKey = process.env.TALKPUSH_API_KEY;

        if (!req.file)
          return res.status(400).json({ error: "No file provided" });

        let data = new FormData();
        
        data.append("document_tag_name", req.body.document_tag_name);
        data.append("file", req.file.buffer, {
          filename: req.file.originalname,
          contentType: req.file.mimetype,
          knownLength: req.file.size,
        });

        const talkpushUrl = `https://concentrix-ph.talkpush.com/api/talkpush_services/campaign_invitations/${candidateId}/documents?api_key=${apiKey}`;

        let config = {
          method: "put",
          maxBodyLength: Infinity,
          url: talkpushUrl,
          data: data,
        };


        const result = await axios
          .request(config)
          .then((response) => {
            return JSON.stringify(response.data);
          })
          .catch((error) => {
            console.log(error);
          });

        successResponse(
          res,
          HTTP_STATUS.CREATED,
          "Candidate endorsement successfully sent",
          result
        );
      } catch (error) {
        console.log(error);
        console.error("Error uploading to Talkpush:", error);
        errorResponse(
          res,
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
          "Upload failed",
          error
        );
      }
    } catch (err) {
      console.log(err);
      errorResponse(
        res,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Error sending Candidate endorsement",
        err.message
      );
    }
  }
}

module.exports = new CandidatesController();
