const { Model } = require("sequelize");
const sequelize = require("../../../config/database");
const utils = require("../../../helpers/utils");

class Supervisor extends Model {
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
          lendellp_losis_test.tbl_supervisor a
              JOIN
          lendellp_losis_test.supervisor_list b ON b.user_id = a.user_id`; // Raw SQL query

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
        query += `LIMIT ${limit} `;
      }

      // Execute the query
      const data = await sequelize.query(query, {
        replacements, // Safe parameter binding
        type: sequelize.QueryTypes.SELECT,
        transaction,
      });

      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }
}

module.exports = Supervisor;
