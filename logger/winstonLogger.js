const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

const logFormat = format.combine(
    format.prettyPrint(),
    format.timestamp(),
    format.align(),
    format.printf(({ level, message, timestamp }) => {
        return `${timestamp} [${level}] : ${message}`;
    }),
);
// var date = new Date();
// var y = date.getFullYear;
// var m = date.getMonth;
// var d = date.getDay;
// create the logger system based on winston module
const logger = createLogger({
    // use different transporters to add different ways of log handling
    transports: [
        // use Files based on the an hourly timestamp to write logs 
        new transports.DailyRotateFile({
            format: logFormat,
            timestamp: true,
            filename: './logs/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxFiles: '7d' // delete log files after 7 days
        })
    ]
})
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
      format: format.simple(),
    }));
  }
module.exports = {
    logger
}