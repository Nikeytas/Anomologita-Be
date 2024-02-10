const DB = {};
const Sequelize = require("sequelize");
const fs = require("fs");

// Azure Keyvault connection
// const { DefaultAzureCredential } = require("@azure/identity");
// const { SecretClient } = require("@azure/keyvault-secrets");
// const { initializeAzure } = require("../services/azure/azure");
// const credential = new DefaultAzureCredential();
let vault;

// if (process.env.NODE_ENV !== "local") {
//   try {
//     vault = new SecretClient(process.env.KEYVAULT_URI, credential);
//   } catch (err) {
//     throw err.message || err;
//   }
// }

//Setup sequelize config
const sequelizeConfig = {
  dialect: "mysql",
  host: process.env.NODE_ENV !== "local" ? "" : process.env.DB_HOST,
  port: process.env.DB_PORT,
  define: { timestamps: false },
  logging: process.env.NODE_ENV !== "production" ? console.log : false,
};
// Conditionally add SSL options for DEV, NPD and PRD environment to the config
if (process.env.NODE_ENV !== "local") {
  const sslCertificate = fs.readFileSync("DigiCertGlobalRootCA.crt.pem");
  sequelizeConfig.dialectOptions = {
    ssl: {
      ca: sslCertificate,
    },
  };
}
// Initiate the sequalize (username, password and host URL will be added afterwards via the KeyVault)
DB.sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.NODE_ENV !== "local" ? "" : process.env.DB_USER,
  process.env.NODE_ENV !== "local" ? "" : process.env.DB_PASS,
  sequelizeConfig
);
if (process.env.NODE_ENV !== "local") {
  DB.sequelize.beforeConnect(async (config) => {
    config.host = (await vault.getSecret("DBHOST")).value;
    config.username = (await vault.getSecret("DBUSER")).value;
    config.password = (await vault.getSecret("DBPASS")).value;
  });
}

//Models Loader
DB.Models = {
  // Anomologita
  anomologita: require("./models/anomologita/anomologita")(
    DB.sequelize,
    Sequelize
  ),
};

//Seeds Loader
DB.initSeeds = async () => {
  console.log("..DB Seed checking");
  for (const key in DB.Models) {
    if (Object.hasOwnProperty.call(DB.Models, key)) {
      const thisModel = DB.Models[key];
      if (thisModel.seedData) {
        await thisModel.seedData().catch((err) => {
          console.log(key);
          console.log(err);
          throw err.message || err;
        });
      }
    }
  }
};

//Models Ascosciator
DB.initAssociations = () => {
  for (const key in DB.Models) {
    if (Object.hasOwnProperty.call(DB.Models, key)) {
      if (DB.Models[key].associate) {
        DB.Models[key].associate(DB.Models);
      }
    }
  }
};

DB.initAssociations();

DB.syncModels = async (models) => {
  for (const model of models) {
    await model.sync({
      force: false,
      alter: true,
      logging: false,
    });
  }
};

//Init Function
DB.initDB = async () => {
  try {
    // await initializeAzure();
    var dbhost =
      process.env.NODE_ENV !== "local"
        ? (await vault.getSecret("DBHOST")).value
        : process.env.DB_HOST;
    var dbuser =
      process.env.NODE_ENV !== "local"
        ? (await vault.getSecret("DBUSER")).value
        : process.env.DB_USER;
    var dbpass =
      process.env.NODE_ENV !== "local"
        ? (await vault.getSecret("DBPASS")).value
        : process.env.DB_PASS;

    //Create DB if not exists
    const connectionOptions = {
      port: process.env.DB_PORT,
      host: dbhost,
      user: dbuser,
      password: dbpass,
    };

    const _conn = await require("mysql2").createConnectionPromise(
      connectionOptions
    );
    await _conn.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`
    );
    await _conn.end();

    //Sync DB
    console.log("..DB Syncing");

    await DB.sequelize.sync({
      alter: false,
      force: false,
      logging: false,
    });

    await DB.sequelize.authenticate({ logging: false });
    DB.isConnected = true;

    //Load Seeds
    //await DB.initSeeds();

    // await DB.syncModels([DB.Models.Campaigns, DB.Models.Checkups]);
  } catch (err) {
    throw err.message || err;
  }
};

DB.isConnected = false;
DB.connect = async () => {
  if (DB.isConnected) {
    console.log("=> Using existing connection.");
    return DB.Models;
  }
  await DB.initDB();
  console.log(`◉ Connected to DB ${process.env.DB_NAME}`);
  console.log(`=== RUNNING IN ${process.env.NODE_ENV} MODE ===`);
  return DB.Models;
};

DB.retry = async () => {
  var connRetries = 0;
  while (!DB.isConnected) {
    connRetries++;
    if (connRetries >= Number(process.env.DB_CONNECT_RETRY_LIMIT)) {
      console.error("[ERROR] Could not connect to the database. Server exits");
      process.exit(5);
    }
    // delay some seconds
    // and reconnect
    console.log(
      "..DB reconnecting in " + process.env.DB_CONNECT_RETRY / 1000 + " sec"
    );
    await new Promise((resolve) =>
      setTimeout(resolve, process.env.DB_CONNECT_RETRY)
    );
    await DB.connect().catch((err) => console.error(err.message || err));
  }
};

module.exports = DB;
