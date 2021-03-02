/**
 * Logging module
 *
 * This logging module supplies a common method for logging information
 * throughout an application. This is an opinionated module in that it
 * not only provides logging but methods to start/stop tasks with
 * timers - timers provided by the task-timers module.
 *
 * @author Mike Coakley https://github.com/mcoakley
 */
import { isFunction, isObject } from 'af-conditionals';

import { defaultTimers, TaskTimerManager } from './task-timers';

/*
 * TODO: Look into ability to use the console grouping mechanisms to
 *       automatically indent logs as items are being timed.
 * TODO: Ensure all modules in this library use Logger and time/timeEnd
 *       to perform their timing tasks
 * TODO: Add options to Logger to allow events to be emitted for any
 *       logging that happens
 * TODO: Along the lines of emitting events, add ability to filter and notify
 *       based upon "event" that are triggered by items being logged
 */

/**
 * Provide a consistent interface for Logging. Mirrors logging methods found
 * in both the Node and Browser logging environments.
 *
 * @export
 * @interface LogDriver
 */
export interface LogDriver {
  filteredMessages: number;
  severityLevel: LogSeverity;
  messagesLogged: number;
  muteLogger: boolean;

  alert(message: string, ...params: any[]): void;
  critical(message: string, ...params: any[]): void;
  debug(message: string, ...params: any[]): void;
  emergency(message: string, ...params: any[]): void;
  error(message: string, ...params: any[]): void;
  info(message: string, ...params: any[]): void;
  log(message: string, ...params: any[]): void;
  notice(message: string, ...params: any[]): void;
  reset(): void;
  time(label?: string): string;
  timeEnd(label?: string): number;
  warn(message: string, ...params: any[]): void;
}

/**
 * Enum of defined logging severities.
 *
 * @export
 * @enum {number}
 */
export enum LogSeverity {
  Emergency,
  Alert,
  Critical,
  Error,
  Warning,
  Notice,
  Informational,
  Debug,
}

// This MUST ALWAYS = the # of severity types in the LogSeverity Enum
// NOTE: Since the LogSeverity Enum is numeric based the expression:
//       Object.keys(LogSeverity).length / 2 should be equal to this #
//       This is checked in the Test Suite to ensure this number is
//       accurately set.
export const LOG_SEVERITY_COUNT = 8;
// This MUST ALWAYS = the lowest severity level (or the severity level with
// the highest value). This is checked in the Test Suite to ensure this
// value is accurately set.
export const LOG_SEVERITY_LOWEST_SEVERITY = LogSeverity.Debug;

/**
 * The `BaseLogger` class provides the basic functionality that all loggers
 * use. This class provides functionality to filter the logging of messages
 * based upon their severity level and provide statistics on messages
 * logged and messages filtered.
 *
 * @export
 * @class BaseLogger
 */
export class BaseLogger {
  private _filteredMessages = 0;
  private _logSeverity = LogSeverity.Informational;
  private _messagesLogged = 0;
  private _muteLogger = false;

  /**
   * Get the number of messages that have been filtered since the instance
   * of this logger has been created.
   *
   * @readonly
   * @memberof BaseLogger
   */
  public get filteredMessages(): number {
    return this._filteredMessages;
  }

  /**
   * Get the current severity level of this instance of the logger.
   *
   * @memberof BaseLogger
   */
  public get severityLevel(): LogSeverity {
    return this._logSeverity;
  }

  public set severityLevel(newSeverityLevel: LogSeverity) {
    this._logSeverity = newSeverityLevel;
  }

  public get messagesLogged(): number {
    return this._messagesLogged;
  }

  public get muteLogger(): boolean {
    return this._muteLogger;
  }

  public set muteLogger(shouldMuteLogger: boolean) {
    this._muteLogger = shouldMuteLogger;
  }

  public reset(): void {
    this._filteredMessages = 0;
    this._logSeverity = LogSeverity.Informational;
    this._messagesLogged = 0;
    this._muteLogger = false;
  }

