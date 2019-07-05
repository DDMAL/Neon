import { unselect } from './utils/SelectTools.js';
import DragHandler from './utils/DragHandler.js';
import { setSelectHelperObjects, dragSelect, clickSelect } from './utils/Select.js';

const $ = require('jquery');

/**
 * A Text editing module that works with the SingleView and DivaView modules
 */
export default class TextEditMode {
  /**
   * Constructor for a TextEdit
   * @param {NeonView} neonView
   */
  constructor (neonView) {
    this.neonView = neonView;
    this.initEditModeControls();
  }

  /**
   * set listener on edit mode button
   */
  initEditModeControls () {
    document.getElementById('edit_mode').addEventListener('click', () => {
      this.initTextEdit();
      if ($('#displayBBox').is(':checked')) {
        this.initSelectByBBoxButton();
      }
    });
  }

  /**
  * set text to edit mode
  */
  initTextEdit () {
    let spans = Array.from($('#syl_text').children('p').children('span'));
    spans.forEach(span => {
      $(span).off('click');
      $(span).on('click', () => {
        this.updateSylText(span);
      });
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
      if ($('#selByBBox').length) {
        $('#selByBBox').css('display', '');
        return;
      }
      let block = $('#selBySyl').parent('.control').parent('.field');
      block.append("<p class='control'><button class='button sel-by' id='selByBBox'>BBox</button></p>");
      let button = $('#selByBBox');
      button.on('click', () => {
        if (!$('#selByBBox').hasClass('is-active')) {
          unselect();
          $('#moreEdit').empty();
          $('#selByBBox').addClass('is-active');
          $('#selByNc').removeClass('is-active');
          $('#selByNeume').removeClass('is-active');
          $('#selByStaff').removeClass('is-active');
          $('#selBySyl').removeClass('is-active');
        }
        this.addBBoxListeners();
      }).bind(this);
      this.neonView.view.addUpdateCallback(this.addBBoxListeners.bind(this));
    } else {
      let block = $('#undo').parent('.control');
      block.append("<p class='control'><button class='button sel-by' id='selByBBox'>BBox</button></p>");
      let button = $('#selByBBox');
      button.addClass('is-active');
      button.css('display', 'none');
      this.addBBoxListeners();
      this.neonView.addUpdateCallback(this.addBBoxListeners.bind(this));
    }
  }

  /**
   * initialize select by bbox mode
   */
  addBBoxListeners () {
    if ($('#selByBBox').hasClass('is-active')) {
      unselect();
      this.dragHandler = new DragHandler(this.neonView, '.sylTextRect-display');
      if (this.neonView.NeumeEdit === undefined) {
        // just in case
        setSelectHelperObjects(this.neonView, this.dragHandler);
        clickSelect('#mei_output, #mei_output rect');
        dragSelect('#svg_group');
      }
    }
  }

  /**
  * Update the text for a single syl element
  * @param {HTMLElement} span
  */
  updateSylText (span) {
    let orig = formatRaw($(span).html());
    let corrected = window.prompt('', orig);
    if (corrected !== null && corrected !== orig) {
      let editorAction = {
        'action': 'setText',
        'param': {
          'elementId': $('#' + $(span).attr('class').replace('syl-select', '').trim()).attr('id'),
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
function formatRaw (rawString) {
  let removeSymbol = /\u{25CA}/u;
  return rawString.replace(removeSymbol, '').trim();
}
