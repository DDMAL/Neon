import NeonView from './NeonView';
import { ModalWindowView } from './utils/ModalWindow';

const schemaResponse = fetch(__ASSET_PREFIX__ + 'assets/mei-all.rng');
let worker: Worker, schema: string, versionField: HTMLSpanElement, statusField: HTMLSpanElement;

/**
 * Update the UI with the validation results. Called when the WebWorker finishes validating.
 */
function updateStatusUI (message: { data: string[] }): void {
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

function updateVersionUI (version: string): void {
  if (!version) {
    return;
  } 

  switch (version) {
    case 'unknown':
      versionField.textContent = version;
      versionField.style.color = 'gray';
      break;

    default:
      versionField.textContent = version;
      versionField.style.color = '#68A7AD';
  }
}

function statusOnClick(log: string) {
  this.modal.setModalWindowView(ModalWindowView.ERROR_LOG, log);
  this.modal.openModalWindow();
}

/**
 * Add the validation information to the display and create the WebWorker
 * for validation MEI.
 */
export async function init (neonView: NeonView): Promise<void> {
  const fileStatusDiv = document.getElementById('file-status');
  if (fileStatusDiv !== null) {
    const meiVersion = document.getElementById('mei_version');
    meiVersion.textContent = 'unknown';
    versionField = meiVersion;

    const meiStatus = document.getElementById('validation_status');
    meiStatus.textContent = 'unknown';
    statusField = meiStatus;
    worker = new Worker(__ASSET_PREFIX__ + 'workers/Worker.js');
    worker.onmessage = updateStatusUI.bind(neonView);
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
  const meiVersion = await getMeiVersion(meiData);
  updateVersionUI(meiVersion);
}

/**
 * Update the message on a blank page when there is no MEI.
 */
export function blankPage (): void {
  if (statusField === undefined || versionField === undefined) {
    return;
  }
  
  for (const child of statusField.children) {
    child.remove();
  }
  statusField.textContent = 'No MEI';
  statusField.style.color = 'color:gray';

  versionField.textContent = 'No MEI';
  versionField.style.color = 'color:gray';
}

async function getMeiVersion(meiData: string): Promise<string> {
  const parser = new DOMParser();
  const meiDoc = parser.parseFromString(meiData, 'text/xml');
  const mei = meiDoc.documentElement;
  
  const meiVersion = mei.getAttribute('meiversion');
  if (meiVersion) {
    return meiVersion;
  } else {
    return 'unknown';
  }
}