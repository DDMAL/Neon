import NeonCore from './NeonCore.js';
import * as Notification from './utils/Notification.js';

/**
 * NeonView class. Manages the other modules of Neon and communicates with
 * NeonCore.
 */
class NeonView {
  /**
   * Constructor for NeonView. Sets mode and passes constructors.
   * @param {object} params
   * @param {string} params.mode
   * @param {object} params.options
   * @param {object} params.View - Constructor for a View module
   * @param {object} params.Display - Constructor for DisplayPanel module
   * @param {object} params.Info - Constructor for InfoModule module
   * @param {object} [params.Edit] - Constructor for EditMode module
   * @param {object} [params.TextView] - Constructor for TextView module
   */
  constructor (params) {
    if (params.mode === 'single' || params.mode === 'iiif') {
      this.mode = params.mode;
    } else {
      console.error('Invalid mode');
    }

    if (this.mode === 'single') {
      this.view = new params.View(this, params.Display, params.options.image);
    } else {
      this.view = new params.View(this, params.Display, params.options.manifest);
    }

    this.name = params.options.name;
    this.core = new NeonCore(params.options.meiMap, params.options.name);
    this.display = this.view.display;
    this.info = new params.Info(this);

    if (params.Edit !== undefined) {
      // Set up display for edit button
      let parent = document.getElementById('dropdown_toggle');
      let editItem = document.createElement('a');
      editItem.classList.add('navbar-item');
      let editButton = document.createElement('button');
      editButton.classList.add('button');
      editButton.id = 'edit_mode';
      editButton.textContent = 'Edit MEI';
      editItem.appendChild(editButton);
      parent.appendChild(editItem);

      this.editor = new params.Edit(this);
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
    // load pages
    this.core.getSVG(pageNo).then((svg) => {
      this.view.updateSVG(svg, pageNo);
    });
  }

  /**
   * Redo an action performed on the current page (if any)
   */
  redo () {
    return this.core.redo(this.view.getCurrentPage());
  }

  /**
   * Undo the last action performed on the current page (if any)
   */
  undo () {
    return this.core.undo(this.view.getCurrentPage());
  }

  /**
   * Get the mode Neon is in: viewer, insert, or edit.
   */
  getUserMode () {
    if (this.editor === undefined) {
      return 'viewer';
    } else {
      return this.editor.getUserMode();
    }
  }

  /**
   * Perform an editor action
   * @param {object} action - The editor toolkit action object.
   * @param {string} action.action - The name of the action to perform.
   * @param {object|array} action.param - The parameters of the action(s)
   * @param {number} pageNo - The zero-indexed page number to perform the action on.
   * @returns {Promise} A promise that resolves to the result of the action.
   */
  edit (action, pageNo) {
    let editPromise = new Promise((resolve) => {
      resolve(this.core.edit(action, pageNo));
    });
    return editPromise;
  }

  /**
   * Get the attributes for a specific musical element.
   * @param {string} elementID - The unique ID of the element.
   * @param {number} pageNo - The zero-indexed page number the ID is found on.
   * @returns {Promise} A promise that resolves to the available attributes.
   */
  getElementAttr (elementID, pageNo) {
    let elementPromise = new Promise((resolve, reject) => {
      resolve(this.core.getElementAttr(elementID, pageNo));
    });
    return elementPromise;
  }

  /**
   * Save the current state of the MEI file(s) to the browser database.
   * @returns {Promise} A promise that resolves when the save action is finished.
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
