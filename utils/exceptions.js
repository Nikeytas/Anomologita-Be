class AuthorizationError {
  status = 403;
  type = "AuthorizationError";
  message = "Sorry, you do not have the necessary permissions.";
}

class BadRequestError {
  status = 400;
  type = "BadRequestError";
  message = "Sorry, something went wrong.";
}

class UnprocessableError {
  status = 422;
  type = "UnprocessableError";
  message = "Sorry, something went wrong.";
}

class InternalServerError {
  status = 500;
  type = "InternalServerError";
  message = "We are sorry, the server has encountered an error.";

  constructor(message) {
    this.message = message;
  }
}

class UnassignedAccount extends InternalServerError {
  type = "UnassignedAccount";
}

class InvalidOptionError extends BadRequestError {
  type = "InvalidOptionError";
  constructor(optionType, validOptions) {
    super();
    this.message = `The ${optionType} provided is not valid. The valid ${optionType} are [${validOptions}]`;
  }
}

class NoIDError extends BadRequestError {
  type = "NoIDError";

  constructor(resource) {
    super();
    this.message = `You have to specify the ID of the ${resource}.`;
  }
}

class IDDoesNotExistError extends BadRequestError {
  type = "IDDoesNotExistError";
  status = 404;

  constructor(resource, id) {
    super();
    this.message = `The specified ${resource} do not exist.`;
    this.id = id;
  }
}

class BadBodyError extends BadRequestError {
  type = "BadBodyError";

  constructor(fields) {
    super();
    this.message = `The expected properties in the request's body are ${fields}.`;
  }
}

module.exports = {
  AuthorizationError,
  BadBodyError,
  BadRequestError,
  IDDoesNotExistError,
  InternalServerError,
  InvalidOptionError,
  NoIDError,
  UnassignedAccount,
};
