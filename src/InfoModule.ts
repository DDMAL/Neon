/** @module InfoModule */

import NeonView from './NeonView';
import { InfoInterface } from './Interfaces';
import { Attributes } from './Types';

/**
 * Map of contours to neume names.
 */
const neumeGroups = new Map(
  [['', 'Punctum'], ['u', 'Pes'], ['d', 'Clivis'], ['uu', 'Scandicus'], ['ud', 'Torculus'], ['du', 'Porrectus'], ['s', 'Distropha'], ['ss', 'Tristopha'],
    ['sd', 'Pressus'], ['dd', 'Climacus'], ['ddu', 'ClimacusResupinus'], ['udu', 'TorculusResupinus'], ['dud', 'PorrectusFlexus'],
    ['udd', 'PesSubpunctis'], ['uud', 'ScandicusFlexus'], ['uudd', 'ScandicusSubpunctis'], ['dudd', 'PorrectusSubpunctis']]
);

function startInfoVisibility (): void {
  document.getElementById('neume_info').innerHTML =
    `<div class="info-bubble-container">
      <div class="info-bubble-header">Element Info</div>
      <div class="info-bubble-body"><i>Hover over any element to see its metadata</i></div>
    </div>`;
  document.getElementById('neume_info').setAttribute('style', 'display: none');
}

/**
 * Update the visibility of infoBox
 */
function updateInfoVisibility (): void {
  const neumeInfo = document.getElementById('neume_info');
  if ((document.getElementById('displayInfo') as HTMLInputElement).checked) {
    neumeInfo.setAttribute('style', '');
  } else {
    neumeInfo.setAttribute('style', 'display: none');
  }
}

/**
 * Set listener on info visibility checkbox.
 */
function setInfoControls (): void {
  startInfoVisibility();
  updateInfoVisibility();
  document.getElementById('displayInfo').addEventListener('click', updateInfoVisibility);
}

/**
 * Class that manages getting information for elements in Neon from Verovio.
 */
class InfoModule implements InfoInterface {
  private neonView: NeonView;

  /**
   * A constructor for an InfoModule.
   * @param {NeonView} neonView - The NeonView parent.
   */
  constructor (neonView: NeonView) {
    this.neonView = neonView;
    // Add info box enable/disable check box
    const checkboxesContainer = document.getElementById('checkbox-display-options');
    const label = document.createElement('label');
    label.classList.add('checkbox-container', 'side-panel-btn');
    label.textContent = 'Info';
    const input = document.createElement('input');
    input.id = 'displayInfo';
    input.classList.add('checkbox');
    input.type = 'checkbox';
    input.checked = false;
    label.appendChild(input);
    checkboxesContainer.prepend(label);

    this.neonView.view.addUpdateCallback(this.resetInfoListeners.bind(this));
    setInfoControls();
    this.resetInfoListeners();
  }

  /**
   * Set listeners for the InfoModule.
   * Trigger action on mouseover of specific musical element classes.
   */
  infoListeners (): void {
    try {
      document.getElementsByClassName('active-page')[0]
        .querySelectorAll('.neume,.custos,.clef,.accid,.divLine')
        .forEach(node => {
          node.addEventListener('mouseover', this.updateInfo.bind(this));
        });
    } catch (e) {}
  }

  /**
   * Stop listeners for the InfoModule.
   */
  stopListeners (): void {
    document.querySelectorAll('.neume,.custos,.clef,.accid,.divLine').forEach(node => {
      node.removeEventListener('mouseover', this.updateInfo.bind(this));
    });
  }

  /**
   * Restart listeners for the InfoModule.
   */
  resetInfoListeners (): void {
    this.stopListeners();
    this.infoListeners();
  }

