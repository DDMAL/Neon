import NeonCore from './NeonCore.js';


/**
 * NeonView class. Manages the other modules of Neon and communicates with
 * NeonCore.
 */
class NeonView {
  /**
   * Constructor for NeonView. Sets mode and passes constructors.
   * @param {object} params
   * @param {string} params.manifest
   * @param {object} params.View - Constructor for a View module
   * @param {object} params.Display - Constructor for DisplayPanel module
   * @param {object} params.Info - Constructor for InfoModule module
   * @param {object} [params.NeumeEdit] - Constructor for NeumeEdit module
   * @param {object} [params.TextView] - Constructor for TextView module
   * @param {object} [params.TextEdit] - Constructor for TextEdit module
   */
  constructor (params) {
    if (!parseManifest(params.manifest)) {
      console.error('Unable to parse the manifest');
    }
    this.manifest = params.manifest;

    this.view = new params.View(this, params.Display, params.manifest.image);
    this.name = params.manifest.title;

    this.core = new NeonCore(params.manifest);
    this.display = this.view.display;
    this.info = new params.Info(this);

    if (params.NeumeEdit !== undefined || (params.TextEdit !== undefined && params.TextView !== undefined)) {
      // Set up display for edit button
      prepareEditMode();
    }

    if (params.NeumeEdit !== undefined) {
      this.NeumeEdit = new params.NeumeEdit(this);
    }
    if (params.TextView !== undefined) {
      this.textView = new params.TextView(this);
      if (params.TextEdit !== undefined) {
        this.TextEdit = new params.TextEdit(this);
      }
    }
  }

  /**
   * Start Neon
   */
  start () {
    /* this.core.db.info().then((info) => {
      if (info.doc_count === 0) {
        this.core.initDb().then(() => { this.updateForCurrentPage(); });
      } else {
        Notification.queueNotification('Existing database found. Revert to start from the beginning.');
        this.updateForCurrentPage();
      }
    }); */
    this.core.initDb().then(() => { this.updateForCurrentPage(); });
  }

  /**
   * Get the current page from the loaded view and then display the
   * most up to date SVG.
   */
  updateForCurrentPage () {
    let pageNo = this.view.getCurrentPage();
    let pageURI = this.view.getCurrentPageURI();
    // load pages
    this.core.getSVG(pageURI).then((svg) => {
      this.view.updateSVG(svg, pageNo);
      this.view.updateCallbacks.forEach(callback => callback());
    });
  }

  /**
   * Same as updateForCurrentPage but returns a promise.
   * @see NeonView.updateForCurrentPage
   */
  updateForCurrentPagePromise () {
    let pageNo = this.view.getCurrentPage();
    let pageURI = this.view.getCurrentPageURI();
    return Promise.resolve(this.core.getSVG(pageURI).then((svg) => {
      this.view.updateSVG(svg, pageNo);
      this.view.updateCallbacks.forEach(callback => callback());
    }));
  }

  /**
   * Redo an action performed on the current page (if any)
   */
  redo () {
    return this.core.redo(this.view.getCurrentPageURI());
  }

  /**
   * Undo the last action performed on the current page (if any)
   */
  undo () {
    return this.core.undo(this.view.getCurrentPageURI());
  }

  /**
   * Get the mode Neon is in: viewer, insert, or edit.
   */
  getUserMode () {
    if (this.NeumeEdit !== undefined) {
      return this.NeumeEdit.getUserMode();
    } else if (this.TextEdit !== undefined) {
      return 'edit';
    } else {
      return 'viewer';
    }
  }

  /**
   * Perform an editor action
   * @param {object} action - The editor toolkit action object.
   * @param {string} action.action - The name of the action to perform.
   * @param {object|array} action.param - The parameters of the action(s)
   * @param {string} pageURI - The URI of the page to perform the action on
   * @returns {Promise} A promise that resolves to the result of the action.
   */
  edit (action, pageURI) {
    let editPromise = new Promise((resolve) => {
      resolve(this.core.edit(action, pageURI));
    });
    return editPromise;
  }

  /**
   * Get the attributes for a specific musical element.
   * @param {string} elementID - The unique ID of the element.
   * @param {string} pageURI - The URI of the page the element is found on
   * @returns {Promise} A promise that resolves to the available attributes.
   */
  getElementAttr (elementID, pageURI) {
    let elementPromise = new Promise((resolve, reject) => {
      resolve(this.core.getElementAttr(elementID, pageURI));
    });
    return elementPromise;
  }

  /**
   * Updates browser database and creates JSON-LD save file.
   * @returns {Promise} A promise that resolves when the save action is finished.
   */
  export () {
    // return this.core.updateDatabase();
    return (new Promise((resolve, reject) => {
      this.core.updateDatabase().then(() => {
        this.manifest.mei_annotations = this.core.annotations;
        this.manifest.timestamp = (new Date()).toISOString();
        let data = new window.Blob([JSON.stringify(this.manifest, null, 2)], { type: 'application/ld+json' });
        let reader = new window.FileReader();
        reader.addEventListener('load', () => {
          resolve(reader.result);
        });
        reader.readAsDataURL(data);
      }).catch(err => { reject(err); });
    }));
  }

  /**
   * Save the current state to the browser database.
   * @returns {Promise} A promise that resolves when the action is finished.
   */
  save () {
    return this.core.updateDatabase();
  }

  /**
   * Deletes the local database of the loaded MEI file(s).
   * @returns {Promise} A promise that resolves when the database is deleted.
   */
  deleteDb () {
    return this.core.db.destroy();
  }

  /**
   * Get the page's MEI file encoded as a data URI.
   * @param {number} pageNo - The zero-indexed page to encode.
   * @returns {Promise} A promise that resolves to the URI.
   */
  getPageURI (pageNo) {
    if (pageNo === undefined) {
      pageNo = this.view.getCurrentPage();
    }
    return new Promise((resolve) => {
      this.core.getMEI(pageNo).then((mei) => {
        resolve('data:application/mei+xml;charset=utf-8,' + encodeURIComponent(mei));
      });
    });
  }

  /**
   * Get the page's MEI file as a string.
   * @param {number} pageNo - The zero-indexed page to get.
   * @returns {Promise} A promise that resolves to the string.
   */
  getPageMEI (pageNo) {
    return this.core.getMEI(pageNo);
  }

  /**
   * Get the page's SVG.
   * @param {number} pageNo - The zero-indexed page to get.
   * @returns {Promise} A promise that resolves to the SVG.
   */
  getPageSVG (pageNo) {
    return this.core.getSVG(pageNo);
  }
}

export { NeonView as default };
