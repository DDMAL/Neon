/** @module Validation */

const schema = require('./validation/mei-all.rng');

import Worker from 'worker-loader!./Worker.js';
var worker;
var statusField = document.getElementById('validation_status');

export function init () {
  worker = new Worker();
  worker.onmessage = updateUI;
}

export function sendForValidation (meiData) {
  statusField.textContent = 'checking...';
  statusField.style = 'color:gray';
  worker.postMessage({
    mei: meiData,
    schema: schema.default
  });
}

function updateUI (message) {
  let errors = message.data;
  if (errors === null) {
    statusField.textContent = 'VALID';
    statusField.style = 'color:green';
    for (let child of statusField.children) {
      statusField.deleteChild(child);
    }
  } else {
    let log = '';
    errors.forEach(line => {
      log += line + '\n';
    });
    statusField.textContent = '';
    statusField.style = 'color:red';
    let link = document.createElement('a');
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' +
      encodeURIComponent(log));
    link.setAttribute('download', 'validation.log');
    link.textContent = 'INVALID';
    statusField.appendChild(link);
  }
}
