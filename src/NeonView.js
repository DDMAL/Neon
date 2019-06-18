import NeonCore from './NeonCore.js';
import EditControls from './utils/EditControls';
import DragHandler from './utils/DragHandler';
import Select from './utils/Select';

const $ = require('jquery');

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
   * @param {object} [params.NeumeEdit] - Constructor for NeumeEdit module
   * @param {object} [params.TextView] - Constructor for TextView module
   * @param {object} [params.TextEdit] - Constructor for TextEdit module
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

    if (params.NeumeEdit !== undefined || params.TextView !== undefined) {
      // Set up display for edit button
      let parent = document.getElementById('dropdown_toggle');
      let editItem = document.createElement('a');
      editItem.classList.add('navbar-item');
      let editButton = document.createElement('button');
      editButton.classList.add('button');
      editButton.id = 'edit_mode';
      editButton.textContent = 'Edit MEI';
      $('#edit_mode').on('click', () => {
        this.initEditMode();
      });
      editItem.appendChild(editButton);
      parent.appendChild(editItem);
    }

    if (params.NeumeEdit !== undefined) {
      this.NeumeEdit = new params.NeumeEdit(this);
    }
    if (params.TextView !== undefined) {
      this.textView = new params.TextView(this);
      if (params.TextEdit !== undefined) {
        this.textEdit = new params.TextEdit(this);
      }
    }
  }

  /**
   * initialize basic edit mode features
   * called when the edit MEI button is clicked
   */
  initEditMode () {
    EditControls.initNavbar(this);
    EditControls.initUndoRedoPanel(this);
    this.dragHandler = new DragHandler(this.neonView, '#svg_group');
    Select.setSelectHelperObjects(this, this.dragHandler);
    Select.clickSelect('#mei_output, #mei_output use');
    Select.dragSelect('#svg_group');
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
      this.view.updateCallbacks.forEach(callback => callback());
    });
  }

  /**
   * Same as updateForCurrentPage but returns a promise.
   * @see NeonView.updateForCurrentPage
   */
  updateForCurrentPagePromise () {
    let pageNo = this.view.getCurrentPage();
    return Promise.resolve(this.core.getSVG(pageNo).then((svg) => {
      this.view.updateSVG(svg, pageNo);
    }));
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
