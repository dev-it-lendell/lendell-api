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
        "filter[others][job_requisition_id]": "R1562486",
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

      const candidateStatus = await CandidateStatus.select(
        { active: 1 },
        {},
        "",
        "",
        transaction
      );

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

      let payloadToDisplay = [];
      if (allCandidates.length > 0) {
        for (const list of allCandidates) {
          const clientId = "";
          const siteId = "";
          let endorsementPayload = {
            full_name: `${list.last_name}, ${list.first_name} ${
              list.others.middle_name ?? ""
            }`,
            fname: list.first_name,
            mname: list.others.middle_name ?? "",
            lname: list.last_name,
            suffix: "-",
            birthdate: list.others.date_of_birth,
            endo_desc: list.others.job_requisition_id,
            endo_date: list.created_at,
            endo_status: "0",
            client_id: clientId,
            endorsed_to: "",
            turn_around_date: list.completed_at,
            endo_services: "BI",
            endo_requestor: list.others.bi_peme_poc ?? "",
            site_id: siteId,
            importance: "1",
            account: "",
            package_desc: "Standard",
            is_rerun: "0",
            active: 0,
            external_client_id: list.id,
            talkpush_status: list.state,
            folder: list.folder,
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
        "filter[others][bi_check]": "Lendell",
        include_documents: true,
        include_attachments: true,
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

          const documents = list.documents;
          const attachments = list.attachments;

          
          const filesWithUrls = [];

          // console.log(list);
          // Attachment and Documents //

          if (list.documents.length > 0) {
            if (Array.isArray(list.documents)) {
              list.documents.forEach((doc) => {
                if (Array.isArray(doc.files)) {
                  doc.files.forEach((file) => {
                    if (file.url && file.name) {
                      const fileType = file.name.slice(-3).toLowerCase();
                      filesWithUrls.push({
                        tag: doc.tag,
                        name: file.name,
                        type: "document",
                        content_url: file.url,
                        content_type: fileType,
                      });
                    }
                  });
                }
              });
            }
          }

          // Extract from attachments (if any)
          if (list.attachments.length > 0) {
            if (Array.isArray(list.attachments)) {
              list.attachments.forEach((att) => {
                if (att.url && att.name) {
                  const fileType = att.name.slice(-3).toLowerCase();
                  filesWithUrls.push({
                    tag: att.tag || "Attachment",
                    name: att.name,
                    type: "attachment",
                    content_url: att.url,
                    content_type: fileType,
                  });
                }
              });
            }
          }

          delete list.documents;
          delete list.attachments;
          delete list.photo;
          delete list.others["gdpr_opt-in"];
          delete list.others.yes;



          let endorsementPayload = {
            full_name: `${list.last_name}, ${list.first_name} ${
              list.others.middle_name ?? ""
            }`,
            fname: list.first_name,
            mname: list.others.middle_name ?? "",
            lname: list.last_name,
            suffix: "-",
            birthdate: list.others.date_of_birth ?? null,
            endo_desc: list.others.job_requisition_id,
            endo_date: list.created_at,
            endo_formatdate: utils.formatDate({
              date: list.created_at,
              withDayName: true,
            }),
            endo_status: "0",
            endorsed_to: "",
            turn_around_date: list.completed_at,
            endo_services: "BI",
            endo_requestor: list.others.bi_peme_poc ?? "",
            importance: "1",
            account: "",
            package_desc: "Standard",
            is_rerun: "0",
            active: 0,
            external_client_id: list.id,
            talkpush_status: list.state,
            folder: list.folder,
            rawData: JSON.stringify(list),
            attachments: attachments,
            documents: documents,
            files: filesWithUrls,
            hasFiles: filesWithUrls.length > 0 ? 'YES' : 'NO'
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
        // errorResponse(
        //   {},
        //   HTTP_STATUS.INTERNAL_SERVER_ERROR,
        //   "Error retrieving data",
        //   error
        // );
        return error;
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
