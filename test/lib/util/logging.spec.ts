import 'mocha';

import { expect } from 'chai';
import sinon from 'sinon';

import {
  BaseLogger,
  BrowserLogger,
  LOG_SEVERITY_COUNT,
  LOG_SEVERITY_LOWEST_SEVERITY,
  LogDriver,
  Logger,
  logger,
  LogSeverity,
  NodeLogger,
} from '../../../src/lib';

/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-non-null-assertion */

class TestLogger extends BaseLogger implements LogDriver {
  public alert = sinon.spy();
  public critical = sinon.spy();
  public debug = sinon.spy();
  public emergency = sinon.spy();
  public error = sinon.spy();
  public info = sinon.spy();
  public log = sinon.spy();
  public notice = sinon.spy();
  public time = sinon.spy();
  public timeEnd = sinon.spy();
  public warn = sinon.spy();

  public reset() {
    this.alert.resetHistory();
    this.critical.resetHistory();
    this.debug.resetHistory();
    this.emergency.resetHistory();
    this.error.resetHistory();
    this.info.resetHistory();
    this.log.resetHistory();
    this.notice.resetHistory();
    this.time.resetHistory();
    this.timeEnd.resetHistory();
    this.warn.resetHistory();
  }
}

const TEST_LOG_ALERT_MESSAGE = `Alert Message (severity: ${LogSeverity.Alert})`;
const TEST_LOG_CRITICAL_MESSAGE = `Critical Message (severity: ${LogSeverity.Critical})`;
const TEST_LOG_DEBUG_MESSAGE = `Debug Message (severity: ${LogSeverity.Debug})`;
const TEST_LOG_EMERGENCY_MESSAGE = `Emergency Message (severity: ${LogSeverity.Emergency})`;
const TEST_LOG_ERROR_MESSAGE = `Error Message (severity: ${LogSeverity.Error})`;
const TEST_LOG_INFORMATIONAL_MESSAGE = `Informational Message (severity: ${LogSeverity.Informational})`;
const TEST_LOG_LOG_MESSAGE = `Log Message (severity: ${LogSeverity.Informational})`;
const TEST_LOG_NOTICE_MESSAGE = `Notice Message (severity: ${LogSeverity.Notice})`;
const TEST_LOG_WARNING_MESSAGE = `Warning Message (severity: ${LogSeverity.Warning})`;

type ConsoleSignature = (message: string, ...params: any[]) => void; // eslint-disable-line @typescript-eslint/no-explicit-any

class ConsoleTester {
  protected originalDebug!: ConsoleSignature | undefined;
  protected originalTime!: ConsoleSignature | undefined;
  protected originalTimeEnd!: ConsoleSignature | undefined;
  protected originalWarn!: ConsoleSignature | undefined;

  /**
   * Creates an instance of ConsoleTester that will setup console to look
   * like a particular environment and create Sinon Spy's on the intended
   * methods. Using the testType parameter you can either setup a
   * particular environment (browser or node) or leave it set to default
   * which will determine the spies needed based upon what the current
   * environment provides.
   *
   * @author Mike Coakley https://github.com/mcoakley
   * @date 2018-07-04
   * @param {("default" | "node" | "browser")} [testType="default"] tell
   * ConsoleTester what environment you wish to setup
   * @param {boolean} [browserWithExtras=false] when you aren't testing a Node
   * environment (either by default or by selection) you can force this class
   * to inject a console.warn method if this is set to true
   * @memberof ConsoleTester
   */
  constructor(
    testType: 'default' | 'node' | 'browser' = 'default',
    browserWithExtras = false
  ) {
    // These methods are always found on the console object
    sinon.spy(console, 'error');
    sinon.spy(console, 'info');
    sinon.spy(console, 'log');

    // This simple test was taken from StackOverflow
    // https://stackoverflow.com/a/31090240/7102037
    const isBrowser = new Function(
      'try {return this===window;}catch(e){return false;}'
    );
    let isNode = !isBrowser();

    // Now either setup based upon the environment or create a specific one
    if (testType === 'default') {
      const warningDefined = isNode || typeof console.warn !== 'undefined';
      const timeDefined = isNode || typeof console.time !== 'undefined';
      const timeEndDefined = isNode || typeof console.timeEnd !== 'undefined';

      if (isNode) {
        sinon.spy(console, 'debug');
      }
      if (timeDefined) sinon.spy(console, 'time');
      if (timeEndDefined) sinon.spy(console, 'timeEnd');
      if (warningDefined) sinon.spy(console, 'warn');
    } else {
      // We aren't default so force isNode
      isNode = testType === 'node';
      if (isNode) {
        sinon.spy(console, 'debug');
        sinon.spy(console, 'time');
        sinon.spy(console, 'timeEnd');
        sinon.spy(console, 'warn');
      } else {
        this.originalDebug = console.debug;
        console.debug = undefined!; // Force debug to undefined!

        if (browserWithExtras) {
          const warningDefined = typeof console.warn !== 'undefined';
          const timeDefined = typeof console.time !== 'undefined';
          const timeEndDefined = typeof console.timeEnd !== 'undefined';

          if (timeDefined) {
            sinon.spy(console, 'time');
          } else {
            console.time = sinon.spy();
          }
          if (timeEndDefined) {
            sinon.spy(console, 'timeEnd');
          } else {
            console.timeEnd = sinon.spy();
          }
          if (warningDefined) {
            sinon.spy(console, 'warn');
          } else {
            console.warn = sinon.spy();
          }
        } else {
          this.originalTime = console.time;
          console.time = undefined!;
          this.originalTimeEnd = console.timeEnd;
          console.timeEnd = undefined!;
          this.originalWarn = console.warn;
          console.warn = undefined!;
        }
      }
    }
  }

