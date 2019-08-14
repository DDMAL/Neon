import * as Notification from './utils/Notification';
import NeonView from './NeonView';
import { unselect } from './utils/SelectTools';
import { updateHighlight } from './DisplayPanel/DisplayControls';
import { TextViewInterface } from './Interfaces';

/** @module TextView */

/*
 * Class that manages getting the text for syllables in Neon from the mei file
 */
class TextView implements TextViewInterface {
  neonView: NeonView;
  notificationSent: boolean;
  /**
   * A constructor for a TextView.
   * @param {NeonView} neonView = The NeonView parent.
   */
  constructor (neonView: NeonView) {
    this.neonView = neonView;
    this.notificationSent = false;

    // add checkbox to enable/disable the view
    let block = document.getElementById('extensible-block');
    let textLabel = document.createElement('label');
    let bboxLabel = document.createElement('label');
    let textButton = document.createElement('input');
    let bboxButton = document.createElement('input');
    textLabel.classList.add('checkbox');
    bboxLabel.classList.add('checkbox');
    textLabel.textContent = 'Display Text: ';
    bboxLabel.textContent = 'Display Text BBoxes: ';
    textButton.classList.add('checkbox');
    bboxButton.classList.add('checkbox');
    textButton.id = 'displayText';
    textButton.type = 'checkbox';
    bboxButton.id = 'displayBBox';
    bboxButton.type = 'checkbox';
    textButton.checked = false;
    bboxButton.checked = false;
    textLabel.appendChild(textButton);
    bboxLabel.appendChild(bboxButton);
    block.prepend(bboxLabel);
    block.prepend(textLabel);

    this.setTextViewControls();
    this.neonView.view.addUpdateCallback(this.updateTextViewVisibility.bind(this));
    this.neonView.view.addUpdateCallback(this.updateBBoxViewVisibility.bind(this));
  }

  /**
  * set listeners on textview visibility checkbox
  */
  setTextViewControls () {
    this.updateTextViewVisibility();
    this.updateBBoxViewVisibility();
    document.getElementById('displayText')
      .addEventListener('click', textViewVis.bind(this));
    document.getElementById('displayBBox')
      .addEventListener('click', bboxViewVis.bind(this));

    function textViewVis () { this.updateTextViewVisibility(); }
    function bboxViewVis () { this.updateBBoxViewVisibility(); }
  }

  /**
   * update visibility of text bounding boxes
   */
  updateBBoxViewVisibility () {
    if ((<HTMLInputElement>document.getElementById('displayBBox')).checked) {
      document.querySelectorAll('.sylTextRect').forEach(rect => {
        rect.classList.add('sylTextRect-display');
        rect.classList.remove('sylTextRect');
      });
      document.querySelectorAll('.syl.selected .sylTextRect-display')
        .forEach((rect: HTMLElement) => { rect.style.fill = 'red'; });

      if (this.neonView.getUserMode() !== 'viewer' && this.neonView.TextEdit !== undefined) {
        this.neonView.TextEdit.initSelectByBBoxButton();
      }
    } else {
      if ((document.getElementById('selByBBox') !== null) &&
        document.getElementById('selByBBox').classList.contains('is-active')) {
        unselect();
        document.getElementById('selByBBox').classList.remove('is-active');
        document.getElementById('selBySyl').classList.add('is-active');
      }
      document.querySelectorAll('.sylTextRect-display').forEach(rect => {
        rect.classList.add('sylTextRect');
        rect.classList.remove('sylTextRect-display');
      });
      document.querySelectorAll('.syl.selected .sylTextRect').forEach((rect: HTMLElement) => {
        rect.style.fill = 'none';
      });
      try {
        document.getElementById('selByBBox').style.display = 'none';
      } catch (e) {}
    }
    updateHighlight();
  }

  /**
  * update the visibility of the textview box
  * and add the event listeners to make sure the syl highlights when moused over
  */
  updateTextViewVisibility () {
    if ((<HTMLInputElement>document.getElementById('displayText')).checked) {
      let sylText = document.getElementById('syl_text');
      sylText.style.display = '';
      sylText.innerHTML = '<p>' + this.getSylText() + '</p>';
      let spans = sylText.querySelectorAll('p > span');
      spans.forEach(span => {
        let syllable = document.getElementById(span.className);
        let syl = syllable.querySelector('.syl');
        let text = syl.querySelector('text');
        let rect = syl.querySelector('rect');
        if (text.classList.length === 0) {
          text.classList.add('text');
        }

        span.addEventListener('mouseover', () => {
          syllable.classList.add('selected');
          syllable.querySelectorAll('.neume').forEach(neume => {
            neume.classList.add('selected');
          });
          if (rect !== null) {
            rect.setAttribute('fill', '#d00');
          }
          // syl.attr('fill', '#ffc7c7');
          // this.highlightBoundingBox(span);
        });

        span.addEventListener('mouseleave', () => {
          syllable.classList.remove('selected');
          syllable.querySelectorAll('.neume').forEach(neume => {
            neume.classList.remove('selected');
          });
          if (rect !== null) {
            if (syllable.style.fill !== 'rgb(0, 0, 0)') { // syllable.getAttributeNS('http://www.w3.org/2000/SVG', 'fill');
              rect.setAttribute('fill', syllable.getAttribute('fill'));
            } else {
              rect.style.fill = 'blue';
            }
          }
          // syl.attr('fill', null);
          // this.removeBoundingBox(span);
        });
      });
      if (this.neonView.getUserMode() !== 'viewer' && this.neonView.TextEdit !== undefined) {
        this.neonView.TextEdit.initTextEdit();
      }
    } else {
      document.getElementById('syl_text').style.display = 'none';
    }
  }

  /**
   * Get the syllable text of the loaded file
   * @returns {string}
   */
  getSylText (): string {
    var lyrics = '';
    let uniToDash = /\ue551/g;
    let syllables = document.querySelectorAll('.active-page .syllable');
    syllables.forEach(syllable => {
      if (syllable.querySelector('.syl') !== null) {
        let syl = syllable.querySelector('.syl');
        lyrics += "<span class='" + syllable.id + "'>";
        if (syl.textContent.trim() === '') {
          lyrics += '&#x25CA; ';
        } else {
          Array.from(syl.children[0].children[0].children).forEach(text => {
            lyrics += text.textContent !== '' ? text.textContent : '&#x25CA; ';
          });
        }
        lyrics += ' </span>';
      }
    });
    if (!this.notificationSent) {
      Notification.queueNotification('Blank syllables are represented by &#x25CA;!');
      this.notificationSent = true;
    }
    return lyrics.replace(uniToDash, '-');
  }
}

export { TextView as default };
