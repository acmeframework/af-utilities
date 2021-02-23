# af-utilities

## Status of Project

[![Build Status](https://github.com/acmeframework/af-utilities/actions/workflows/build-test.yml/badge.svg)](https://github.com/acmeframework/af-utilities/actions/workflows/build-test.yml) [![Coverage Status](https://coveralls.io/repos/github/acmeframework/af-utilities/badge.svg?branch=main)](https://coveralls.io/github/acmeframework/af-utilities?branch=main)

## Installation

```bash
npm install af-utilities
```

## Description

The af-utilities library provides utility classes and functions used throughout the Acme Framework frameworks and libraries. While they are designed to be general in nature they are opinionated in functionality.

## Classes Provided

### Logger

THe `Logger` class provides a replacement for console logging that normalizes the experience across Node and a Browser. It additionally uses a TaskTimerManager instance to implement a refined timing workflow over `console.time` and `console.timeEnd`. A default instance is provided in the `logger` variable.

The `Logger` class uses a `LogSeverity` enum to control what level of log messages will be output.

```typescript
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
```

Simple usage examples...

```typescript
import { logger, LogSeverity } from 'af-utilities';

// Simply use it instead of console.log
logger.log("I've got something to say"); // Same as info()

logger.emergency('An emergency is happening');
logger.alert('Help!!!');
logger.critical('It is going down.');
logger.error('Something BROKE!');
logger.warn("It's not exactly right, but I'll survive.");
logger.notice('Please pay attention to this.');
logger.info('About to perform a really cool task.');
logger.debug('Some debugging information'); // By default this won't be output

logger.severityLevel = LogSeverity.debug;
logger.debug('This will output now.'); // Now this will display

// Time a task
const timer = logger.time('MyAsyncTask');
await performAnAsyncTask();
const duration = logger.timeEnd(timer);

// The logger also tracks how many messages it is processing
const totalMsgs = logger.messagesLogged; // All messages logged
const missedMsgs = logger.filteredMessages; // Messages that have been filtered from output

logger.reset(); // Reset all of the counters

// You can also mute the logger completely without changing the logger.severityLevel
logger.muteLogger = true;
```

### TaskTimer

`TaskTimer` provides functionality to time a specific task. The class implements a status mechanism for a simple state machine.

```typescript
import { TaskTimer } from 'af-utilities';

const timer = TaskTimer('a00001', 'AsyncTask01');
await asyncTask01();
const duration = timer.stopTask();
const taskData = timer.status();

// taskData will contain:
// {
//   taskId: 'a00001',
//   taskName: 'AsyncTask01',
//   status: TaskStatus.stopped,
//   start: <Date.now() when the task started>,
//   stop: <Date.now() when the task ended>,
//   msDiff: <stop - start : the difference>
// }
```

`TaskTimer` has a protected method `_getTimestamp` so you can provide your own timer source if needed.

### TaskTimerManager

`TaskTimerManager` provides a consistent way to time tasks within your code. `TaskTimerManager` also collects statistics on totals calls, active timers, average time spent on a task, etc.

`defaultTimers` - an instance of `TaskTimerManager` using the `DEFAULT_TASK_TIMER_MANAGER_NAME` as the name for the instance.

```typescript
import { defaultTimers } from 'af-utilities';

const totalTaskId = defaultTimers.startTimer('MyConnection');
const taskId01 = defaultTimers.startTimer('AsyncTask01');
await asyncTask01();
const duration01 = defaultTimers.stopTimer(taskId01);

let totalTaskData = defaultTimers.timeStatus(totalTaskId);
// totalTaskData.status = TaskStatus.running

const taskId02 = defaultTimers.startTimers('AsyncTask02');
await asyncTask02();
const duration02 = defaultTimers.stopTimer(taskId02);
const totalDuration = defaultTimers.stopTimer(totalTaskId);

// TaskTimerManager provides a couple of reporting methods
str(defaultTimers);

// will output a string in the format:
// default: Total #: 3 / Total Time: 305 / Average Time: 95 / Active Tasks: 0
// For the examples above

// TaskTimerManager has two protected methods to allow you to control
// the how this class builds TaskTimer instances or generates the Task ID's.
// TaskTimerManager._taskTimer
// TaskTimerManager.getTaskId
```

## Functions Provided

### setValue

The `setValue` function provides an easy way to set defaults while checking for an usable value or not. This function can also be used to ensure a consistent value of `undefined` for `undefined` or `null` values. If you leave `defaultValue` undefined, it will be returned when `newValue` is unusable (which is `undefined` or `null`).

```typescript
import { setValue } from 'af-utilities';

const value1 = setValue(someValue, 'default');
// If someValue has a value then value1 will be set to that value,
// otherwise value1 will be set to 'default'
```

## Support

To share your comments, provide suggestions, or raise issues, submit an [issue](https://github.com/acmeframework/af-utilities/issues).
