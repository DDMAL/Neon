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
   */
  constructor (params) {
    if (params.mode === 'single' || params.mode === 'iiif') {
      this.mode = params.mode;
    } else {
      console.error('Invalid mode');
    }

    if (this.mode === 'single') {
      this.view = new params.View(params.Display, params.options.image);
    } else {
      this.view = new params.View(params.Display, params.options.manifest);
    }

    this.core = new NeonCore(params.options.meiMap);

    this.display = this.view.display;
    // this.info = new params.Info();

    if (params.edit !== undefined) {
      this.edit = new params.Edit();
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
    }
  }

  start () {
    this.updateForCurrentPage();
  }

  updateForCurrentPage () {
    let pageNo = this.view.getCurrentPage();
    // load pages
    let parser = new DOMParser();
    let svg = parser.parseFromString(this.core.getSVG(pageNo), 'image/svg+xml')
      .documentElement;
    this.view.updateSVG(svg, pageNo);
  }
}
