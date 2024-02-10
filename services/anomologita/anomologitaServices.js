const Models = require("../../database/DB").Models;
const sequelize = require("../../database/DB").sequelize;
const Op = require("sequelize").Op;
const uuid = require("uuid").v4;
class Anomologita {
  anomologitaId = null;
  constructor(anomologitaId) {
    this.anomologitaId = anomologitaId;
  }

  setTransactionId(id) {
    this.transaction = id;
  }
  /**
   *
   * @param {Object} inp
   * ```ts
   * {
   *  name:string,
   *  profile_photo:string,
   *  fy_id:string,
   * }
   *
   * ```
   */
  create(inp) {}

  async createAnomologitaService(inp) {
    let anomologita = await Models.anomologita.create({
      PK: uuid(),
      TEXT: inp.TEXT,
    });

    return anomologita;
  }

  async updateAnomologitoService(inp) {
    try {
      // Prepare update object with only the fields that are present in the input
      const updateObject = {};
      if (inp.TEXT) updateObject.TEXT = inp.TEXT;
      if (inp.LIKE)
        updateObject.LIKES = sequelize.literal(`LIKES + ${inp.LIKE}`);
      if (inp.STATUS) updateObject.STATUS = inp.STATUS;

      // Perform the update with the prepared object
      let anomologita = await Models.anomologita.update(updateObject, {
        where: { PK: inp.anomologitoId },
      });

      return anomologita;
    } catch (error) {
      // Handle any errors
      console.error("Error updating anomologita:", error);
      throw error;
    }
  }

  async getAllAnomologitaService(pageSize, offset, sort, searchString) {
    let whereOptions = {
      ...(!!searchString && { name: { [Op.like]: `%${searchString}%` } }),
    };

    return await Models.anomologita.findAndCountAll({
      // attributes: ["PK", "EMAIL"],
      where: whereOptions,
      limit: pageSize,
      offset: offset,
      order: sort,
      logging: false,
    });
  }

  async getAnomologitaService(id) {
    let whereOptions = {
      PK: id,
    };

    return await Models.anomologita.findOne({
      where: whereOptions,
      logging: false,
    });
  }
}
module.exports = { Anomologita };