  /**
   * Get updated info for the calling element based on its element type.
   * Makes calls to NeonCore to get the information necessary.
   */
  async updateInfo (event: MouseEvent): Promise<void> {
  // For now, since Clefs do not have their own element tag in mei4, there is not a way to select the <g> element
  // So we will simply return if ID does not exist for now
    const id = (event.currentTarget as HTMLElement).id;
    if (id === '') {
      Array.from(document.getElementById('neume_info').children).forEach(child => {
        child.remove();
      });
      console.log('No id!');
      return;
    }

    const element = document.getElementById(id);
    const classRe = /neume|nc|clef|custos|staff|liquescent|accid|divLine/;
    const elementClass = element.getAttribute('class').match(classRe)[0];
    let body = '';
    let attributes: Attributes;

    // Gets the pitches depending on element type and
    switch (elementClass) {
      case 'neume':
        // Select neume components of selected neume
        const ncs = element.querySelectorAll('.nc') as NodeListOf<SVGGraphicsElement>;
        if (ncs.length === 1){
          const attr: Attributes = await this.neonView.getElementAttr(ncs[0].id, this.neonView.view.getCurrentPageURI());
          if (attr.curve === 'a' || attr.curve === 'c'){
            let pitches = await this.getPitches(ncs);

            pitches = pitches.trim().toUpperCase();
            body = 'Shape: Liquescent' + '\r\n' +
                    'Pitch(es): ' + pitches;
            break;
          }

        }

        let contour = await this.getContour(ncs);
        if (ncs.length === 1){
          const attr: Attributes = await this.neonView.getElementAttr(ncs[0].id, this.neonView.view.getCurrentPageURI());
          if(attr.tilt === 's'){
            let pitches = await this.getPitches(ncs);

            pitches = pitches.trim().toUpperCase();
            body = 'Shape: Virga \r\n'  +
                    'Pitch(es): ' + pitches;
            break;
          }
          else if(attr.tilt === 'n'){
            let pitches = await this.getPitches(ncs);

            pitches = pitches.trim().toUpperCase();
            body = 'Shape: Reversed Virga \r\n'  +
                    'Pitch(es): ' + pitches;
            break;
          }
        }
        if (contour === 'Clivis') {
          const attr: Attributes = await this.neonView.getElementAttr(ncs[0].id, this.neonView.view.getCurrentPageURI());
          if (attr.ligated) {
            contour = 'Ligature';
          }
        }
        let pitches = await this.getPitches(ncs);

        pitches = pitches.trim().toUpperCase();
        body = 'Shape: ' + (contour === undefined ? 'Compound' : contour) + '\r\n' +
                'Pitch(es): ' + pitches;
        break;
      case 'custos':
        attributes = await this.neonView.getElementAttr(id, this.neonView.view.getCurrentPageURI());
        body += 'Pitch: ' + (attributes['pname']).toUpperCase() + attributes['oct'];
        break;
      case 'accid':
        attributes = await this.neonView.getElementAttr(id, this.neonView.view.getCurrentPageURI());
        let type = '';
        if ((attributes['accid']).toUpperCase() == 'F'){
          type = 'Flat';
        }
        else if((attributes['accid']).toUpperCase() == 'N'){
          type = 'Natural';
        }
        body += 'Accid Type: ' + type;
        break;
      case 'clef':
        attributes = await this.neonView.getElementAttr(id, this.neonView.view.getCurrentPageURI());
        body += 'Shape: ' + attributes['shape'] + '\r\n' +
                'Line: ' + attributes['line'];
        break;
      case 'divLine':
        attributes = await this.neonView.getElementAttr(id, this.neonView.view.getCurrentPageURI());
        body += 'DivLine Type: ' + attributes['form'];
        break;
      default:
        body += 'nothing';
        break;
    }
    body = `Type: ${elementClass}\n${body}`;
    this.updateInfoModule(body);
  }

  /**
   * Get the individual pitches of a neume.
   * @param ncs - Neume components in the neume.
   * @returns Space separated pitches of the neume components in order.
   */
  async getPitches (ncs: Iterable<SVGGraphicsElement>): Promise<string> {
    let pitches = '';
    for (const nc of ncs) {
      const attributes: Attributes = await this.neonView.getElementAttr(nc.id, this.neonView.view.getCurrentPageURI());
      pitches += attributes['pname'] + attributes['oct'] + ' ';
    }
    return pitches;
  }

  /**
   * Get the contour of a neume.
   * @param ncs - Neume components in the neume.
   */
  async getContour (ncs: Iterable<SVGGraphicsElement>): Promise<string> {
    let contour = '';
    let previous: Attributes = null;
    for (const nc of ncs) {
      const attributes: Attributes = await this.neonView.getElementAttr(nc.id, this.neonView.view.getCurrentPageURI());
      if (previous !== null) {
        if (previous['oct'] > attributes['oct']) {
          contour += 'd';
        } else if (previous['oct'] < attributes['oct']) {
          contour += 'u';
        } else {
          if (this.pitchNameToNum(previous['pname']) < this.pitchNameToNum(attributes['pname'])) {
            contour += 'u';
          } else if (this.pitchNameToNum(previous['pname']) > this.pitchNameToNum(attributes['pname'])) {
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
   * @param body - The info box contents.
   */
  updateInfoModule (body: string): void {
    (<HTMLElement> document.getElementsByClassName('info-bubble-body')[0]).innerText = body;

    if ((document.getElementById('displayInfo') as HTMLInputElement).checked) {
      (document.getElementsByClassName('info-bubble-container')[0] as HTMLElement).style.display = '';
    }
  }

  /**
   * Convert a pitch name (a-g) to a number (where c is 1, d is 2, ...and b is 7).
   * @param pname - The pitch name.
   * @returns Equivalent pitch name as a number from 1 to 7.
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
   * @param value - The contour name.
   * @returns Best guess name of the neume shape.
   */
  getContourByValue (value: string): string {
    
    for (const [cont, v] of neumeGroups.entries()) {
      if (v === value) {
        return cont;
      }
    }
  }
}

export { InfoModule as default };
