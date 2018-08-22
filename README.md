# af-utilities

The af-utilities library provides utility classes and functions used throughout the Acme Framework frameworks and libraries. While they are designed to be general in nature they are opinionated in functionality.

## Classes Provided

`Logger` - provides a replacement for console logging that normalizes the experience across Node and a Browser. It additionally uses a TaskTimerManager instance to implement a refined timing workflow over `console.time` and `console.timeEnd`.

`TaskTimer` - provides functionality to time a specific task. The class implements a status mechanism for a simple state machine.

`TaskTimerManager` - provides a consistent way to time tasks within your code. `TaskTimerManager` also collects statistics on totals calls, active timers, average time spent on a task, etc.

`defaultTimers` - an instance of TaskTimerManager using the `DEFAULT_TASK_TIMER_MANAGER_NAME` as the name for the instance.

[Support Issues](https://github.com/acmeframework/af-utilities/issues)

The MIT License

Copyright &copy; 2018 Acme Framework

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
