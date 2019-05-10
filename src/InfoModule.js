import { setInfoControls } from './Controls.js';

const $ = require('jquery');

export default class InfoModule {
  constructor (neonView) {
    this.neonView = neonView;
    // Add info box enable/disable check box
    let block = document.getElementById('extensible-block');
    block.innerHTML = '<label class="checkbox">Display Info:&nbsp;' +
      '<input class="checkbox" id="displayInfo" type="checkbox" checked="checked"/></label>' +
      block.innerHTML;

    InfoModule.core = this.neonView.core;
    this.neonView.view.addUpdateCallback(this.resetInfoListeners);
    setInfoControls();
  }

  resetInfoListeners () {
    $('.neume,.custos,.clef').off('mouseover', InfoModule.updateInfo);
    $('.active-page').find('.neume,.custos,.clef').on('mouseover', InfoModule.updateInfo);
  }

  static updateInfo () {
  // For now, since Clefs do not have their own element tag in mei4, there is not a way to select the <g> element
  // So we will simply return if ID does not exist for now
    let id = this.id;
    if (id === '') {
      $('#neume_info').empty();
      console.log('No id!');
      return;
    }

    var element = $('#' + id);
    var classRe = /neume|nc|clef|custos|staff/;
    var elementClass = element.attr('class').match(classRe)[0];
    var body = '';
    var attributes;

    // Gets the pitches depending on element type and
    switch (elementClass) {
      case 'neume':
        // Select neume components of selected neume
        var ncs = element.children('.nc');
        var contour = InfoModule.getContour(ncs);
        if (contour === 'Clivis') {
          var attr = InfoModule.core.getElementAttr($(ncs[0])[0].id);
          if (attr.ligated) {
            contour = 'Ligature';
          }
        }
        var pitches = InfoModule.getPitches(ncs);

        pitches = pitches.trim().toUpperCase();
        body = 'Shape: ' + (contour === undefined ? 'Compound' : contour) + '<br/>' +
                'Pitch(es): ' + pitches;
        break;
      case 'custos':
        attributes = InfoModule.core.getElementAttr(id);
        body += 'Pitch: ' + (attributes.pname).toUpperCase() + attributes.oct;
        break;
      case 'clef':
        attributes = InfoModule.core.getElementAttr(id);
        body += 'Shape: ' + attributes.shape + '<br/>' +
                'Line: ' + attributes.line;
        break;
      case 'staff':
        elementClass = 'clef';
        var staffDefAttributes = InfoModule.core.getElementStaffDef(id);
        body = 'Shape: ' + staffDefAttributes['clef.shape'] + '<br/>' +
                'Line: ' + staffDefAttributes['clef.line'];
        break;
      default:
        body += 'nothing';
        break;
    }
    InfoModule.updateInfoModule(elementClass, body);
  }

  /**
     * Get the individual pitches of a neume.
     * @param {array.<SVGSVGElement>} ncs - neume components in the neume.
     */
  static getPitches (ncs) {
    var pitches = '';
    ncs.each(function () {
      var attributes = InfoModule.core.getElementAttr(this.id);
      pitches += attributes.pname + attributes.oct + ' ';
    });
    return pitches;
  }

  /**
     * Get the contour of a neume.
     * @param {array.<SVGSVGElement>} ncs - neume components in the neume.
     */
  static getContour (ncs) {
    var contour = '';
    var previous = null;
    ncs.each(function () {
      var attributes = InfoModule.core.getElementAttr(this.id);
      if (previous !== null) {
        if (previous.oct > attributes.oct) {
          contour += 'd';
        } else if (previous.oct < attributes.oct) {
          contour += 'u';
        } else {
          if (InfoModule.pitchNameToNum(previous.pname) < InfoModule.pitchNameToNum(attributes.pname)) {
            contour += 'u';
          } else if (InfoModule.pitchNameToNum(previous.pname) > InfoModule.pitchNameToNum(attributes.pname)) {
            contour += 'd';
          } else {
            contour += 's';
          }
        }
      }
      previous = attributes;
    });
    if (InfoModule.neumeGroups.get(contour) === undefined) {
      console.warn('Unknown contour: ' + contour);
    }
    return InfoModule.neumeGroups.get(contour);
  }

  /**
     * Show and update the info box.
     * @param {string} title - The info box title.
     * @param {string} body - The info box contents.
     */
  static updateInfoModule (title, body) {
    if ($('#displayInfo').is(':checked')) {
      $('.message').css('display', '');
      $('.message-header').children('p').html(title);
      $('.message-body').html(body);
    }
    // Setting up listener for dismissing message
    $('#notification-delete').on('click', function () {
      $('.message').css('display', 'none');
    });
  }

  /**
     * Convert a pitch name (a-g) to a number (where c is 1, d is 2 and b is 7).
     * @param {string} pname - The pitch name.
     * @returns {number}
     */
  static pitchNameToNum (pname) {
    switch (pname) {
      case 'c':
        return 1;
      case 'd':
        return 2;
      case 'e':
        return 3;
      case 'f':
        return 4;
      case 'g':
        return 5;
      case 'a':
        return 6;
      case 'b':
        return 7;
      default:
        console.log('Unknown pitch name');
    }
  }

  /**
     * Find the contour of an neume grouping based on the grouping name.
     * @param {string} value - the value name.
     * @returns {string}
     */
  static getContourByValue (value) {
    for (let [cont, v] of InfoModule.neumeGroups.entries()) {
      if (v === value) {
        return cont;
      }
    }
  }
}

InfoModule.neumeGroups = new Map(
  [['', 'Punctum'], ['u', 'Pes'], ['d', 'Clivis'], ['uu', 'Scandicus'], ['ud', 'Torculus'], ['du', 'Porrectus'], ['s', 'Distropha'], ['ss', 'Tristopha'],
    ['sd', 'Pressus'], ['dd', 'Climacus'], ['ddu', 'Climacus resupinus'], ['udu', 'Torculus resupinus'], ['dud', 'Porrectus flexus'],
    ['udd', 'Pes subpunctis'], ['uud', 'Scandicus flexus'], ['uudd', 'Scandicus subpunctis'], ['dudd', 'Porrectus subpunctis']]
);
