import 'mocha';

import { expect } from 'chai';

import {
  DEFAULT_TASK_TIMER_MANAGER_NAME,
  defaultTimers,
  logger,
  TaskData,
  TaskStatus,
  TaskTimer,
  TaskTimerReport,
  UniqueTaskId,
} from '../../../src/lib';

/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-non-null-assertion */

describe('UniqueTaskId class', function () {
  it('should get a string taskId', function () {
    const taskId: string = UniqueTaskId.getTaskId();
    expect(taskId).to.be.a('string');
  });

  it("task id's should be different each call", function () {
    const taskId1: string = UniqueTaskId.getTaskId();
    const taskId2: string = UniqueTaskId.getTaskId();

    expect(taskId1).to.not.equal(taskId2);
  });
});

describe('TaskTimerManager class', function () {
  const TEST_DELAY = 200;
  // Ensure we account for inconsistencies possible in setTimeout
  const TEST_DEPLAY_EXPECTED = TEST_DELAY * 0.97;

  before(function () {
    logger.reset(); // Don't assume anything
    logger.muteLogger = true;
  });

  after(function () {
    logger.reset();
  });

  it('start a timer', function () {
    const taskId: string = defaultTimers.startTimer('Test Timer');
    expect(taskId).to.be.a('string');

    const taskData: TaskData | undefined = defaultTimers.timerStatus(taskId);
    expect(taskData).to.not.be.undefined;
    expect(taskData!.status).to.be.equal(TaskStatus.running);
    expect(taskData!.taskId).to.be.equal(taskId);
    expect(taskData!.start).to.be.greaterThan(0);
  });

  it('start, wait (~' + TEST_DELAY + 'ms), and stop a timer', function (done) {
    let tReport: TaskTimerReport = defaultTimers.timerReport();
    const currentCount: number = tReport.taskCount;

    const taskId: string = defaultTimers.startTimer('Test Timer');
    setTimeout(function () {
      const tStop = defaultTimers.stopTimer(taskId);
      expect(tStop).to.be.at.least(TEST_DEPLAY_EXPECTED);

      tReport = defaultTimers.timerReport();
      expect(tReport.taskCount).to.equal(currentCount + 1);
      done();
    }, TEST_DELAY);
  });

  it('stopTimer should return a negative result for an unknown taskId', function () {
    defaultTimers.startTimer('Test Timer');
    const tStop: number = defaultTimers.stopTimer('NO WAY');
    expect(tStop).to.be.lessThan(0);
  });

  it('timerStatus should return an undefined result for an unknown taskId', function () {
    defaultTimers.startTimer('Test Timer');
    const tStatus: TaskData | undefined = defaultTimers.timerStatus('NO WAY');
    expect(tStatus).to.be.undefined;
  });

  it('getName() should return the name of the timers', function () {
    expect(defaultTimers.getName()).to.equal(DEFAULT_TASK_TIMER_MANAGER_NAME);
  });

  it('toString() should return a string', function () {
    expect(defaultTimers.toString()).to.be.a('string');
  });
});

describe('TaskTimer class', function () {
  it('should throw TypeError during construction', function () {
    expect(function () {
      // @ts-ignore
      new TaskTimer(undefined, 'Hello');
    }).to.throw(TypeError);

    expect(function () {
      // @ts-ignore
      new TaskTimer("This doesn't matter", undefined);
    }).to.throw(TypeError);
  });
});
