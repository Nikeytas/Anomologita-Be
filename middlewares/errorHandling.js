const exceptions = require("../utils/exceptions");

function handleDefaultError(err, req, res, next) {
  let response = {};
  switch (err.constructor) {
    case exceptions.IDDoesNotExistError:
      response.id = err.id;
      break;
  }
  return res.status(err.status || 500).send({
    errorType: err.type,
    message: err.message,
    ...response,
  });
}

module.exports = {
  handleDefaultError,
};