  protected shouldFilterMessage(severity: LogSeverity): boolean {
    if (this.muteLogger || severity > this.severityLevel) {
      this._filteredMessages++;
      return true;
    }
    this._messagesLogged++;
    return false;
  }
}

function _callLogMethod(
  logInstance: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  method: string,
  message: string,
  ...params: any[]
): void {
  // Rest parameters always introduce an Array into the variable scope, even
  // an empty array. The methods that were directly calling the logging
  // methods of console weren't taking this into account. We perform a check
  // here to ensure we do not pass an empty Array to console. Since we are
  // nesting this call we must dereference the params Array to get to the
  // actual parameters.
  const origParams: any[] = params[0]; // eslint-disable-line @typescript-eslint/no-explicit-any

  if (origParams.length > 0) {
    logInstance[method](message, origParams);
  } else {
    logInstance[method](message);
  }
}

export class BrowserLogger extends BaseLogger implements LogDriver {
  public alert(message: string, ...params: any[]): void {
    if (!this.shouldFilterMessage(LogSeverity.Alert)) {
      _callLogMethod(console, 'log', message, params);
    }
  }

  public critical(message: string, ...params: any[]): void {
    if (!this.shouldFilterMessage(LogSeverity.Critical)) {
      _callLogMethod(console, 'log', message, params);
    }
  }

  public debug(message: string, ...params: any[]): void {
    if (!this.shouldFilterMessage(LogSeverity.Debug)) {
      _callLogMethod(console, 'log', message, params);
    }
  }

  public emergency(message: string, ...params: any[]): void {
    if (!this.shouldFilterMessage(LogSeverity.Emergency)) {
      _callLogMethod(console, 'log', message, params);
    }
  }

  public error(message: string, ...params: any[]): void {
    if (!this.shouldFilterMessage(LogSeverity.Error)) {
      _callLogMethod(console, 'error', message, params);
    }
  }

  public info(message: string, ...params: any[]): void {
    if (!this.shouldFilterMessage(LogSeverity.Informational)) {
      _callLogMethod(console, 'info', message, params);
    }
  }

  public log(message: string, ...params: any[]): void {
    if (!this.shouldFilterMessage(LogSeverity.Informational)) {
      _callLogMethod(console, 'log', message, params);
    }
  }

  public notice(message: string, ...params: any[]): void {
    if (!this.shouldFilterMessage(LogSeverity.Notice)) {
      _callLogMethod(console, 'log', message, params);
    }
  }

  public time(label: string): string {
    if (isFunction(console.time)) {
      console.time(label);
    }
    return label;
  }

  public timeEnd(label: string): number {
    if (isFunction(console.timeEnd)) {
      console.timeEnd(label);
    }
    return 0;
  }

  public warn(message: string, ...params: any[]): void {
    if (!this.shouldFilterMessage(LogSeverity.Warning)) {
      if (isFunction(console.warn)) {
        _callLogMethod(console, 'warn', message, params);
      } else {
        _callLogMethod(console, 'log', message, params);
      }
    }
  }
}

export class NodeLogger extends BaseLogger implements LogDriver {
  public alert(message: string, ...params: any[]): void {
    if (!this.shouldFilterMessage(LogSeverity.Alert)) {
      _callLogMethod(console, 'log', message, params);
    }
  }

  public critical(message: string, ...params: any[]): void {
    if (!this.shouldFilterMessage(LogSeverity.Critical)) {
      _callLogMethod(console, 'log', message, params);
    }
  }

  public debug(message: string, ...params: any[]): void {
    if (!this.shouldFilterMessage(LogSeverity.Debug)) {
      _callLogMethod(console, 'debug', message, params);
    }
  }

  public emergency(message: string, ...params: any[]): void {
    if (!this.shouldFilterMessage(LogSeverity.Emergency)) {
      _callLogMethod(console, 'log', message, params);
    }
  }

  public error(message: string, ...params: any[]): void {
    if (!this.shouldFilterMessage(LogSeverity.Error)) {
      _callLogMethod(console, 'error', message, params);
    }
  }

