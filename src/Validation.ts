import NeonView from './NeonView';
import { ModalWindowView } from './utils/ModalWindow';

const schemaResponse = fetch(__ASSET_PREFIX__ + 'assets/mei-all.rng');
let worker: Worker, schema: string, versionField: HTMLSpanElement, statusField: HTMLSpanElement;

/**
 * Update the UI with the validation results. Called when the WebWorker finishes validating.
 */
function updateUI (message: { data: string[] }): void {
  const errors = message.data;
  if (errors === null) {
    statusField.textContent = 'VALID';
    statusField.style.color = '#4bc14b';
    for (const child of statusField.children) {
      child.remove();
    }
  } else {
    let log = '';
    errors.forEach(line => {
      log += line + '\n';
    });
    statusField.textContent = '';
    statusField.style.color = 'red';
    // Create a new div for easier log implementation
    const status = document.createElement('div');
    //link.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(log)}`);
    //link.setAttribute('download', 'validation.log');
    status.textContent = 'INVALID';
    status.style.cursor = 'pointer';
    statusField.appendChild(status);

    status.addEventListener('click', statusOnClick.bind(this, log));
  }
}

function statusOnClick(log: string) {
  this.modal.setModalWindowView(ModalWindowView.VALIDATION_STATUS, log);
  this.modal.openModalWindow();
}

/**
 * Add the validation information to the display and create the WebWorker
 * for validation MEI.
 */
export async function init (neonView: NeonView): Promise<void> {
  const fileStatusDiv = document.getElementById('file-status');
  if (fileStatusDiv !== null) {
    const meiVersionDiv = document.createElement('div');
    meiVersionDiv.id = 'mei_version_container';
    const meiVersionTitle = document.createElement('span');
    meiVersionTitle.classList.add('file_status_title');
    meiVersionTitle.textContent = 'MEI Version: ';
    const version = document.createElement('span');
    version.id = 'mei_version';
    version.textContent = 'unknown';
    meiVersionDiv.appendChild(meiVersionTitle);
    meiVersionDiv.appendChild(version);
    fileStatusDiv.appendChild(meiVersionDiv);
    versionField = document.getElementById('mei_version');

    const meiStatusDiv = document.createElement('div');
    meiStatusDiv.id = 'validation_status_container';
    const meiStatusTitle = document.createElement('span');
    meiStatusTitle.classList.add('file_status_title');
    meiStatusTitle.textContent = 'MEI Status: ';
    const status = document.createElement('span');
    status.id = 'validation_status';
    status.textContent = 'unknown';
    meiStatusDiv.appendChild(meiStatusTitle);
    meiStatusDiv.appendChild(status);
    fileStatusDiv.appendChild(meiStatusDiv);
    statusField = document.getElementById('validation_status');
    worker = new Worker(__ASSET_PREFIX__ + 'workers/Worker.js');
    worker.onmessage = updateUI.bind(neonView);
  }
}

/**
 * Send the contents of an MEI file to the WebWorker for validation.
 * @param {string} meiData
 */
export async function sendForValidation (meiData: string): Promise<void> {
  if (statusField === undefined || versionField === undefined) {
    return;
  }
  if (schema === undefined) {
    const response = await schemaResponse;
    schema = await response.text();
  }
  statusField.textContent = 'checking...';
  statusField.style.color = 'gray';
  worker.postMessage({
    mei: meiData,
    schema: schema
  });

  versionField.textContent = 'checking...';
  versionField.style.color = 'gray';
}

/**
 * Update the message on a blank page when there is no MEI.
 */
export function blankPage (): void {
  for (const child of statusField.children) {
    child.remove();
  }
  statusField.textContent = 'No MEI';
  statusField.style.color = 'color:gray';
}
