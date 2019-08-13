/** @module InfoModule */

import NeonView from './NeonView';

/**
 * Class that manages getting information for elements in Neon from Verovio.
 */
class InfoModule {
  neonView: NeonView;

  /**
   * A constructor for an InfoModule.
   * @param {NeonView} neonView - The NeonView parent.
   */
  constructor (neonView: NeonView) {
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
    try {
      document.getElementsByClassName('active-page')[0]
        .querySelectorAll('.neume,.custos,.clef')
        .forEach(node => {
          node.addEventListener('mouseover', this.updateInfo.bind(this));
        });
    } catch (e) {}
  }

  /**
   * Stop listeners for the InfoModule.
   */
  stopListeners () {
    document.querySelectorAll('.neume,.custos,.clef').forEach(node => {
      node.removeEventListener('mouseover', this.updateInfo.bind(this));
    });
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
  async updateInfo (event: MouseEvent) {
  // For now, since Clefs do not have their own element tag in mei4, there is not a way to select the <g> element
  // So we will simply return if ID does not exist for now
    let id = (<HTMLElement>event.currentTarget).id;
    if (id === '') {
      Array.from(document.getElementById('neume_info').children).forEach(child => {
        child.remove();
      });
      console.log('No id!');
      return;
    }

    let element = document.getElementById(id);
    var classRe = /neume|nc|clef|custos|staff/;
    let elementClass = element.getAttribute('class').match(classRe)[0];
    var body = '';
    var attributes;

    // Gets the pitches depending on element type and
    switch (elementClass) {
      case 'neume':
        // Select neume components of selected neume
        var ncs = <NodeListOf<SVGGraphicsElement>>element.querySelectorAll('.nc');
        var contour = await this.getContour(ncs);
        if (contour === 'Clivis') {
          var attr: any = await this.neonView.getElementAttr(ncs[0].id, this.neonView.view.getCurrentPageURI());
          if (attr.ligated) {
            contour = 'Ligature';
          }
        }
        var pitches = await this.getPitches(ncs);

        pitches = pitches.trim().toUpperCase();
        body = 'Shape: ' + (contour === undefined ? 'Compound' : contour) + '\r\n' +
                'Pitch(es): ' + pitches;
        break;
      case 'custos':
        attributes = await this.neonView.getElementAttr(id, this.neonView.view.getCurrentPageURI());
        body += 'Pitch: ' + (attributes.pname).toUpperCase() + attributes.oct;
        break;
      case 'clef':
        attributes = await this.neonView.getElementAttr(id, this.neonView.view.getCurrentPageURI());
        body += 'Shape: ' + attributes.shape + '\r\n' +
                'Line: ' + attributes.line;
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
  async getPitches (ncs: Iterable<SVGGraphicsElement>): Promise<string> {
    var pitches = '';
    for (let nc of ncs) {
      var attributes: any = await this.neonView.getElementAttr(nc.id, this.neonView.view.getCurrentPageURI());
      pitches += attributes.pname + attributes.oct + ' ';
    }
    return pitches;
  }

  /**
   * Get the contour of a neume.
   * @param {array.<SVGGraphicsElement>} ncs - neume components in the neume.
   */
  async getContour (ncs: Iterable<SVGGraphicsElement>) {
    var contour = '';
    var previous: any = null;
    for (let nc of ncs) {
      var attributes: any = await this.neonView.getElementAttr(nc.id, this.neonView.view.getCurrentPageURI());
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
    if (neumeGroups.get(contour) === undefined) {
      console.warn('Unknown contour: ' + contour);
    }
    return neumeGroups.get(contour);
  }

  /**
   * Show and update the info box.
   * @param {string} title - The info box title.
   * @param {string} body - The info box contents.
   */
  updateInfoModule (title: string, body: string) {
    document.getElementsByClassName('message-header')[0].querySelector('p')
      .textContent = title;
    (<HTMLElement>document.getElementsByClassName('message-body')[0]).innerText = body;

    if ((<HTMLInputElement>document.getElementById('displayInfo')).checked) {
      (<HTMLElement>document.getElementsByClassName('message')[0]).style.display = '';
    }
  }

  /**
   * Convert a pitch name (a-g) to a number (where c is 1, d is 2 and b is 7).
   * @param {string} pname - The pitch name.
   * @returns {number}
   */
  pitchNameToNum (pname: string): number {
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
  getContourByValue (value: string): string {
    for (let [cont, v] of neumeGroups.entries()) {
      if (v === value) {
        return cont;
      }
    }
  }
}

/**
 * Map of contours to neume names.
 */
var neumeGroups = new Map(
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
  document.getElementById('displayInfo').addEventListener('click', updateInfoVisibility);
}

function startInfoVisibility () {
  document.getElementById('neume_info').innerHTML =
    "<article class='message'><div class='message-header'><p></p></div>" +
      "<div class='message-body'></div>";
  document.getElementById('neume_info').classList.add('is-invisible');
}

/**
 * Update the visibility of infoBox
 */
function updateInfoVisibility () {
  let neumeInfo = document.getElementById('neume_info');
  if ((<HTMLInputElement>document.getElementById('displayInfo')).checked) {
    neumeInfo.classList.remove('is-invisible');
  } else {
    neumeInfo.classList.add('is-invisible');
  }
}

export { InfoModule as default };