  public reset() {
    // @ts-ignore
    console.error.resetHistory();
    // @ts-ignore
    console.info.resetHistory();
    // @ts-ignore
    console.log.resetHistory();

    // @ts-ignore
    if (typeof console.debug !== 'undefined') console.debug.resetHistory();
    // @ts-ignore
    if (typeof console.time !== 'undefined') console.time.resetHistory();
    // @ts-ignore
    if (typeof console.timeEnd !== 'undefined') console.timeEnd.resetHistory();
    // @ts-ignore
    if (typeof console.warn !== 'undefined') console.warn.resetHistory();
  }

  public restore() {
    // @ts-ignore
    console.error.restore();
    // @ts-ignore
    console.info.restore();
    // @ts-ignore
    console.log.restore();

    if (typeof console.debug !== 'undefined') {
      // @ts-ignore
      if (typeof console.debug.restore !== 'undefined') {
        // @ts-ignore
        console.debug.restore();
      }
      if (this.originalDebug) {
        console.debug = this.originalDebug;
      }
      this.originalDebug = undefined!;
    }
    if (typeof console.time !== 'undefined') {
      // @ts-ignore
      if (typeof console.time.restore !== 'undefined') {
        // @ts-ignore
        console.time.restore();
      }
      if (this.originalTime) {
        console.time = this.originalTime;
      }
      this.originalTime = undefined!;
    }
    if (typeof console.timeEnd !== 'undefined') {
      // @ts-ignore
      if (typeof console.timeEnd.restore !== 'undefined') {
        // @ts-ignore
        console.timeEnd.restore();
      }
      if (this.originalTimeEnd) {
        console.timeEnd = this.originalTimeEnd;
      }
      this.originalTimeEnd = undefined!;
    }
    if (typeof console.warn !== 'undefined') {
      // @ts-ignore
      if (typeof console.warn.restore !== 'undefined') {
        // @ts-ignore
        console.warn.restore();
      }
      if (this.originalWarn) {
        console.warn = this.originalWarn;
      }
      this.originalWarn = undefined!;
    }
  }

