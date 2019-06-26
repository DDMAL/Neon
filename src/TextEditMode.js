import { unselect, selectBBox } from './utils/SelectTools.js';
import DragHandler from './utils/DragHandler.js';

const $ = require('jquery');

/**
 * A Text editing module that works with the SingleView and DivaView modules
 */
export default class TextEditMode {
  /**
   * Constructor for a TextEdit
   */

  constructor (neonView) {
    this.neonView = neonView;
    document.getElementById('edit_mode').addEventListener('click', () => {
      this.setTextEdit();
      if ($('#displayBBox').is(':checked')) {
        this.initSelectByBBoxButton();
      }
    });
  }

  /**
  * set text to edit mode
  */
  setTextEdit () {
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
  * if neumeedit mode is there, add it to the bar with the other select by buttons
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
      button.on('click', this.selectByBBoxHandler);
    } else {
      let block = $('#undo').parent('.control');
      block.append("<p class='control'><button class='button sel-by' id='selByBBox'>BBox</button></p>");
      let button = $('#selByBBox');
      button.addClass('is-active');
      button.css('display', 'none');
    }
  }

  /**
   * initialize select by bbox mode
   */
  selectByBBoxHandler () {
    if (!$('#selByBBox').hasClass('is-active')) {
      unselect();
      $('#moreEdit').empty();
      $('#selByBBox').addClass('is-active');
      $('#selByNc').removeClass('is-active');
      $('#selByNc').removeClass('is-active');
      $('#selByStaff').removeClass('is-active');
      $('#selBySyl').removeClass('is-active');

      let rects = Array.from($('.sylTextRect-display'));
      rects.forEach(rect => {
        $(rect).off('click');
        $(rect).on('click', () => {
          if ($('#selByBBox').hasClass('is-active')) {
            console.log(this.neonView);
            selectBBox(rect, new DragHandler(this.neonView, '.sylTextRect-display'));
          }
        });
      });
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
      this.neonView.edit(editorAction, this.neonView.view.getCurrentPage()).then((response) => {
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
