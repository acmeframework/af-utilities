# Changelog

## v1.0.0 - Initial Release - 2019-02-19

This is the initial release version. The code has been thoroughly tested with 100% coverage.

## v1.1.0 - Packaging Updates - 2019-07-20

Updates to dependencies to remove security vulnerabilities. Updates to the packaging.

### Fixes

- v1.1.1 - Dependency Updates - 2020-01-04

Updated all dependencies to the latest releases. This fixed an vulnerability with Handlebars which was a nested dependency. Handlebars is no longer a nested dependency with this release.

## v1.2.0 - Minor new features - 2021-01-28

- Added a new method to the TaskTimer class that now allows you to define your own current time source. This can be used to provide a more accurate time source than the default `Date.now()`. This change is fully backward compatible.
- Added a new utility function:
  - `setValue`

### Fixes

- v1.2.1 - Fix Rest Parameter Handling - 2021-01-29
- v1.2.2 - Fix Test Timing Expectations - 2021-01-29
- v1.2.3 - Update dependencies and fix Mocha config - 2021-01-30
- v1.2.4 - Switch to ESlint and Prettier - 2021-01-30
- v1.2.5 - Fix typo in variable name - 2021-01-30

## v1.3.0 - DevOps improvements / Improve internal class logging

- Migrate to GitHub Actions for build and testing - away from Travis CI.
- Use Node based tools for file management (`rimraf`) and update build process and `package.json` scripts to conform with new standards set in [`codemgr`](https://github.com/acmeframework/codemgr) tool.
- Added additional logging to internal classes and changed log message strings to use Template strings.

### Fixes

- v1.3.1 - Fix publish automation, correct spelling of `types` key
