const logger = require("../logger/winstonLogger").logger;
const loggingPolicy = require("../logger/loggingPolicy").loggingPolicy;
const sequelize = require("../database/DB").sequelize;
const paginator = require("../utils/paginator");
const { Anomologita } = require("../services/anomologita/anomologitaServices");

const createAnomologito = async (req, res) => {
  const apiName = "createAnomologita";
  try {
    logger.info(
      `Code: ${loggingPolicy.functionEnter.code}  ${apiName}  ${loggingPolicy.functionEnter.message}`
    );

    const anomologita = new Anomologita();

    const result = await sequelize.transaction(async (t) => {
      anomologita.setTransactionId(t);
      let result = await anomologita.createAnomologitaService(req.body);
      return result;
    });

    logger.info(
      `Code: ${loggingPolicy.successResponse.code},  ${apiName}  ${loggingPolicy.successResponse.message}`
    );
    res
      .status(200)
      .send({ message: "Anomologita created", anomologita: result });
  } catch (err) {
    logger.error(
      `Code: ${loggingPolicy.catchError.code},  ${apiName}  ${loggingPolicy.catchError.message}`
    );
    return res
      .status(400)
      .send({ message: "Sorry, something went wrong: " + err });
  }
};

const updateAnomologito = async (req, res) => {
  const apiName = "updateAnomologito";
  try {
    logger.info(
      `Code: ${loggingPolicy.functionEnter.code}  ${apiName}  ${loggingPolicy.functionEnter.message}`
    );

    const anomologita = new Anomologita();

    const result = await sequelize.transaction(async (t) => {
      anomologita.setTransactionId(t);
      let result = await anomologita.updateAnomologitoService(req.body);
      return result;
    });

    logger.info(
      `Code: ${loggingPolicy.successResponse.code},  ${apiName}  ${loggingPolicy.successResponse.message}`
    );
    res
      .status(200)
      .send({ message: "Anomologito updated", anomologita: result });
  } catch (err) {
    logger.error(
      `Code: ${loggingPolicy.catchError.code},  ${apiName}  ${loggingPolicy.catchError.message}`
    );
    return res
      .status(400)
      .send({ message: "Sorry, something went wrong: " + err });
  }
};

const getAllAnomologita = async (req, res) => {
  const apiName = "getAllAnomologita";
  try {
    logger.info(
      `Code: ${loggingPolicy.functionEnter.code}  ${apiName}  ${loggingPolicy.functionEnter.message}`
    );

    let pagination = paginator(["PK", "NAME"], "NAME", req.query);

    const anomologita = new Anomologita();

    const result = await sequelize.transaction(async (t) => {
      anomologita.setTransactionId(t);
      return await anomologita.getAllAnomologitaService(
        pagination.pagesize,
        pagination.offset,
        pagination.sort,
        pagination.searchString
      );
    });

    logger.info(
      `Code: ${loggingPolicy.successResponse.code},  ${apiName}  ${loggingPolicy.successResponse.message}`
    );
    res.status(200).send({ message: "All Anomologita retrieved", result });
  } catch (err) {
    logger.error(
      `Code: ${loggingPolicy.catchError.code},  ${apiName}  ${loggingPolicy.catchError.message}`
    );
    return res
      .status(400)
      .send({ message: "Sorry, something went wrong: " + err });
  }
};

const getAnomologita = async (req, res) => {
  const apiName = "getAnomologita";
  try {
    logger.info(
      `Code: ${loggingPolicy.functionEnter.code}  ${apiName}  ${loggingPolicy.functionEnter.message}`
    );

    // let pagination = paginator(["PK", "NAME"], "NAME", req.query);

    const anomologitaId = req.params.id;

    const anomologita = new Anomologita();

    const result = await sequelize.transaction(async (t) => {
      anomologita.setTransactionId(t);
      return await anomologita.getAnomologitaService(anomologitaId);
    });

    logger.info(
      `Code: ${loggingPolicy.successResponse.code},  ${apiName}  ${loggingPolicy.successResponse.message}`
    );
    res
      .status(200)
      .send({ message: "Anomologita retrieved", anomologita: result });
  } catch (err) {
    logger.error(
      `Code: ${loggingPolicy.catchError.code},  ${apiName}  ${loggingPolicy.catchError.message}`
    );
    return res
      .status(400)
      .send({ message: "Sorry, something went wrong: " + err });
  }
};

module.exports = {
  createAnomologito,
  updateAnomologito,
  getAllAnomologita,
  getAnomologita,
};