  public info(message: string, ...params: any[]): void {
    if (!this.shouldFilterMessage(LogSeverity.Informational)) {
      _callLogMethod(console, 'info', message, params);
    }
  }

  public log(message: string, ...params: any[]): void {
    if (!this.shouldFilterMessage(LogSeverity.Informational)) {
      _callLogMethod(console, 'log', message, params);
    }
  }

  public notice(message: string, ...params: any[]): void {
    if (!this.shouldFilterMessage(LogSeverity.Notice)) {
      _callLogMethod(console, 'log', message, params);
    }
  }

  public time(label: string): string {
    console.time(label);
    return label;
  }

  public timeEnd(label: string): number {
    console.timeEnd(label);
    return 0;
  }

  public warn(message: string, ...params: any[]): void {
    if (!this.shouldFilterMessage(LogSeverity.Warning)) {
      _callLogMethod(console, 'warn', message, params);
    }
  }
}

// If the following class the logger property will always be set to a
// known value through setLogger which is called in the constructor. This means
// we can reliably ignore the ESlint warning about non-null assertions.

/* eslint-disable @typescript-eslint/no-non-null-assertion */
export class Logger implements LogDriver {
  protected logger: LogDriver | undefined = undefined;
  protected timerMgr: TaskTimerManager;

  constructor(newLogger?: LogDriver, newTaskTimerManager = defaultTimers) {
    this.timerMgr = newTaskTimerManager;
    this.setLogger(newLogger);
  }

  public setLogger(newLogger?: LogDriver): void {
    if (isObject(newLogger)) {
      this.logger = newLogger;
    } else {
      // This simple test was taken from StackOverflow
      // https://stackoverflow.com/a/31090240/7102037
      const isBrowser = new Function(
        'try {return this===window;}catch(e){return false;}'
      );
      /* istanbul ignore if */
      if (isBrowser()) {
        this.logger = new BrowserLogger();
      } else {
        this.logger = new NodeLogger();
      }
    }
  }

  public get filteredMessages(): number {
    return this.logger!.filteredMessages;
  }

  public get severityLevel(): LogSeverity {
    return this.logger!.severityLevel;
  }

  public set severityLevel(newSeverityLevel: LogSeverity) {
    this.logger!.severityLevel = newSeverityLevel;
  }

  public get messagesLogged(): number {
    return this.logger!.messagesLogged;
  }

  public get muteLogger(): boolean {
    return this.logger!.muteLogger;
  }

  public set muteLogger(shouldMuteLogger: boolean) {
    this.logger!.muteLogger = shouldMuteLogger;
  }

  public alert(message: string, ...params: any[]): void {
    _callLogMethod(this.logger!, 'alert', message, params);
  }

  public critical(message: string, ...params: any[]): void {
    _callLogMethod(this.logger!, 'critical', message, params);
  }

  public debug(message: string, ...params: any[]): void {
    _callLogMethod(this.logger!, 'debug', message, params);
  }

  public emergency(message: string, ...params: any[]): void {
    _callLogMethod(this.logger!, 'emergency', message, params);
  }

  public error(message: string, ...params: any[]): void {
    _callLogMethod(this.logger!, 'error', message, params);
  }

  public info(message: string, ...params: any[]): void {
    _callLogMethod(this.logger!, 'info', message, params);
  }

  public log(message: string, ...params: any[]): void {
    _callLogMethod(this.logger!, 'log', message, params);
  }

  public notice(message: string, ...params: any[]): void {
    _callLogMethod(this.logger!, 'notice', message, params);
  }

  public reset(): void {
    this.logger!.reset();
  }

  public time(label = 'default'): string {
    const description = this.timerMgr.startTimer(label);
    return this.logger!.time(description);
  }

  public timeEnd(label = 'default'): number {
    this.logger!.timeEnd(label);
    return this.timerMgr.stopTimer(label);
  }

  public warn(message: string, ...params: any[]): void {
    _callLogMethod(this.logger!, 'warn', message, params);
  }
}
/* eslint-enable @typescript-eslint/no-non-null-assertion */

export let logger = new Logger(); // eslint-disable-line prefer-const
