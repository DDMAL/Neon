Neon v6.0.0
=====
[![Build_Status](https://travis-ci.org/DDMAL/Neon.svg?branch=master)](https://travis-ci.org/DDMAL/Neon)
[![License: MIT](https://img.shields.io/github/license/DDMAL/Neon)](https://opensource.org/licenses/MIT)
[![dependencies Status](https://david-dm.org/DDMAL/Neon/status.svg)](https://david-dm.org/DDMAL/Neon)
[![devDependencies Status](https://david-dm.org/DDMAL/Neon/dev-status.svg)](https://david-dm.org/DDMAL/Neon?type=dev)

**N**eume **E**ditor **ON**line.


Neon is a browser-based music notation editor written in JavaScript using the Verovio music engraving library. The editor can be used to manipulate digitally encoded early musical scores in square-note notation.


Neon is a re-write of [Neon.JS](https://github.com/DDMAL/Neon.js) using a modified version of [Verovio](https://github.com/DDMAL/verovio) to render MEI-Neume files according to the MEI 5.0.0-dev specifications.


Neon for Artists
-----------

Neon has two main modes: viewer and editor. To learn how to use both, [read the instructions on our wiki.](https://github.com/DDMAL/Neon/wiki/Instructions)

Neon for Developers
-----------
### To Run Neon locally
#### Requirements
 * [yarn](https://yarnpkg.com/en/docs/install):
    * `brew install yarn` on Mac

#### Setup

1. Install the dependencies using yarn:
```
yarn install
```

2. Build webpack:
```
yarn build
```

3. Start the server:
```
yarn start
```

4. Access the page at: <http://localhost:8080>.

For more information, [read the instructions on our wiki.](https://github.com/DDMAL/Neon/wiki/Dev%3A-Set-up-Neon-and-Verovio-Locally)

### Testing

We use [Cypress](https://www.cypress.io/) for E2E testing.

Run the command `yarn test`. [Read more about testing on our wiki.](https://github.com/DDMAL/Neon/wiki/Testing-with-Cypress)

### Verovio

Verovio is present as an npm package under `verovio-util/verovio-dev` with the name `verovio-dev`. Its contents come from the `emscripten/npm-dev` folder in a Verovio project folder.
