const { Model } = require("sequelize");
const sequelize = require("../../config/database");
const utils = require("../../helpers/utils");

class Equipment extends Model {
  static async select(condition = {}) {
    try {
      let query = `SELECT
        a.id,
        a.code,
        a.serialNumber,
        a.propertyCode,
        a.name,
        a.brand,
        a.model,
        a.description,
        a.type,
        a.supplierCode,
        c.name supplierName,
        a.departmentCode,
        b.name departmentName,
        a.warrantyPeriod,
        a.active,
        a.createdBy,
        a.updatedBy,
        a.createdAt,
        a.updatedAt,
        a.remarks
      FROM equipments a
      join departments b on b.code = a.departmentCode
      join suppliers c on c.code = a.supplierCode
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
        list.createdAt = utils.formatDate({
          date: list.createdAt,
        });
        list.updatedAt = utils.formatDate({
          date: list.updatedAt,
        });

        list.warrantyPeriod = utils.formatDate({
          date: list.warrantyPeriod,
          dateOnly: true,
        });

        list.status =
          list.active === 1
            ? "ACTIVE"
            : list.active === 2
            ? "FOR REPAIR"
            : "INACTIVE";
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

      const query = `INSERT INTO equipments (${fields}) VALUES (${values})`;

      const result = await sequelize.query(query, {
        replacements: data,
        type: sequelize.QueryTypes.INSERT,
        transaction,
      });

      const insertedId = result[0]; // First element contains the inserted primary key (if available)

      // If `id` is available, use it; otherwise, use a unique field from `data`
      const selectQuery = `SELECT * FROM equipments WHERE id = :id`;
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

      const query = `UPDATE equipments SET ${setClause} WHERE ${whereClause}`;

      const result = await sequelize.query(query, {
        replacements: { ...data, ...condition },
        type: sequelize.QueryTypes.UPDATE,
        transaction,
      });

      const selectQuery = `SELECT * FROM equipments WHERE ${whereClause}`;
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

module.exports = Equipment;
