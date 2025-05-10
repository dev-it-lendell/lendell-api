const { Model } = require("sequelize");
const sequelize = require("../../config/database");
const utils = require("../../helpers/utils");

class EquipmentsDetail extends Model {
  static async select(condition = {}, orderBy = null) {
    try {
      let query = `SELECT
        id,
        code,
        description,
        sequence,
        active,
        createdBy,
        updatedBy,
        createdAt,
        updatedAt,
        remarks
      FROM equipments_details
      `; // Raw SQL query

      const replacements = {};

      // Add conditions dynamically
      if (Object.keys(condition).length > 0) {
        query += " WHERE ";
        const clauses = [];
        for (const [key, value] of Object.entries(condition)) {
          clauses.push(`${key} = :${key}`); // Use named parameters
          replacements[key] = value; // Add value to replacements
        }
        query += clauses.join(" AND ");
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

      for (const list of data) {
        list.createdAt = utils.formatDate({
          date: list.createdAt,
        });
        list.updatedAt = utils.formatDate({
          date: list.updatedAt,
        });
        list.status = list.active === 1 ? "ACTIVE" : "INACTIVE";
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

      const query = `INSERT INTO equipments_details (${fields}) VALUES (${values})`;

      const result = await sequelize.query(query, {
        replacements: data,
        type: sequelize.QueryTypes.INSERT,
        transaction,
      });

      const insertedId = result[0]; // First element contains the inserted primary key (if available)

      // If `id` is available, use it; otherwise, use a unique field from `data`
      const selectQuery = `SELECT * FROM equipments_details WHERE id = :id`;
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

      const query = `UPDATE equipments_details SET ${setClause} WHERE ${whereClause}`;

      const result = await sequelize.query(query, {
        replacements: { ...data, ...condition },
        type: sequelize.QueryTypes.UPDATE,
        transaction,
      });

      const selectQuery = `SELECT * FROM equipments_details WHERE ${whereClause}`;
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

module.exports = EquipmentsDetail;
