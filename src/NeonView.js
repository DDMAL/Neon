import NeonCore from './NeonCore.js';

/**
 * NeonView class. Manages the other modules of Neon and communicates with
 * NeonCore.
 */
export default class NeonView {
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
      this.name = params.options.name;
    } else {
      this.view = new params.View(this, params.Display, params.options.manifest);
    }

    this.core = new NeonCore(params.options.meiMap, this.name);

    this.display = this.view.display;
    this.InfoModule = params.Info;
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

  start () {
    this.core.initDb().then(() => { this.updateForCurrentPage(); });
  }

  updateForCurrentPage () {
    let pageNo = this.view.getCurrentPage();
    // load pages
    this.core.getSVG(pageNo).then((svg) => {
      this.view.updateSVG(svg, pageNo);
    });
  }

  redo () {
    return this.core.redo(this.view.getCurrentPage());
  }

  undo () {
    return this.core.undo(this.view.getCurrentPage());
  }

  getUserMode () {
    if (this.editor === undefined) {
      return 'viewer';
    } else {
      return this.editor.getUserMode();
    }
  }

  edit (action, pageNo) {
    let editPromise = new Promise((resolve) => {
      resolve(this.core.edit(action, pageNo));
    });
    return editPromise;
  }

  getElementAttr (elementID, pageNo) {
    let elementPromise = new Promise((resolve, reject) => {
      resolve(this.core.getElementAttr(elementID, pageNo));
    });
    return elementPromise;
  }

  save () {
    this.core.updateDatabase();
  }

  getPageURI (pageNo) {
    let mei = this.core.getMEI(pageNo);
    return 'data:application/mei+xml;charset=utf-8,' + encodeURIComponent(mei);
  }

  getPageMEI (pageNo) {
    return this.core.getMEI(pageNo);
  }
}
