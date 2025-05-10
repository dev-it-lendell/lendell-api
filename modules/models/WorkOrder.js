const { Model } = require("sequelize");
const sequelize = require("../../config/database");
const utils = require("../../helpers/utils");
const WorkOrdersDetail = require("../models/WorkOrdersDetail");

class WorkOrder extends Model {
  static async select(condition = {}, customClauses = [], orderBy = null) {
    try {
      let query = `SELECT 
          b.code workOrderCode,
          CASE
              WHEN b.type IS NULL THEN 'PREVENTIVE'
              ELSE UPPER(b.type)
          END workOrderType,
          b.createdAt workOrderDateTime,
          b.updatedAt workOrderUpdateDateTime,
          CASE
              WHEN b.status IS NULL THEN 0
              ELSE b.status
          END workOrderStatus,
          CASE
              WHEN b.status IS NULL THEN 'FLOATING'
              ELSE CASE
                  WHEN b.status = 1 THEN 'PENDING'
                  ELSE 'COMPLETED'
              END
          END workOrderStatusDesc,
          b.description workOrderDescription,
          b.scheduleAt,
          b.startWorkAt,
          b.assessAt,
          b.completedAt,
          b.workStatus,
          b.rating,
          a.*,
          c.name departmentName,
          d.name supplierName
      FROM
          equipments a
              LEFT JOIN
          work_orders b ON b.equipmentCode = a.code 
              AND (DATE_FORMAT(b.createdAt, '%Y-%m') = :month
              OR (b.type = 'corrective' AND status = 1))
              JOIN  
          departments c ON c.code = a.departmentCode
              JOIN
          suppliers d ON d.code = a.supplierCode
      `;

      const replacements = {};

      // Add standard conditions dynamically
      if (Object.keys(condition).length > 0) {
        query += " WHERE ";
        const clauses = [];
        for (const [key, value] of Object.entries(condition)) {
          clauses.push(`${key} = :${key}`); // Use named parameters
          replacements[key] = value; // Add value to replacements
        }
        query += clauses.join(" AND ");
      }

      // Add custom clauses (with safe parameter bindings)
      if (customClauses.length > 0) {
        query += Object.keys(condition).length > 0 ? " AND " : " WHERE ";

        const clauses = [];
        customClauses.forEach((clause, index) => {
          clauses.push(clause.sql); // Use the SQL string directly
          Object.assign(replacements, clause.value); // Merge parameterized values
        });

        query += clauses.join(" OR ");
      }

      // Add ORDER BY clause if provided
      if (orderBy) {
        query += ` ORDER BY ${orderBy}`;
      }

      // Execute the query
      const data = await sequelize.query(query, {
        replacements, // Safe parameter binding
        type: sequelize.QueryTypes.SELECT,
      });

      // Format results
      for (const list of data) {
        list.createdAt = utils.formatDate({
          date: list.createdAt,
        });
        list.updatedAt = utils.formatDate({
          date: list.updatedAt,
        });
        list.workOrderDateTime = utils.formatDate({
          date: list.workOrderDateTime,
        });

        list.formattedWorkOrderUpdateDateTime = utils.formatDate({
          date: list.workOrderUpdateDateTime,
        });

        list.formattedScheduleAt = utils.formatDate({
          date: list.scheduleAt,
          dateOnly: true,
        });

        if (list.startWorkAt !== null) {
          list.startWorkAt = utils.formatDate({
            date: list.startWorkAt,
            straightDateTime: true,
          });

          list.formattedStartWorkAt = utils.formatDate({
            date: list.startWorkAt,
          });
        }

        if (list.assessAt !== null) {
          list.assessAt = utils.formatDate({
            date: list.assessAt,
            straightDateTime: true,
          });

          list.formattedAssessAt = utils.formatDate({
            date: list.assessAt,
          });
        }

        if (list.completedAt !== null) {
          list.completedAt = utils.formatDate({
            date: list.completedAt,
            straightDateTime: true,
          });

          list.formattedCompletedAt = utils.formatDate({
            date: list.completedAt,
          });
        }

        list.rowStatus = list.active === 1 ? "ACTIVE" : "INACTIVE";
      }

      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  static async selectByEquipment(
    condition = {},
    customClauses = [],
    orderBy = null
  ) {
    try {
      let query = `SELECT 
          b.code workOrderCode,
          CASE
              WHEN b.type IS NULL THEN 'PREVENTIVE'
              ELSE UPPER(b.type)
          END workOrderType,
          b.createdAt workOrderDateTime,
          b.updatedAt workOrderUpdateDateTime,
          CASE
              WHEN b.status IS NULL THEN 0
              ELSE b.status
          END workOrderStatus,
          CASE
              WHEN b.status IS NULL THEN 'FLOATING'
              ELSE CASE
                  WHEN b.status = 1 THEN 'PENDING'
                  ELSE 'COMPLETED'
              END
          END workOrderStatusDesc,
          b.description workOrderDescription,
          b.scheduleAt,
          b.startWorkAt,
          b.assessAt,
          b.completedAt,
          b.workStatus,
          b.rating,
          a.*,
          c.name departmentName,
          d.name supplierName
      FROM
          equipments a
              LEFT JOIN
          work_orders b ON b.equipmentCode = a.code 
              JOIN  
          departments c ON c.code = a.departmentCode
              JOIN
          suppliers d ON d.code = a.supplierCode
      `;

      const replacements = {};

      // Add standard conditions dynamically
      if (Object.keys(condition).length > 0) {
        query += " WHERE ";
        const clauses = [];
        for (const [key, value] of Object.entries(condition)) {
          clauses.push(`${key} = :${key}`); // Use named parameters
          replacements[key] = value; // Add value to replacements
        }
        query += clauses.join(" AND ");
      }

      // Add custom clauses (with safe parameter bindings)
      if (customClauses.length > 0) {
        query += Object.keys(condition).length > 0 ? " AND " : " WHERE ";

        const clauses = [];
        customClauses.forEach((clause, index) => {
          clauses.push(clause.sql); // Use the SQL string directly
          Object.assign(replacements, clause.value); // Merge parameterized values
        });

        query += clauses.join(" OR ");
      }

      // Add ORDER BY clause if provided
      if (orderBy) {
        query += ` ORDER BY ${orderBy} LIMIT 50`;
      }

      // Execute the query
      const data = await sequelize.query(query, {
        replacements, // Safe parameter binding
        type: sequelize.QueryTypes.SELECT,
      });

      // Format results
      for (const list of data) {
        const condition = {}; // Standard condition
        const customClauses = [
          {
            sql: `a.active = :active AND c.code = :workOrderCode`,
            value: {
              active: 1,
              workOrderCode: list.workOrderCode,
            },
          },
        ];
        const orderBy = "";

        list.taskList = await WorkOrdersDetail.select(
          condition,
          customClauses,
          orderBy
        );

        list.createdAt = utils.formatDate({
          date: list.createdAt,
        });
        list.updatedAt = utils.formatDate({
          date: list.updatedAt,
        });
        list.workOrderDateTime = utils.formatDate({
          date: list.workOrderDateTime,
        });

        list.formattedWorkOrderUpdateDateTime = utils.formatDate({
          date: list.workOrderUpdateDateTime,
        });

        list.formattedScheduleAt = utils.formatDate({
          date: list.scheduleAt,
          dateOnly: true,
        });

        if (list.startWorkAt !== null) {
          list.startWorkAt = utils.formatDate({
            date: list.startWorkAt,
            straightDateTime: true,
          });

          list.formattedStartWorkAt = utils.formatDate({
            date: list.startWorkAt,
          });
        }

        if (list.assessAt !== null) {
          list.assessAt = utils.formatDate({
            date: list.assessAt,
            straightDateTime: true,
          });

          list.formattedAssessAt = utils.formatDate({
            date: list.assessAt,
          });
        }

        if (list.completedAt !== null) {
          list.completedAt = utils.formatDate({
            date: list.completedAt,
            straightDateTime: true,
          });

          list.formattedCompletedAt = utils.formatDate({
            date: list.completedAt,
          });
        }

        list.rowStatus = list.active === 1 ? "ACTIVE" : "INACTIVE";
      }

      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  static async insert(data, transaction) {
    try {
      const fields = Object.keys(data).join(", ");
      const values = Object.keys(data)
        .map((key) => `:${key}`)
        .join(", ");

      const query = `INSERT INTO Work_Orders (${fields}) VALUES (${values})`;

      const result = await sequelize.query(query, {
        replacements: data,
        type: sequelize.QueryTypes.INSERT,
        transaction,
      });

      const insertedId = result[0]; // First element contains the inserted primary key (if available)

      // If `id` is available, use it; otherwise, use a unique field from `data`
      const selectQuery = `SELECT * FROM Work_Orders WHERE id = :id`;
      const [insertedRow] = await sequelize.query(selectQuery, {
        replacements: { id: insertedId },
        type: sequelize.QueryTypes.SELECT,
        transaction,
      });

      return insertedRow; // Return the newly inserted row
    } catch (error) {
      console.error("Error inserting raw query payload:", error);
      throw error;
    }
  }

  static async update(
    data,
    condition,
    transaction,
    dateTimeColumn = "updatedAt"
  ) {
    try {
      data[dateTimeColumn] = utils.currentDateTime();

      const setClause = Object.keys(data)
        .map((key) => `${key} = :${key}`)
        .join(", ");

      const whereClause = Object.keys(condition)
        .map((key) => `${key} = :${key}`)
        .join(" AND ");

      const query = `UPDATE Work_Orders SET ${setClause} WHERE ${whereClause}`;

      const result = await sequelize.query(query, {
        replacements: { ...data, ...condition },
        type: sequelize.QueryTypes.UPDATE,
        transaction,
      });

      const selectQuery = `SELECT * FROM Work_Orders WHERE ${whereClause}`;
      const [updatedRows] = await sequelize.query(selectQuery, {
        replacements: { ...condition },
        type: sequelize.QueryTypes.SELECT,
        transaction,
      });

      return updatedRows;
    } catch (error) {
      console.error("Error updating raw query payload:", error);
      throw error;
    }
  }
}

module.exports = WorkOrder;
