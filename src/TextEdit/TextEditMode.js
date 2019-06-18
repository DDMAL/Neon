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
    $('#edit_mode').on('click', () => {
      this.setTextEdit();
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
