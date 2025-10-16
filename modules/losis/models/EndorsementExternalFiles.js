const { Model } = require("sequelize");
const sequelize = require("../../../config/database");
const utils = require("../../../helpers/utils");

class EndorsementExternalFiles extends Model {
  static async select(
    condition = {},
    customClauses = [],
    orderBy = null,
    limit = null,
    transaction = null
  ) {
    try {
      let query = `SELECT 
          *
      FROM
          lendellp_losis_test.tbl_endo_external_files`; // Raw SQL query

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
        query += ` ORDER BY ${orderBy} `;
      }

      if (limit) {
        query += `LIMIT ${limit}`;
      }

      // Execute the query
      const data = await sequelize.query(query, {
        replacements, // Safe parameter binding
        type: sequelize.QueryTypes.SELECT,
        transaction
      });

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

      const query = `INSERT INTO lendellp_losis_test.tbl_endo_external_files (${fields}) VALUES (${values})`;

      const result = await sequelize.query(query, {
        replacements: data,
        type: sequelize.QueryTypes.INSERT,
        transaction,
      });

      const insertedId = result[0]; // First element contains the inserted primary key (if available)

      // If `id` is available, use it; otherwise, use a unique field from `data`
      const selectQuery = `SELECT * FROM lendellp_losis_test.tbl_endo_external_files WHERE id = :id`;
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
    dateTimeColumn = "updated_at"
  ) {
    try {
      data[dateTimeColumn] = utils.currentDateTime();

      const setClause = Object.keys(data)
        .map((key) => `${key} = :${key}`)
        .join(", ");

      const whereClause = Object.keys(condition)
        .map((key) => `${key} = :${key}`)
        .join(" AND ");

      const query = `UPDATE lendellp_losis_test.tbl_endo_external_files SET ${setClause} WHERE ${whereClause}`;

      const result = await sequelize.query(query, {
        replacements: { ...data, ...condition },
        type: sequelize.QueryTypes.UPDATE,
        transaction,
      });

      const selectQuery = `SELECT * FROM lendellp_losis_test.tbl_endo_external_files WHERE ${whereClause}`;
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

module.exports = EndorsementExternalFiles;
