Neon3
=====
[![Build_Status](https://travis-ci.org/DDMAL/Neon2.svg?branch=develop)](https://travis-ci.org/DDMAL/Neon2)

**N**eume **E**ditor **ON**line.


Neon3 is a browser-based music notation editor written in JavaScript using the Verovio music engraving library. The editor can be used to manipulate digitally encoded early musical scores in square-note notation.


Neon2 is a re-write of [Neon.JS](https://github.com/DDMAL/Neon.js) using a modified version of [Verovio](https://github.com/DDMAL/verovio) to render MEI-Neume files according to the MEI 4.0 specifications. 

Requirements
------------
 * [yarn](https://yarnpkg.com/en/docs/install): 
    * `brew install yarn` on Mac

Setup
-----

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

Test
----

Follow the instructions from above first. The tests for Neon2 use [Selenium](https://docs.seleniumhq.org/) and so require a web browser ([Firefox](https://mozilla.org/firefox)) and its driver ([geckodriver](https://github.com/mozilla/geckodriver)).
On Mac install these with Homebrew:
```
brew cask install firefox
brew install geckodriver
```
Then you can run the tests locally using `yarn test`. We use [jest](https://facebook.github.io/jest/) to script our tests.

*These tests require the server to be running on `localhost:8080`*
