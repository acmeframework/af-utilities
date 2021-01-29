# af-utilities

## Status of Project

[![Build Status](https://travis-ci.org/acmeframework/af-utilities.svg?branch=master)](https://travis-ci.org/acmeframework/af-utilities) [![Coverage Status](https://coveralls.io/repos/github/acmeframework/af-utilities/badge.svg?branch=master)](https://coveralls.io/github/acmeframework/af-utilities?branch=master)

## Installation

```bash
npm install af-utilities
```

## Description

The af-utilities library provides utility classes and functions used throughout the Acme Framework frameworks and libraries. While they are designed to be general in nature they are opinionated in functionality.

## Classes Provided

`Logger` - provides a replacement for console logging that normalizes the experience across Node and a Browser. It additionally uses a TaskTimerManager instance to implement a refined timing workflow over `console.time` and `console.timeEnd`.

`TaskTimer` - provides functionality to time a specific task. The class implements a status mechanism for a simple state machine.

`TaskTimerManager` - provides a consistent way to time tasks within your code. `TaskTimerManager` also collects statistics on totals calls, active timers, average time spent on a task, etc.

`defaultTimers` - an instance of TaskTimerManager using the `DEFAULT_TASK_TIMER_MANAGER_NAME` as the name for the instance.

## Functions Provided

`setValue` - this function provides an easy way to set defaults while checking for an usable value or not. This function can also be used to ensure a consistent value of `undefined` for `undefined` or `null` values. If you leave `defaultValue` undefined, it will be returned when `newValue` is unusable (which is `undefined` or `null`).

## [Support Issues](https://github.com/acmeframework/af-utilities/issues)

## Release Notes

### v1.0.0 - Initial Release

This is the initial release version. The code has been thoroughly tested with 100% coverage.

### v1.1.0 - Packaging Updates

Updates to dependencies to remove security vulnerabilities. Updates to the packaging.

#### Fixes

- v1.1.1 - Dependency Updates

Updated all dependencies to the latest releases. This fixed an vulnerability with Handlebars which was a nested dependency. Handlebars is no longer a nested dependency with this release.

### v1.2.0 - Minor new features

- Added a new method to the TaskTimer class that now allows you to define your own current time source. This can be used to provide a more accurate time source than the default `Date.now()`. This change is fully backward compatible.
- Added a new utility function:
  - `setValue`

#### Fixes

- v1.2.1 - Fix Rest Parameter Handling
- v1.2.2 - Fix Test Timing Expectations

## The MIT License

Copyright &copy; 2019-2021 Acme Framework

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
