const importSeeds = require("../../utils/importSeeds");

module.exports = (sequelize, Sequelize) => {
  const tableName = "ANOMOLOGITA";
  const anomologita = sequelize.define(
    tableName,
    {
      PK: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      TEXT: {
        type: Sequelize.STRING,
      },
      LIKES: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      STATUS: {
        type: Sequelize.ENUM("Accepted", "Pending", "Rejected"),
        defaultValue: "Pending",
      },
      CREATED_AT: {
        type: Sequelize.DATE,
        defaultValue: sequelize.literal("NOW()"),
      },
      UPDATED_AT: {
        type: Sequelize.DATE,
        defaultValue: sequelize.literal("NOW()"),
      },
      // LAST_MODIFIED_BY: {
      //   type: Sequelize.STRING,
      //   defaultValue: "Unknown user",
      // },
    },
    {
      freezeTableName: true,
      tableName: tableName,
      hooks: {
        beforeBulkUpdate: function (options) {
          options.individualHooks = true;
        },
        beforeUpdate(obj, options) {
          obj.UPDATED_AT = new Date().toISOString();
        },
      },
    }
  );

  // seeders

  // anomologita.seedData = async () => {
  //   const seedData = await importSeeds("anomologita.seed");
  //   const proms = [];
  //   for (const s of seedData) {
  //     proms.push(anomologita.create(s));
  //   }
  //   await Promise.all(proms);
  // };

  anomologita.associate = (Models) => {};

  return anomologita;
};
