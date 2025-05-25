const utils = require("./utils");
const sequelize = require("../config/database");

const generateUniqueCode = async (
  tableName,
  prefix,
  surrogateCode = "code",
  max = 10000000,
  min = 99999999,
  transaction
) => {
  let code = "";
  let codeExists = true;

  const randomNumbers = Math.floor(Math.random() * (max - min + 1)) + min; // 8-digit random number

  while (codeExists) {
    code = `${prefix}-${randomNumbers}`;
    try {
      const query = `
      SELECT COUNT(${surrogateCode}) AS count
        FROM ${tableName}
        WHERE ${surrogateCode} = :code
      `;
      const replacements = { code }; // Safe parameter binding

      const data = await sequelize.query(query, {
        replacements,
        type: sequelize.QueryTypes.SELECT,
        transaction,
      });

      const codeCount = data;
      codeExists = Boolean(codeCount.count);
    } catch (error) {
      console.log(error);
      return { success: false, message: error };
    }
  }
  return code;
};

module.exports = {
  generateUniqueCode,
};
