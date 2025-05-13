const { Model } = require("sequelize");
const sequelize = require("../../../config/database");
const utils = require("../../../helpers/utils");

class User extends Model {
  static ROLE_NAMES = {
    1: "ADMIN",
    2: "STANDARD USER",
  };

  static async select(condition = {}) {
    try {
      let query = `SELECT
        id,
        username,
        password,
        lastName,
        firstName,
        middleName,
        suffix,
        CONCAT(
              TRIM(lastName), ', ',    
              TRIM(firstName),      
              IF(middleName != '', CONCAT(' ', TRIM(middleName)), ''),
              IF(suffix != '', CONCAT(' ', TRIM(suffix)), '') 
        ) AS name,
        role,
        active,
        initialLogin,
        createdBy,
        updatedBy,
        createdAt,
        updatedAt,
        remarks
      FROM users
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

      // Execute the query
      const data = await sequelize.query(query, {
        replacements, // Safe parameter binding
        type: sequelize.QueryTypes.SELECT,
      });

      for (const list of data) {
        list.role = this.ROLE_NAMES[list.role];
        list.status = list.active === 1 ? "ACTIVE" : "INACTIVE";
        list.createdAt = utils.formatDate({ date: list.createdAt });
        list.updatedAt = utils.formatDate({ date: list.updatedAt });
      }

      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  static async insert(data, transaction) {
    try {
      // Check if the username already exists
      const checkQuery = `SELECT * FROM users WHERE username = :username`;
      const [existingUser] = await sequelize.query(checkQuery, {
        replacements: { username: data.username },
        type: sequelize.QueryTypes.SELECT,
      });

      if (existingUser) {
        throw new Error(`Username '${data.username}' already exists.`);
      }

      const fields = Object.keys(data).join(", ");
      const values = Object.keys(data)
        .map((key) => `:${key}`)
        .join(", ");

      const query = `INSERT INTO users (${fields}) VALUES (${values})`;

      const result = await sequelize.query(query, {
        replacements: data,
        type: sequelize.QueryTypes.INSERT,
        transaction,
      });

      const insertedId = result[0]; // First element contains the inserted primary key (if available)

      // If `id` is available, use it; otherwise, use a unique field from `data`
      const selectQuery = `SELECT * FROM users WHERE id = :id`;
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

      const query = `UPDATE 
        users SET ${setClause} 
      WHERE ${whereClause}`;

      await sequelize.query(query, {
        replacements: { ...data, ...condition },
        type: sequelize.QueryTypes.UPDATE,
        transaction,
      });

      const selectQuery = `SELECT * FROM users WHERE ${whereClause}`;
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

module.exports = User;