  public async testTimeSpies() {
    function timeout(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    const TEST_LABEL = 'Testing123';
    const TEST_DELAY = 200;
    // We use a lesser value for the test timing expected delay. The
    // setTimeout function does not guarantee exact timing and can be
    // a little before or after the requested timeout. By taking 97% of
    // the requested delay we can reasonably expect to have completed in
    // this time.
    const TEST_DELAY_EXPECTED = TEST_DELAY * 0.97;

    // No need to see any output
    logger.muteLogger = true;

    let taskId = logger.time(TEST_LABEL);
    // Since we use TaskTimers we will not receive a
    // label back that we can actually test against as it will
    // be a UUID to identify the running task with our label as
    // a description.

    await timeout(TEST_DELAY);
    let tStop = logger.timeEnd(taskId);
    expect(tStop).to.be.at.least(TEST_DELAY_EXPECTED);

    // Tests for coverage

    // Use the default label
    taskId = logger.time();
    await timeout(TEST_DELAY);
    tStop = logger.timeEnd(taskId);
    expect(tStop).to.be.at.least(TEST_DELAY_EXPECTED);

    // Try to stop a timer with the default label (which should be
    // impossible)
    tStop = logger.timeEnd();
    expect(tStop).to.eq(-1);
  }

  public testSpies() {
    // We want to ensure they are ALL called
    logger.severityLevel = LOG_SEVERITY_LOWEST_SEVERITY;
    this.callLoggers();

    // Test the simple ones...
    // @ts-ignore
    expect(console.error.calledOnce).to.be.true;
    // @ts-ignore
    expect(console.info.calledOnce).to.be.true;

    // Test console methods that may be spied
    if (typeof console.debug !== 'undefined') {
      // @ts-ignore
      expect(console.debug.calledOnce).to.be.true;
    } else {
      expect(
        console.log
          // @ts-ignore
          .withArgs(TEST_LOG_DEBUG_MESSAGE).calledOnce
      ).to.be.true;
    }
    if (typeof console.warn !== 'undefined') {
      // @ts-ignore
      expect(console.warn.calledOnce).to.be.true;
    } else {
      expect(
        console.log
          // @ts-ignore
          .withArgs(TEST_LOG_WARNING_MESSAGE).calledOnce
      ).to.be.true;
    }

    // Test console methods that only use console.log (i.e. Emergency
    // simply calls console.log)
    expect(
      console.log
        // @ts-ignore
        .withArgs(TEST_LOG_EMERGENCY_MESSAGE).calledOnce
    ).to.be.true;
    expect(
      console.log
        // @ts-ignore
        .withArgs(TEST_LOG_ALERT_MESSAGE).calledOnce
    ).to.be.true;
    expect(
      console.log
        // @ts-ignore
        .withArgs(TEST_LOG_CRITICAL_MESSAGE).calledOnce
    ).to.be.true;
    expect(
      console.log
        // @ts-ignore
        .withArgs(TEST_LOG_NOTICE_MESSAGE).calledOnce
    ).to.be.true;

    // ...and finally test the log method itself
    expect(
      console.log
        // @ts-ignore
        .withArgs(TEST_LOG_LOG_MESSAGE).calledOnce
    ).to.be.true;
  }

  public testSeverity(severityLevel: LogSeverity) {
    logger.severityLevel = severityLevel;
    this.callLoggers();

    // NOTE: We add 1 because LogSeverity.Informational is used for both
    //       calls to logger.info and logger.log
    const logSeverities = LOG_SEVERITY_COUNT + 1;
    const filteredCount =
      logSeverities -
      (severityLevel +
        1 +
        (severityLevel >= LogSeverity.Informational ? 1 : 0));
    const loggedCount = logSeverities - filteredCount;

    expect(logger.filteredMessages).to.eq(filteredCount);
    expect(logger.messagesLogged).to.eq(loggedCount);
  }

  protected callLoggers() {
    logger.alert(TEST_LOG_ALERT_MESSAGE);
    logger.critical(TEST_LOG_CRITICAL_MESSAGE);
    logger.debug(TEST_LOG_DEBUG_MESSAGE);
    logger.emergency(TEST_LOG_EMERGENCY_MESSAGE);
    logger.error(TEST_LOG_ERROR_MESSAGE);
    logger.info(TEST_LOG_INFORMATIONAL_MESSAGE);
    logger.log(TEST_LOG_LOG_MESSAGE);
    logger.notice(TEST_LOG_NOTICE_MESSAGE);
    logger.warn(TEST_LOG_WARNING_MESSAGE);
  }
}

describe('Logger class', function () {
  describe('Testing of the Logger class using a "spied" Logger', function () {
    const testLogger = new TestLogger();

    before(function () {
      logger.setLogger(testLogger);
    });

    after(function () {
      // Set our logger back to using the default loggers
      logger.setLogger();
    });

    describe('Ensures that the module constants are properly defined', function () {
      it('Validates the LOG_SEVERITY_COUNT constant', function () {
        expect(Object.keys(LogSeverity).length / 2).to.eq(LOG_SEVERITY_COUNT);
      });

      it('Validates the LOG_SEVERITY_LOWEST_SEVERITY constant', function () {
        expect(LogSeverity[LOG_SEVERITY_COUNT - 1]).to.eq(
          LogSeverity[LOG_SEVERITY_LOWEST_SEVERITY]
        );
      });
    });

    describe('Initialize the Logger class', function () {
      it('initializes the Logger with the defaults', function () {
        expect(logger).to.be.an.instanceof(Logger);
      });
    });
  });

  describe('Testing of the Logger class using the native Loggers (Browser/Node)', function () {
    beforeEach(function () {
      logger.reset();
    });

    type TestType = 'default' | 'node' | 'browser';
    interface TestProfile {
      name: string;
      testType: TestType;
      browserWithWarn: boolean;
    }

    const testProfiles: TestProfile[] = [
      { name: 'NodeLogger', testType: 'node', browserWithWarn: false },
      { name: 'BrowserLogger', testType: 'browser', browserWithWarn: false },
      { name: 'BrowserLogger', testType: 'browser', browserWithWarn: true },
    ];

    testProfiles.forEach((value: TestProfile) => {
      const testTitleSuffix =
        value.testType === 'browser'
          ? ` (w/browserWithWarn = ${value.browserWithWarn})`
          : '';
      const testTitle = `${value.name}${testTitleSuffix}`;
      describe(`Tests using the ${testTitle} class`, function () {
        let consoleTester: ConsoleTester;

        before(function () {
          consoleTester = new ConsoleTester(
            value.testType,
            value.browserWithWarn
          );

          let logHandler: LogDriver | undefined;

          switch (value.testType) {
            case 'browser':
              logHandler = new BrowserLogger();
              break;
            case 'node':
              logHandler = new NodeLogger();
              break;
          }
          logger.setLogger(logHandler);
        });

        after(function () {
          consoleTester.restore();
          logger.reset();
          logger.setLogger();
        });

        describe('Checks that all of the Loggers are called correctly', function () {
          it('ensures all Logger logging methods are called', function () {
            consoleTester.testSpies();
            consoleTester.reset();
          });
        });

        describe('Checks the logging routines with each LogSeverity', function () {
          for (const lsKey in LogSeverity) {
            if (parseInt(lsKey, 10) >= 0) {
              const numLogSeverity = parseInt(lsKey, 10);
              it(`Tests LogSeverity (${numLogSeverity})`, function () {
                consoleTester.testSeverity(numLogSeverity);
                consoleTester.reset();
              });
            }
          }
        });

        describe('Covers the time/timeEnd workflow', function () {
          it('exercises the time/timeEnd workflow', async function () {
            await consoleTester.testTimeSpies();
            consoleTester.reset();
          });
        });

        describe('Covers non-standard calling patterns', function () {
          it('works through the muteLogger workflow', function () {
            // Set our baseline
            expect(logger.muteLogger).to.be.false;
            expect(logger.messagesLogged).to.eq(0);
            expect(logger.filteredMessages).to.eq(0);

            logger.emergency('Test message that should be logged');
            expect(logger.messagesLogged).to.eq(1);
            expect(logger.filteredMessages).to.eq(0);

            logger.muteLogger = true;
            logger.emergency('Test message that should not be logged');
            expect(logger.muteLogger).to.be.true;
            expect(logger.messagesLogged).to.eq(1);
            expect(logger.filteredMessages).to.eq(1);
          });

          it('works through the severityLevel workflow', function () {
            logger.severityLevel = LogSeverity.Emergency;
            expect(logger.severityLevel).to.equal(LogSeverity.Emergency);

            logger.severityLevel = LogSeverity.Debug;
            expect(logger.severityLevel).to.equal(LogSeverity.Debug);
          });

          it(
            'ensures that logger.emergency messages can be filtered' +
              ' with muteLogger set to true',
            function () {
              logger.muteLogger = true;
              expect(logger.messagesLogged).to.eq(0);
              expect(logger.filteredMessages).to.eq(0);
              logger.emergency('This will not be logged');
              expect(logger.messagesLogged).to.eq(0);
              expect(logger.filteredMessages).to.eq(1);
            }
          );
        });
      });
    });
  });
});
