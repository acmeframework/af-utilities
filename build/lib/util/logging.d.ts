import { TaskTimerManager } from "./task-timers";
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
export declare enum LogSeverity {
    Emergency = 0,
    Alert = 1,
    Critical = 2,
    Error = 3,
    Warning = 4,
    Notice = 5,
    Informational = 6,
    Debug = 7
}
export declare const LOG_SEVERITY_COUNT = 8;
export declare const LOG_SEVERITY_LOWEST_SEVERITY: LogSeverity;
export declare class BaseLogger {
    private _filteredMessages;
    private _logSeverity;
    private _messagesLogged;
    private _muteLogger;
    readonly filteredMessages: number;
    severityLevel: LogSeverity;
    readonly messagesLogged: number;
    muteLogger: boolean;
    reset(): void;
    protected shouldFilterMessage(severity: LogSeverity): boolean;
}
export declare class Logger implements LogDriver {
    protected logger: LogDriver | undefined;
    protected timerMgr: TaskTimerManager;
    constructor(newLogger?: LogDriver, newTaskTimerManager?: TaskTimerManager);
    setLogger(newLogger?: LogDriver): void;
    readonly filteredMessages: number;
    severityLevel: LogSeverity;
    readonly messagesLogged: number;
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
export declare let logger: Logger;
