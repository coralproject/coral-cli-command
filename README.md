# @coralproject/coral-cli-command

![Tests](https://github.com/coralproject/coral-cli-command/workflows/test/badge.svg)
[![Version](https://img.shields.io/npm/v/@coralproject/coral-cli-command.svg)](https://npmjs.org/package/@coralproject/coral-cli-command)

## Releasing

When you're ready to release a new vesrion of `@coralproject/coral-cli-command`,
you can do the following:

1. Run `npm version --no-git-tag-version (major|minor|patch)` to update the
   version number in package files.
2. Push the changes to a new branch, and submit a PR against `main`.
3. Once the changes have been approved, and all the code you want to deploy for
   the version is in `main`, create a release with the version number: `v0.4.0`
   (Note that the `v` prefix is required)

GitHub Actions will run your tests and release the new version for you.
