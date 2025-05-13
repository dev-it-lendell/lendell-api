const { createClient } = require("redis");

const __conns = {};

const addConn = async (name) => {
  if (!name) name = "default";

  process.stdout.write(`Connecting to "${name}" REDIS server... `);
  const client = createClient();
  await client.connect();
  __conns[name] = client;
  console.log("Redis Connected.");

  // TO DO: RECONNECT ON CONNECTION ERROR
  // UNTESTED CODE
  // client.on("error", async (err) => {
  //   process.stdout.write(`Error in ${name} redis connection. Reconnecting...`);
  //   await client.connect();
  //   console.log("Connected.");
  // });
};

const getConn = (name) => {
  return __conns[name || "default"];
};

module.exports = {
  addConn,
  getConn,
};
