export declare enum TaskStatus {
    initialized = 0,
    idle = 1,
    starting = 2,
    running = 3,
    pausing = 4,
    paused = 5,
    resuming = 6,
    stopping = 7,
    stopped = 8,
    complete = 9,
    blocked = 10,
    errored = 11,
    error = 12
}
export declare type TaskId = string;
export interface TaskData {
    taskId: TaskId;
    taskName: string;
    status: TaskStatus;
    start: number;
    stop: number;
    msDiff: number;
}
export declare class TaskTimer {
    protected data: TaskData;
    constructor(taskId: TaskId, taskName: string);
    stopTask(): number;
    status(): TaskData;
}
export declare class UniqueTaskId {
    static getTaskId(): TaskId;
}
export interface TaskTimerReport {
    taskCount: number;
    tasksActive: number;
    tasksTook: number;
    avgTaskTime: number;
}
export declare const DEFAULT_TASK_TIMER_MANAGER_NAME = "Default";
export declare class TaskTimerManager {
    protected name: string;
    protected tasks: {
        [propName: string]: TaskTimer;
    };
    protected taskCount: number;
    protected tasksActive: number;
    protected tasksTook: number;
    constructor(name?: string);
    getName(): string;
    startTimer(taskName: string): TaskId;
    stopTimer(taskId: TaskId): number;
    timerStatus(taskId: TaskId): TaskData | undefined;
    timerReport(): TaskTimerReport;
    toString(): string;
    protected getTaskId(): string;
}
export declare const defaultTimers: TaskTimerManager;
