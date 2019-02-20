/**
 * TaskTimers module
 *
 * Utility classes for timing tasks.
 *
 * @author Mike Coakley <mcoakley@acmeframework.com>
 */
import { assert_isUsable } from 'af-conditionals';
import * as uuid from 'uuid';

import { logger } from '.';

export enum TaskStatus {
    initialized,
    idle,
    starting,
    running,
    pausing,
    paused,
    resuming,
    stopping,
    stopped,
    complete,
    blocked,
    errored,
    error
}

export type TaskId = string;

export interface TaskData {
    taskId: TaskId;
    taskName: string;
    status: TaskStatus;
    start: number;
    stop: number;
    msDiff: number;
}

export class TaskTimer {

    protected data: TaskData;

    constructor(taskId: TaskId, taskName: string) {
        assert_isUsable(taskId);
        assert_isUsable(taskName);
        this.data = {
            msDiff: 0,
            start: Date.now(),
            status: TaskStatus.initialized,
            stop: 0,
            taskId,
            taskName
        };
        this.data.status = TaskStatus.running;
        logger.info('TaskTimer: starting ' + this.data.taskName +
            ' (id: ' + this.data.taskId + ')', this.data);
    }

    public stopTask(): number {
        this.data.status = TaskStatus.stopping;
        logger.info('TaskTimer: stopping ' + this.data.taskName +
            ' (id: ' + this.data.taskId + ')', this.data);
        this.data.stop = Date.now();
        this.data.status = TaskStatus.stopped;
        this.data.msDiff = this.data.stop - this.data.start;
        logger.info('TaskTimer: stopped ' + this.data.taskName +
            ' (id: ' + this.data.taskId + ') took ' +
            this.data.msDiff + 'ms', this.data);
        return this.data.msDiff;
    }

    public status(): TaskData {
        return this.data;
    }
}

export class UniqueTaskId {

    public static getTaskId(): TaskId {
        return uuid.v1();
    }
}

export interface TaskTimerReport {
    taskCount: number;
    tasksActive: number;
    tasksTook: number;
    avgTaskTime: number;
}

export const DEFAULT_TASK_TIMER_MANAGER_NAME = 'Default';

export class TaskTimerManager {

    protected tasks: {
        [propName: string]: TaskTimer;
    } = {};

    protected taskCount = 0;
    protected tasksActive = 0;
    protected tasksTook = 0;

    constructor(protected name = DEFAULT_TASK_TIMER_MANAGER_NAME) { }

    public getName(): string {
        return this.name;
    }

    public startTimer(taskName: string): TaskId {
        const taskId = this.getTaskId();
        this.tasks[taskId] = new TaskTimer(taskId, taskName);
        this.taskCount++;
        this.tasksActive++;
        return taskId;
    }

    public stopTimer(taskId: TaskId): number {
        try {
            const tStop: number = this.tasks[taskId].stopTask();
            this.tasksTook += tStop;
            delete (this.tasks[taskId]);
            this.tasksActive--;
            return tStop;
        } catch (err) {
            logger.error(err.message, err);
            return -1;
        }
    }

    public timerStatus(taskId: TaskId): TaskData | undefined {
        try {
            return this.tasks[taskId].status();
        } catch (err) {
            logger.error(err.message, err);
            return undefined;
        }
    }

    public timerReport(): TaskTimerReport {
        return {
            avgTaskTime: this.tasksTook / this.taskCount,
            taskCount: this.taskCount,
            tasksActive: this.tasksActive,
            tasksTook: this.tasksTook
        };
    }

    public toString(): string {
        const ttr = this.timerReport();
        return `${this.name}: Total #: ${ttr.taskCount} / ` +
            `Total Time: ${ttr.tasksTook} / ` +
            `Average Time: ${ttr.avgTaskTime} / ` +
            `Active Tasks: ${ttr.tasksActive}`;
    }

    protected getTaskId(): string {
        return UniqueTaskId.getTaskId();
    }
}

export const defaultTimers = new TaskTimerManager();
