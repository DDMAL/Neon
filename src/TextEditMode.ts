import { unselect } from './utils/SelectTools';
import DragHandler from './utils/DragHandler';
import NeonView from './NeonView';
import { setSelectHelperObjects, dragSelect, clickSelect } from './utils/Select';
import { setGroupingHighlight } from './utils/Color';

/**
 * A Text editing module that works with the SingleView and DivaView modules
 */
export default class TextEditMode {
  dragHandler: DragHandler;
  neonView: NeonView;

  /**
   * Constructor for a TextEdit
   * @param {NeonView} neonView
   */
  constructor (neonView: NeonView) {
    this.neonView = neonView;
    this.initEditModeControls();
  }

  /**
   * set listener on edit mode button
   */
  initEditModeControls () {
    document.getElementById('edit_mode').addEventListener('click', () => {
      this.initTextEdit();
      if ((<HTMLInputElement>document.getElementById('displayBBox')).checked) {
        this.initSelectByBBoxButton();
      }
    });
  }

  /**
  * set text to edit mode
  */
  initTextEdit () {
    let spans = document.getElementById('syl_text').querySelectorAll('p > span');
    spans.forEach(span => {
      span.removeEventListener('click', updateSylText.bind(this));
      span.addEventListener('click', updateSylText.bind(this));
      function updateSylText () {
        this.updateSylText(span);
      }
    });
  }

  /**
  * add the selectByRect button
  * if neume edit mode is there, add it to the bar with the other select by buttons
  * otherwise add an invisible button
  * since the only edit mode is selectByRect in that case
  */
  initSelectByBBoxButton () {
    if (this.neonView.NeumeEdit !== undefined) {
      let selByBBox = document.getElementById('selByBBox');
      if (selByBBox) {
        selByBBox.style.display = '';
        return;
      }

      let block = document.getElementById('selBySyl')
        .closest('.control')
        .closest('.field');
      let p = document.createElement('p');
      p.classList.add('control');
      let button = document.createElement('button');
      button.classList.add('button', 'sel-by');
      button.id = 'selByBBox';
      button.textContent = 'BBox';
      p.appendChild(button);
      block.appendChild(p);
      button.addEventListener('click', selBySylListener.bind(this));
      document.body.addEventListener('keydown', (evt) => {
        if (evt.key === '5') {
          if (document.getElementById('selByBBox').style.display === '') {
            selBySylListener.bind(this)();
          }
        }
      });
      this.neonView.view.addUpdateCallback(this.addBBoxListeners.bind(this));
    } else {
      let block = document.getElementById('undo').closest('.control');
      let p = document.createElement('p');
      p.classList.add('control');
      let button = document.createElement('button');
      button.classList.add('button', 'sel-by');
      button.id = 'selByBBox';
      button.textContent = 'BBox';
      p.appendChild(button);
      block.appendChild(p);
      button.classList.add('is-active');
      button.style.display = 'none';
      this.addBBoxListeners();
      this.neonView.view.addUpdateCallback(this.addBBoxListeners.bind(this));
    }
  }

  /**
   * initialize select by bbox mode
   */
  addBBoxListeners () {
    if (document.getElementById('selByBBox').classList.contains('is-active')) {
      unselect();
      if (this.neonView.NeumeEdit === undefined) {
        // just in case
        this.dragHandler = new DragHandler(this.neonView, '.sylTextRect-display');
        setSelectHelperObjects(this.neonView, this.dragHandler);
        if (this.neonView.view.constructor.name === 'SingleView') {
          clickSelect('#mei_output, #mei_output rect');
          dragSelect('#svg_group');
        } else {
          clickSelect('.active-page > svg > svg, .active-page > svg > svg rect');
          dragSelect('.active-page svg');
        }
      }
    }
  }

  /**
  * Update the text for a single syl element
  * @param {HTMLElement} span
  */
  updateSylText (span: HTMLSpanElement) {
    let orig = formatRaw(span.textContent);
    let corrected = window.prompt('', orig);
    if (corrected !== null && corrected !== orig) {
      let editorAction = {
        'action': 'setText',
        'param': {
          'elementId': [...span.classList.entries()].filter(e => e[1] !== 'text-select')[0][1],
          'text': corrected
        }
      };
      this.neonView.edit(editorAction, this.neonView.view.getCurrentPageURI()).then((response) => {
        if (response) {
          this.neonView.updateForCurrentPage();
        }
      });
    }
  }
}

/**
 * Format a string for prompting the user.
 * @param {string} rawString
 * @returns {string}
 */
function formatRaw (rawString: string): string {
  let removeSymbol = /\u{25CA}/u;
  return rawString.replace(removeSymbol, '').trim();
}

function selBySylListener () {
  if (!document.getElementById('selByBBox').classList.contains('is-active')) {
    unselect();
    try {
      document.getElementById('moreEdit').innerHTML = '';
    } catch (e) {}
    document.getElementById('selByBBox').classList.add('is-active');
    try {
      document.getElementById('selByNc').classList.remove('is-active');
      document.getElementById('selByNeume').classList.remove('is-active');
      document.getElementById('selByStaff').classList.remove('is-active');
      document.getElementById('selBySyl').classList.remove('is-active');
    } catch (e) {}
    try {
      if (document.querySelector('.highlight-selected').id === 'highlight-selection') {
        setGroupingHighlight('syllable');
      }
    } catch (e) {}
  }
  this.addBBoxListeners();
}
