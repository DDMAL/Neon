Neon2
=====
[![Build_Status](https://travis-ci.org/DDMAL/Neon2.svg?branch=develop)](https://travis-ci.org/DDMAL/Neon2)

**N**eume **E**ditor **ON**line.


Neon2 is a browser-based music notation editor written in JavaScript using the Verovio music engraving library. The editor can be used to manipulate digitally encoded early musical scores in square-note notation.


Neon2 is a re-write of [Neon.JS](https://github.com/DDMAL/Neon.js) using a modified version of [Verovio](https://github.com/DDMAL/verovio) to render MEI-Neume files according to the MEI 4.0 specifications. 

Develop status: [![Build Status](https://travis-ci.org/DDMAL/Neon2.svg?branch=develop)](https://travis-ci.org/DDMAL/Neon2)

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
