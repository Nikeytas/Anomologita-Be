const fs = require("fs");
const path = require("path");
const csv = require("@fast-csv/parse");

const parseCSV = (path) => {
  return new Promise((resolve, reject) => {
    const data = [];
    csv
      .parseFile(path, { headers: true })
      .on("error", (error) => reject(error))
      .on("data", (row) => {
        Object.entries(row).forEach(([key, value]) => {
          if (value === "") delete row[key];
        });
        data.push(row);
      })
      .on("end", () => resolve(data));
  });
};

module.exports = async (tableName) => {
  try {
    const seedPath = path.join(__dirname, "../data");
    const jsSeedFile = path.join(seedPath, tableName + ".js");

    var seedData = [];
    if (fs.existsSync(jsSeedFile)) {
      seedData = require(jsSeedFile);
    }

    const csvSeedFile = path.join(seedPath, "seeders", tableName + ".csv");
    if (fs.existsSync(csvSeedFile)) {
      seedData = await parseCSV(csvSeedFile);
    }
    return seedData;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};
