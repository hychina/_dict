var winston = require("winston");

var logfile = "/_dict/app.log";
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({filename: logfile})
  ]
});

module.exports = logger;
