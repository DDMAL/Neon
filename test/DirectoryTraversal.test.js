/* eslint-env jest */

const fs = require('fs');
const request = require('request');
const path = require('path');

const url = 'http://localhost:8080/';
const toTest = '../../test/test.txt';

beforeAll(() => {
  fs.writeFileSync(path.join('test', 'test.txt'), 'Hello, test!');
});

afterAll(() => {
  try {
    fs.unlinkSync(path.join('test', 'test.txt'));
  } catch (err) {
    // Nothing here since if a test fails unlink will fail
  }
});

describe('Check root', () => {
  test('Encode URI', done => {
    request(url + encodeURIComponent(toTest), (error, response, body) => {
      if (error) throw error;
      expect(response.statusCode).not.toBe(200);
      done();
    });
  });

  test('2e and 2f', done => {
    let replace = toTest.replace(/\./g, '%2e').replace(/\//g, '%2f');
    request(url + replace, (error, response, body) => {
      if (error) throw error;
      expect(response.statusCode).not.toBe(200);
      done();
    });
  });

  test('UTF-8 encoding', done => {
    let replace = toTest.replace(/\//g, '%c0%af');
    request(url + replace, (error, response, body) => {
      if (error) throw error;
      expect(response.statusCode).not.toBe(200);
      done();
    });
  });
});

describe('Check /edit/:filename', () => {
  const testUrl = url + 'edit/';

  test('Encode URI', done => {
    request(testUrl + encodeURIComponent(toTest), (error, response, body) => {
      if (error) throw error;
      expect(response.statusCode).not.toBe(200);
      done();
    });
  });

  test('2e and 2f', done => {
    let replace = toTest.replace(/\./g, '%2e').replace(/\//g, '%2f');
    request(testUrl + replace, (error, response, body) => {
      if (error) throw error;
      expect(response.statusCode).not.toBe(200);
      done();
    });
  });

  test('UTF-8 encoding', done => {
    let replace = toTest.replace(/\//g, '%c0%af');
    request(testUrl + replace, (error, response, body) => {
      if (error) throw error;
      expect(response.statusCode).not.toBe(200);
      done();
    });
  });
});

describe('Check /delete/:filename', () => {
  const testUrl = url + 'delete/';

  test('Encode URI', done => {
    request(testUrl + encodeURIComponent(toTest), (error, response, body) => {
      if (error) {
        throw error;
      }
      expect(response.statusCode).not.toBe(200);
      done();
    });
  });

  test('2e and 2f', done => {
    let replace = toTest.replace(/\./g, '%2e').replace(/\//g, '%2f');
    request(testUrl + replace, (error, response, body) => {
      if (error) {
        throw error;
      }
      expect(response.statusCode).not.toBe(200);
      done();
    });
  });

  test('UTF-8 encoding', done => {
    let replace = toTest.replace(/\//g, '%c0%af');
    request(testUrl + replace, (error, response, body) => {
      if (error) throw error;
      expect(response.statusCode).not.toBe(200);
      done();
    });
  });
});
