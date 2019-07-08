import VerovioWorker from './VerovioWorker.js';

export default class VerovioWrapper {
  constructor () {
    this.verovioWorker = new VerovioWorker();
  }

  addEventListener (type, handler) {
    return this.verovioWorker.addEventListener(type, handler);
  }

  postMessage (message) {
    return this.verovioWorker.postMessage(message);
  }
}
