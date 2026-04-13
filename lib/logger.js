const util = require('util');
const fs = require('fs');
const Path = require('path');
const { chalk, color, bgcolor } = require('./color');


// Environment Variables Required:
//    - SAVE_LOGGER: Set to 'true' to enable logging to file, otherwise logs will only be printed to console
const SAVE_LOGGER = ['true', 'True'].includes(process.env.SAVE_LOGS);


// -------- Logger directory --------
let directory_log_name = "discord-logs";
let directory_log_path = Path.join(process.cwd(), directory_log_name);

if (SAVE_LOGGER && !fs.existsSync(directory_log_path)) {
    fs.mkdirSync(directory_log_path);
};

// -------- Logger Levels --------
const logLevels = {
    'info': { color: chalk.green, label: 'INFO' },
    'warn': { color: chalk.yellow, label: 'WARN' },
    'error': { color: chalk.red, label: 'ERROR' }
};

// --------- Logger Functionality --------
function loggerSetup(options = {}) {
    let timeDate = new Date().toISOString().split('T')[0];  // Format: YYYY-MM-DD
    let filename_log = `logger ${timeDate}.log`;    // Format: logger YYYY-MM-DD.log
    // options.logLevel = options.logLevel || 'info';
    options.logFilePath = options.logFilePath || Path.join(directory_log_path, filename_log);
    options.use_color = options.use_color || false;
    options.use_iso_date = options.use_iso_date || false;
    options.save_logger = options.save_logger || false;
    
    // Create a logger function that writes logs to a file and prints to console with optional color formatting
    let logger = function () {
        let log_ = util.format.apply(null, arguments, { color: options.use_color });
        log_ = options.use_iso_date ? `${color(`[${new Date().toISOString()}]:`, "magenta")} ${log_}` : log_;
        if (options.save_logger) {
            let fileStreamLogs = fs.createWriteStream(options.logFilePath, { flags: 'a' });
            let logForFile = log_.replace(/\x1b\[[0-9;]*m/g, '');   // Remove ANSI color codes for file logging
            fileStreamLogs.write(logForFile + "\n");    // Write a log as text.
        };
        process.stdout.write(log_ + "\n");          // Write a log as terminal.
    };
    return { logger };
};


// const logger = loggerSetup({
//     logLevel: 'info', // Possible values: 'info', 'warn', 'error'
//     use_color: true, // Enable colored output in console
//     use_iso_date: true // Use ISO date format for timestamps
//     save_logger: SAVE_LOGS // Enable saving logs to file based on environment variable,
// });


// Export the logger function
module.exports = {
    loggerSetup,
    logLevels
};