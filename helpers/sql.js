const utils = require("./utils");

const generateUniqueId = async (
  prefix,
  tableName,
  dateColumn,
  transaction,
  sequelize
) => {
  const randomNumbers = Math.floor(100000 + Math.random() * 900); // 6-digit random number
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  try {
    // Raw SQL query to count rows for the current day
    const query = `
      SELECT COUNT(*) AS count
      FROM ${tableName}
      WHERE DATE(${dateColumn}) = :today
    `;
    const replacements = { today }; // Safe parameter binding

    const data = await sequelize.query(query, {
      replacements,
      type: sequelize.QueryTypes.SELECT,
      transaction,
    });

    const currentCount = data[0].count || 0; // Get the count of rows for today

    // Incremental value for today
    const incremental = (currentCount + 1).toString().padStart(3, "0"); // Pad to 3 digits
    // Construct the unique ID
    return `${prefix}${today.replace(
      /\-/g,
      ""
    )}${randomNumbers}-${incremental}`;
  } catch (err) {
    console.error("Error generating unique ID:", err);
    throw new Error("Failed to generate unique ID");
  }
};

module.exports = {
  generateUniqueId,
};
