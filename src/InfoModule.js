/** @module InfoModule */

const $ = require('jquery');

/**
 * Class that manages getting information for elements in Neon from Verovio.
 */
class InfoModule {
  /**
   * A constructor for an InfoModule.
   * @param {NeonView} neonView - The NeonView parent.
   */
  constructor (neonView) {
    this.neonView = neonView;
    // Add info box enable/disable check box
    let block = document.getElementById('extensible-block');
    let label = document.createElement('label');
    label.classList.add('checkbox');
    label.textContent = 'Display Info: ';
    let input = document.createElement('input');
    input.classList.add('checkbox');
    input.id = 'displayInfo';
    input.type = 'checkbox';
    input.checked = false;
    label.appendChild(input);
    block.prepend(label);

    this.neonView.view.addUpdateCallback(this.resetInfoListeners.bind(this));
    setInfoControls();
    this.resetInfoListeners();
  }

  /**
   * Set listeners for the InfoModule.
   */
  infoListeners () {
    $('.active-page').find('.neume,.custos,.clef').on('mouseover', this.updateInfo.bind(this));
  }

  /**
   * Stop listeners for the InfoModule.
   */
  stopListeners () {
    $('.neume,.custos,.clef').off('mouseover', this.updateInfo.bind(this));
  }

  /**
   * Restart listeners for the InfoModule.
   */
  resetInfoListeners () {
    this.stopListeners();
    this.infoListeners();
  }

  /**
   * Get updated info for the calling element based on its element type.
   * Makes calls to NeonCore to get the information necessary.
   */
  async updateInfo (event) {
  // For now, since Clefs do not have their own element tag in mei4, there is not a way to select the <g> element
  // So we will simply return if ID does not exist for now
    let id = event.currentTarget.id;
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
        var contour = await this.getContour(ncs);
        if (contour === 'Clivis') {
          var attr = await this.neonView.getElementAttr($(ncs[0])[0].id, this.neonView.view.getCurrentPageURI());
          if (attr.ligated) {
            contour = 'Ligature';
          }
        }
        var pitches = await this.getPitches(ncs);

        pitches = pitches.trim().toUpperCase();
        body = 'Shape: ' + (contour === undefined ? 'Compound' : contour) + '<br/>' +
                'Pitch(es): ' + pitches;
        break;
      case 'custos':
        attributes = await this.neonView.getElementAttr(id, this.neonView.view.getCurrentPageURI());
        body += 'Pitch: ' + (attributes.pname).toUpperCase() + attributes.oct;
        break;
      case 'clef':
        attributes = await this.neonView.getElementAttr(id, this.neonView.view.getCurrentPageURI());
        body += 'Shape: ' + attributes.shape + '<br/>' +
                'Line: ' + attributes.line;
        break;
      case 'staff':
        elementClass = 'clef';
        var staffDefAttributes = await this.neonView.getElementStaffDef(id);
        body = 'Shape: ' + staffDefAttributes['clef.shape'] + '<br/>' +
                'Line: ' + staffDefAttributes['clef.line'];
        break;
      default:
        body += 'nothing';
        break;
    }
    this.updateInfoModule(elementClass, body);
  }

  /**
   * Get the individual pitches of a neume.
   * @param {array.<SVGGraphicsElement>} ncs - neume components in the neume.
   */
  async getPitches (ncs) {
    var pitches = '';
    for (let nc of ncs) {
      var attributes = await this.neonView.getElementAttr(nc.id, this.neonView.view.getCurrentPageURI());
      pitches += attributes.pname + attributes.oct + ' ';
    }
    return pitches;
  }

  /**
   * Get the contour of a neume.
   * @param {array.<SVGGraphicsElement>} ncs - neume components in the neume.
   */
  async getContour (ncs) {
    var contour = '';
    var previous = null;
    for (let nc of ncs) {
      var attributes = await this.neonView.getElementAttr(nc.id, this.neonView.view.getCurrentPageURI());
      if (previous !== null) {
        if (previous.oct > attributes.oct) {
          contour += 'd';
        } else if (previous.oct < attributes.oct) {
          contour += 'u';
        } else {
          if (this.pitchNameToNum(previous.pname) < this.pitchNameToNum(attributes.pname)) {
            contour += 'u';
          } else if (this.pitchNameToNum(previous.pname) > this.pitchNameToNum(attributes.pname)) {
            contour += 'd';
          } else {
            contour += 's';
          }
        }
      }
      previous = attributes;
    }
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
  updateInfoModule (title, body) {
    $('.message-header').children('p').html(title);
    $('.message-body').html(body);

    if ($('#displayInfo').is(':checked')) {
      $('.message').css('display', '');
    }
  }

  /**
   * Convert a pitch name (a-g) to a number (where c is 1, d is 2 and b is 7).
   * @param {string} pname - The pitch name.
   * @returns {number}
   */
  pitchNameToNum (pname) {
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
  getContourByValue (value) {
    for (let [cont, v] of InfoModule.neumeGroups.entries()) {
      if (v === value) {
        return cont;
      }
    }
  }
}

/**
 * Map of contours to neume names.
 */
InfoModule.neumeGroups = new Map(
  [['', 'Punctum'], ['u', 'Pes'], ['d', 'Clivis'], ['uu', 'Scandicus'], ['ud', 'Torculus'], ['du', 'Porrectus'], ['s', 'Distropha'], ['ss', 'Tristopha'],
    ['sd', 'Pressus'], ['dd', 'Climacus'], ['ddu', 'Climacus resupinus'], ['udu', 'Torculus resupinus'], ['dud', 'Porrectus flexus'],
    ['udd', 'Pes subpunctis'], ['uud', 'Scandicus flexus'], ['uudd', 'Scandicus subpunctis'], ['dudd', 'Porrectus subpunctis']]
);

/**
 * Set listener on info visibility checkbox.
 */
function setInfoControls () {
  startInfoVisibility();
  updateInfoVisibility();
  $('#displayInfo').click(updateInfoVisibility);
}

function startInfoVisibility () {
  $('#neume_info').append("<article class='message'><div class='message-header'><p></p></div>" +
            "<div class='message-body'></div>");
  $('#neume_info').addClass('is-invisible');
}

/**
 * Update the visibility of infoBox
 */
function updateInfoVisibility () {
  if ($('#displayInfo').is(':checked')) {
    $('#neume_info').removeClass('is-invisible');
  } else {
    $('#neume_info').addClass('is-invisible');
  }
}

export { InfoModule as default };
