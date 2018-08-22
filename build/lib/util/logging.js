"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const af_conditionals_1 = require("af-conditionals");
const task_timers_1 = require("./task-timers");
var LogSeverity;
(function (LogSeverity) {
    LogSeverity[LogSeverity["Emergency"] = 0] = "Emergency";
    LogSeverity[LogSeverity["Alert"] = 1] = "Alert";
    LogSeverity[LogSeverity["Critical"] = 2] = "Critical";
    LogSeverity[LogSeverity["Error"] = 3] = "Error";
    LogSeverity[LogSeverity["Warning"] = 4] = "Warning";
    LogSeverity[LogSeverity["Notice"] = 5] = "Notice";
    LogSeverity[LogSeverity["Informational"] = 6] = "Informational";
    LogSeverity[LogSeverity["Debug"] = 7] = "Debug";
})(LogSeverity = exports.LogSeverity || (exports.LogSeverity = {}));
exports.LOG_SEVERITY_COUNT = 8;
exports.LOG_SEVERITY_LOWEST_SEVERITY = LogSeverity.Debug;
class BaseLogger {
    constructor() {
        this._filteredMessages = 0;
        this._logSeverity = LogSeverity.Informational;
        this._messagesLogged = 0;
        this._muteLogger = false;
    }
    get filteredMessages() {
        return this._filteredMessages;
    }
    get severityLevel() {
        return this._logSeverity;
    }
    set severityLevel(newSeverityLevel) {
        this._logSeverity = newSeverityLevel;
    }
    get messagesLogged() {
        return this._messagesLogged;
    }
    get muteLogger() {
        return this._muteLogger;
    }
    set muteLogger(shouldMuteLogger) {
        this._muteLogger = shouldMuteLogger;
    }
    reset() {
        this._filteredMessages = 0;
        this._logSeverity = LogSeverity.Informational;
        this._messagesLogged = 0;
        this._muteLogger = false;
    }
    shouldFilterMessage(severity) {
        if (this.muteLogger || severity > this.severityLevel) {
            this._filteredMessages++;
            return true;
        }
        this._messagesLogged++;
        return false;
    }
}
exports.BaseLogger = BaseLogger;
class BrowserLogger extends BaseLogger {
    alert(message, ...params) {
        if (!this.shouldFilterMessage(LogSeverity.Alert)) {
            console.log(message, params);
        }
    }
    critical(message, ...params) {
        if (!this.shouldFilterMessage(LogSeverity.Critical)) {
            console.log(message, params);
        }
    }
    debug(message, ...params) {
        if (!this.shouldFilterMessage(LogSeverity.Debug)) {
            console.log(message, params);
        }
    }
    emergency(message, ...params) {
        if (!this.shouldFilterMessage(LogSeverity.Emergency)) {
            console.log(message, params);
        }
    }
    error(message, ...params) {
        if (!this.shouldFilterMessage(LogSeverity.Error)) {
            console.error(message, params);
        }
    }
    info(message, ...params) {
        if (!this.shouldFilterMessage(LogSeverity.Informational)) {
            console.info(message, params);
        }
    }
    log(message, ...params) {
        if (!this.shouldFilterMessage(LogSeverity.Informational)) {
            console.log(message, params);
        }
    }
    notice(message, ...params) {
        if (!this.shouldFilterMessage(LogSeverity.Notice)) {
            console.log(message, params);
        }
    }
    time(label) {
        if (af_conditionals_1.isFunction.test(console.time)) {
            console.time(label);
        }
        return label;
    }
    timeEnd(label) {
        if (af_conditionals_1.isFunction.test(console.timeEnd)) {
            console.timeEnd(label);
        }
        return 0;
    }
    warn(message, ...params) {
        if (!this.shouldFilterMessage(LogSeverity.Warning)) {
            if (af_conditionals_1.isFunction.test(console.warn)) {
                console.warn(message, params);
            }
            else {
                console.log(message, params);
            }
        }
    }
}
class NodeLogger extends BaseLogger {
    alert(message, ...params) {
        if (!this.shouldFilterMessage(LogSeverity.Alert)) {
            console.log(message, params);
        }
    }
    critical(message, ...params) {
        if (!this.shouldFilterMessage(LogSeverity.Critical)) {
            console.log(message, params);
        }
    }
    debug(message, ...params) {
        if (!this.shouldFilterMessage(LogSeverity.Debug)) {
            console.debug(message, params);
        }
    }
    emergency(message, ...params) {
        if (!this.shouldFilterMessage(LogSeverity.Emergency)) {
            console.log(message, params);
        }
    }
    error(message, ...params) {
        if (!this.shouldFilterMessage(LogSeverity.Error)) {
            console.error(message, params);
        }
    }
    info(message, ...params) {
        if (!this.shouldFilterMessage(LogSeverity.Informational)) {
            console.info(message, params);
        }
    }
    log(message, ...params) {
        if (!this.shouldFilterMessage(LogSeverity.Informational)) {
            console.log(message, params);
        }
    }
    notice(message, ...params) {
        if (!this.shouldFilterMessage(LogSeverity.Notice)) {
            console.log(message, params);
        }
    }
    time(label) {
        console.time(label);
        return label;
    }
    timeEnd(label) {
        console.timeEnd(label);
        return 0;
    }
    warn(message, ...params) {
        if (!this.shouldFilterMessage(LogSeverity.Warning)) {
            console.warn(message, params);
        }
    }
}
class Logger {
    constructor(newLogger, newTaskTimerManager = task_timers_1.defaultTimers) {
        this.logger = undefined;
        this.timerMgr = newTaskTimerManager;
        this.setLogger(newLogger);
    }
    setLogger(newLogger) {
        if (af_conditionals_1.isObject.test(newLogger)) {
            this.logger = newLogger;
        }
        else {
            if (!af_conditionals_1.isFunction.test(console.debug)) {
                this.logger = new BrowserLogger();
            }
            else {
                this.logger = new NodeLogger();
            }
        }
    }
    get filteredMessages() {
        return this.logger.filteredMessages;
    }
    get severityLevel() {
        return this.logger.severityLevel;
    }
    set severityLevel(newSeverityLevel) {
        this.logger.severityLevel = newSeverityLevel;
    }
    get messagesLogged() {
        return this.logger.messagesLogged;
    }
    get muteLogger() {
        return this.logger.muteLogger;
    }
    set muteLogger(shouldMuteLogger) {
        this.logger.muteLogger = shouldMuteLogger;
    }
    alert(message, ...params) {
        this.logger.alert(message, params);
    }
    critical(message, ...params) {
        this.logger.critical(message, params);
    }
    debug(message, ...params) {
        this.logger.debug(message, params);
    }
    emergency(message, ...params) {
        this.logger.emergency(message, params);
    }
    error(message, ...params) {
        this.logger.error(message, params);
    }
    info(message, ...params) {
        this.logger.info(message, params);
    }
    log(message, ...params) {
        this.logger.log(message, params);
    }
    notice(message, ...params) {
        this.logger.notice(message, params);
    }
    reset() {
        this.logger.reset();
    }
    time(label = "default") {
        const description = this.timerMgr.startTimer(label);
        return this.logger.time(description);
    }
    timeEnd(label = "default") {
        this.logger.timeEnd(label);
        return this.timerMgr.stopTimer(label);
    }
    warn(message, ...params) {
        this.logger.warn(message, params);
    }
}
exports.Logger = Logger;
exports.logger = new Logger();
//# sourceMappingURL=logging.js.map