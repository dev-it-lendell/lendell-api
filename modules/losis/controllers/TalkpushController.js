require("dotenv").config();

const EndorsedTo = require("../models/EndorsedTo");
const Endorsement = require("../models/Endorsement");
const EndorsementBIProcess = require("../models/EndorsementBIProcess");
const EndorsementLog = require("../models/EndorsementLog");
const CandidateStatus = require("../models/CandidateStatus");

const sequelize = require("../../../config/database");
const utils = require("../../../helpers/utils");
const sql = require("../../../helpers/sql");

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
    // if (utils.empty(req.query)) {
    //   return errorResponse(
    //     res,
    //     HTTP_STATUS.BAD_REQUEST,
    //     "Missing Parameter(s)",
    //     {}
    //   );
    // }

    const transaction = await sequelize.transaction(); // Start a transaction

    try {
      const { status, application_id } = req.query;

      const payload = {
        // "filter[others][msa]": "24091 - Block Inc - 980005835",
        "filter[others][job_requisition_id]": "R1562486"
        // "filter[others][job_requisition_primary_location]":
        //   "PHL Quezon City - Giga Tower, 10th, 11th, 19th Flr",
      };

      // Status:
      // hired
      // complete_pre_onboarding
      // onboarded
      // workday_onboarding
      // End Status

      if (!utils.empty(application_id)) {
        Object.assign(payload, { "filter[query]": `AP${application_id}$` });
      }

      // if (!utils.empty(status)) {
      //   Object.assign(payload, { "filter[status_selected]": status });
      // }

      const candidateStatus = await CandidateStatus.select(
        { active: 1 },
        {},
        "",
        "",
        transaction
      );
      // console.log(candidateStatus);

      let candidates = [];
      const allCandidates = [];
      for (const list of candidateStatus) {
        payload["filter[status_selected]"] = list.code;
        payload.page = 1;
        let candidatesByStatus = await this.getCandidatesFromTalkPush(payload);
        // candidates.push(candidatesByStatus);

        if (candidatesByStatus.total > 0) {
          allCandidates.push(...candidatesByStatus.candidates);
          const totalPages = candidatesByStatus.pages;

          // Only loop if there are more than 1 page
          for (let page = 2; page <= totalPages; page++) {
            Object.assign(payload, { page: page });
            const nextPagesData = await this.getCandidatesFromTalkPush(payload);
            // const data = await res.json();
            allCandidates.push(...nextPagesData.candidates);
          }
        }
      }

      // console.log(allCandidates);

      let payloadToDisplay = [];
      if (allCandidates.length > 0) {
        // INSERT DATA TO DB
        // const filterOne = allCandidates.filter(
        //   (filterCandidate) => filterCandidate.id === 9967721
        // );

        //  const endoCode = await sql.generateUniqueCode(
        //     "lendellp_losis_test.tbl_endo",
        //     `CNX-0${utils.pad(currentMonth)}`,
        //     "endo_code",
        //     10000000,
        //     99999999,
        //     transaction
        //   );

        for (const list of allCandidates) {
          // for (const list of filterOne) {
          // const currentMonth = new Date().getMonth() + 1;
          // const endoCode = await sql.generateUniqueCode(
          //   "lendellp_losis_test.tbl_endo",
          //   `CNX-0${utils.pad(currentMonth)}`,
          //   "endo_code",
          //   10000000,
          //   99999999,
          //   transaction
          // );

          // const applicationCode = await sql.generateUniqueCode(
          //   "lendellp_losis_test.tbl_endo",
          //   `APPL-0${utils.pad(currentMonth)}`,
          //   "application_code",
          //   10000000,
          //   99999999,
          //   transaction
          // );

          const clientId = "";
          const siteId = "";
          // const clientId = "LOSIS-000049";
          // const siteId = "LOSI-CL-000002";

          let endorsementPayload = {
            // bi_id: 12314121, // GENERATION?
            full_name: `${list.last_name}, ${list.first_name} ${
              list.others.middle_name ?? ""
            }`,
            fname: list.first_name,
            mname: list.others.middle_name ?? "",
            lname: list.last_name,
            suffix: "-",
            birthdate: list.others.date_of_birth,
            // endo_id: await sql.generateUniqueCode(
            //   "lendellp_losis_test.tbl_endo",
            //   `LOSI-0${utils.pad(currentMonth)}`,
            //   "endo_id",
            //   10000000,
            //   99999999,
            //   transaction
            // ),
            endo_desc: list.campaign_title,
            // endo_code: endoCode,
            endo_date: list.created_at,
            endo_status: "0",
            // folder_name: endoCode,
            client_id: clientId,
            endorsed_to: "",
            turn_around_date: list.completed_at,
            endo_services: "BI",
            endo_requestor: list.others.bi_peme_poc ?? "",
            site_id: siteId,
            importance: "1",
            account: "",
            package_desc: "Standard",
            // application_code: applicationCode,
            is_rerun: "0",
            active: 0,
            external_client_id: list.id,
            talkpush_status: list.state,
            folder: list.folder,
          };

          // let endorsedToPayload = {
          //   endo_code: endoCode,
          //   endorsed_by: "",
          //   endorsed_to: "",
          // };

          // let endorsementBIProcessPayload = {
          //   assigned_supervisor: "",
          //   percentage_: "15",
          //   endo_code: endoCode,
          //   datetime_added: utils.currentDateTime(),
          // };

          // let endorsementLogsPayload = {
          //   client_id: clientId,
          //   endo_code: endoCode,
          //   endo_action: "Create New Endorsement",
          //   assigned_poc: "",
          //   assigned_team: "",
          //   datetime_added: utils.currentDateTime(),
          // };

          // const endorsement = await Endorsement.select({
          //   external_client_id: list.id,
          // });
          // const endorsedTo = await EndorsedTo.select({ endo_code: endoCode });
          // const endorsementBIProcess = await EndorsementBIProcess.select({
          //   endo_code: endoCode,
          // });
          // const endorsementLog = await EndorsementLog.select({
          //   endo_code: endoCode,
          // });

          // if (endorsement.length === 0) {
          // endorsementPayload = await Endorsement.insert(
          //   endorsementPayload,
          //   transaction
          // );
          // endorsedToPayload = await EndorsedTo.insert(
          //   endorsedToPayload,
          //   transaction
          // );
          // endorsementBIProcessPayload = await EndorsementBIProcess.insert(
          //   endorsementBIProcessPayload,
          //   transaction
          // );
          // endorsementLogsPayload = await EndorsementLog.insert(
          //   endorsementLogsPayload,
          //   transaction
          // );
          // payloadToDisplay.push({
          //   endorsement: endorsementPayload,
          //   endorsedTo: endorsedToPayload,
          //   endorsementBIProcess: endorsementBIProcessPayload,
          //   endorsementLogs: endorsementLogsPayload,
          // });
          // }

          payloadToDisplay.push(endorsementPayload);

          // console.log(payloadEndorsement);
        }
      }

      await transaction.commit();
      successResponse(
        res,
        HTTP_STATUS.OK,
        "Talkpush Candidate Data",
        payloadToDisplay,
        true
      );
    } catch (err) {
      console.log(err);
      await transaction.rollback();
    }
  }

  async getCandidatesByStatus(req, res) {
    if (utils.empty(req.query)) {
      return errorResponse(
        res,
        HTTP_STATUS.BAD_REQUEST,
        "Missing Parameter(s)",
        {}
      );
    }

    const transaction = await sequelize.transaction(); // Start a transaction

    try {
      const { status, application_id } = req.query;

      const payload = {
        "filter[others][bi_check]": "Lendell"
        // "filter[others][msa]": "24091 - Block Inc - 980005835",
        // "filter[others][job_requisition_primary_location]":
        //   "PHL Quezon City - Giga Tower, 10th, 11th, 19th Flr",
      };

      if (!utils.empty(application_id)) {
        Object.assign(payload, { "filter[query]": `AP${application_id}` });
      }

      if (!utils.empty(status)) {
        Object.assign(payload, { "filter[status_selected]": status });
      }

      const allCandidates = [];

      let candidatesByStatus = await this.getCandidatesFromTalkPush(payload);

      if (candidatesByStatus.total > 0) {
        allCandidates.push(...candidatesByStatus.candidates);
        const totalPages = candidatesByStatus.pages;

        // Only loop if there are more than 1 page
        for (let page = 2; page <= totalPages; page++) {
          Object.assign(payload, { page: page });
          const nextPagesData = await this.getCandidatesFromTalkPush(payload);
          // const data = await res.json();
          allCandidates.push(...nextPagesData.candidates);
        }
      }

      let payloadToDisplay = [];
      if (allCandidates.length > 0) {
        for (const list of allCandidates) {
          const endorsement = await Endorsement.select({
            external_client_id: list.id,
          });

          if (endorsement.length > 0) {
            continue;
          }

          let endorsementPayload = {
            full_name: `${list.last_name}, ${list.first_name} ${
              list.others.middle_name ?? ""
            }`,
            fname: list.first_name,
            mname: list.others.middle_name ?? "",
            lname: list.last_name,
            suffix: "-",
            birthdate: list.others.date_of_birth,
            endo_desc: list.campaign_title,
            endo_date: list.created_at,
            endo_formatdate: utils.formatDate({
              date: list.created_at,
              withDayName: true,
            }),
            endo_status: "0",
            // client_id: clientId,
            endorsed_to: "",
            turn_around_date: list.completed_at,
            endo_services: "BI",
            endo_requestor: list.others.bi_peme_poc ?? "",
            // site_id: siteId,
            importance: "1",
            account: "",
            package_desc: "Standard",
            is_rerun: "0",
            active: 0,
            external_client_id: list.id,
            talkpush_status: list.state,
            folder: list.folder,
            rawData: list
          };

          payloadToDisplay.push(endorsementPayload);
        }
      }

      await transaction.commit();
      successResponse(
        res,
        HTTP_STATUS.OK,
        "Talkpush Candidate Data",
        payloadToDisplay,
        true
      );
    } catch (err) {
      console.log(err);
      await transaction.rollback();
    }
  }

  async getCandidatesFromTalkPush(payload) {
    const queryStr = utils.queryToStr(payload, true);
    console.log(
      `${process.env.TALKPUSH_CONCENTRIX_API_URL}campaign_invitations?api_key=${process.env.TALKPUSH_API_KEY}&${queryStr}`
    );
    return await fetch(
      `${process.env.TALKPUSH_CONCENTRIX_API_URL}campaign_invitations?api_key=${process.env.TALKPUSH_API_KEY}&${queryStr}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        return JSON.parse(result);
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
