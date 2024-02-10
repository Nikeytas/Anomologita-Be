const successQuery = {
  code: "HTTP200",
  message: "Successful query",
};

const successResponse = {
  code: "HTTP200",
  message: "Successful response",
};

const failDatabaseConnection = {
  code: "HTTP500",
  message: "Error Connecting with Database",
};

const missingParameters = {
  code: "HTTP400",
  message: "Not correct body",
};

const catchError = {
  code: "HTTP400",
  message: "Catch error",
};

const notFound = {
  code: "HTTP404",
  message: "Not found",
};

const usernameNotFound = {
  code: "HTTP404",
  message: "Username not found",
};

const functionEnter = {
  code: "F100",
  message: "Function Called",
};

const functionExit = {
  code: "F200",
  message: "Function Finished",
};

const addWhereClause = {
  code: "F301",
  message: "A where clause added",
};

const unauthorized = {
  code: "HTTP401",
  message: "Unauthorized user",
};

const queryBuilding = {
  code: "F300",
  message: "Start building the query",
};

const formattingData = {
  code: "F102",
  message: "Start building Data to the correct format",
};

const loggingPolicy = {
  successQuery,
  successResponse,
  catchError,
  unauthorized,
  usernameNotFound,
  failDatabaseConnection,
  missingParameters,
  functionEnter,
  functionExit,
  addWhereClause,
  queryBuilding,
  formattingData,
  notFound,
};

module.exports = {
  loggingPolicy,
};
