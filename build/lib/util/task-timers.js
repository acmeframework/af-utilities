"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = __importStar(require("uuid"));
const is_usable_1 = require("af-conditionals/build/lib/conditionals/is-usable");
const _1 = require(".");
var TaskStatus;
(function (TaskStatus) {
    TaskStatus[TaskStatus["initialized"] = 0] = "initialized";
    TaskStatus[TaskStatus["idle"] = 1] = "idle";
    TaskStatus[TaskStatus["starting"] = 2] = "starting";
    TaskStatus[TaskStatus["running"] = 3] = "running";
    TaskStatus[TaskStatus["pausing"] = 4] = "pausing";
    TaskStatus[TaskStatus["paused"] = 5] = "paused";
    TaskStatus[TaskStatus["resuming"] = 6] = "resuming";
    TaskStatus[TaskStatus["stopping"] = 7] = "stopping";
    TaskStatus[TaskStatus["stopped"] = 8] = "stopped";
    TaskStatus[TaskStatus["complete"] = 9] = "complete";
    TaskStatus[TaskStatus["blocked"] = 10] = "blocked";
    TaskStatus[TaskStatus["errored"] = 11] = "errored";
    TaskStatus[TaskStatus["error"] = 12] = "error";
})(TaskStatus = exports.TaskStatus || (exports.TaskStatus = {}));
class TaskTimer {
    constructor(taskId, taskName) {
        is_usable_1.isUsable.assert(taskId);
        is_usable_1.isUsable.assert(taskName);
        this.data = {
            msDiff: 0,
            start: Date.now(),
            status: TaskStatus.initialized,
            stop: 0,
            taskId,
            taskName
        };
        this.data.status = TaskStatus.running;
        _1.logger.info("TaskTimer: starting " + this.data.taskName +
            " (id: " + this.data.taskId + ")", this.data);
    }
    stopTask() {
        this.data.status = TaskStatus.stopping;
        _1.logger.info("TaskTimer: stopping " + this.data.taskName +
            " (id: " + this.data.taskId + ")", this.data);
        this.data.stop = Date.now();
        this.data.status = TaskStatus.stopped;
        this.data.msDiff = this.data.stop - this.data.start;
        _1.logger.info("TaskTimer: stopped " + this.data.taskName +
            " (id: " + this.data.taskId + ") took " +
            this.data.msDiff + "ms", this.data);
        return this.data.msDiff;
    }
    status() {
        return this.data;
    }
}
exports.TaskTimer = TaskTimer;
class UniqueTaskId {
    static getTaskId() {
        return uuid.v1();
    }
}
exports.UniqueTaskId = UniqueTaskId;
exports.DEFAULT_TASK_TIMER_MANAGER_NAME = "Default";
class TaskTimerManager {
    constructor(name = exports.DEFAULT_TASK_TIMER_MANAGER_NAME) {
        this.name = name;
        this.tasks = {};
        this.taskCount = 0;
        this.tasksActive = 0;
        this.tasksTook = 0;
    }
    getName() {
        return this.name;
    }
    startTimer(taskName) {
        const taskId = this.getTaskId();
        this.tasks[taskId] = new TaskTimer(taskId, taskName);
        this.taskCount++;
        this.tasksActive++;
        return taskId;
    }
    stopTimer(taskId) {
        try {
            const tStop = this.tasks[taskId].stopTask();
            this.tasksTook += tStop;
            delete (this.tasks[taskId]);
            this.tasksActive--;
            return tStop;
        }
        catch (err) {
            _1.logger.error(err.message, err);
            return -1;
        }
    }
    timerStatus(taskId) {
        try {
            return this.tasks[taskId].status();
        }
        catch (err) {
            _1.logger.error(err.message, err);
            return undefined;
        }
    }
    timerReport() {
        return {
            avgTaskTime: this.tasksTook / this.taskCount,
            taskCount: this.taskCount,
            tasksActive: this.tasksActive,
            tasksTook: this.tasksTook
        };
    }
    toString() {
        const ttr = this.timerReport();
        return `${this.name}: Total #: ${ttr.taskCount} / ` +
            `Total Time: ${ttr.tasksTook} / ` +
            `Average Time: ${ttr.avgTaskTime} / ` +
            `Active Tasks: ${ttr.tasksActive}`;
    }
    getTaskId() {
        return UniqueTaskId.getTaskId();
    }
}
exports.TaskTimerManager = TaskTimerManager;
exports.defaultTimers = new TaskTimerManager();
//# sourceMappingURL=task-timers.js.map