import { uuidv4 } from './random';
import * as vkbeautify from 'vkbeautify';
import * as Notification from '../utils/Notification';

export function zip<T> (array1: Array<T>, array2: Array<T>): Array<T> {
  const result = [];
  for (let i = 0; i < (array1.length > array2.length ? array2.length : array1.length); i++) {
    result.push([array1[i], array2[i]]);
  }
  return result;
}

function copyAttributes(src: Element, dst: Element): void {
  for (const attr of src.attributes) {
    dst.setAttribute(attr.name, attr.value);
  }
}

export function convertToNeon(staffBasedMei: string): string {
  const parser = new DOMParser();
  const serializer = new XMLSerializer();
  const meiDoc = parser.parseFromString(staffBasedMei, 'text/xml');
  const mei = meiDoc.documentElement;
  let nCol = 0;

  for (const section of mei.querySelectorAll('section:not([type="neon-neume-line"])')) {
    const newStaff = meiDoc.createElementNS('http://www.music-encoding.org/ns/mei', 'staff');
    const newLayer = meiDoc.createElementNS('http://www.music-encoding.org/ns/mei', 'layer');
    newStaff.setAttribute('n', '1');
    newLayer.setAttribute('n', '1');
    newStaff.appendChild(newLayer);

    // Add <pb>
    const surface = mei.querySelector('surface');
    const surfaceId = surface.getAttribute('xml:id');
    const pb = meiDoc.createElementNS('http://www.music-encoding.org/ns/mei', 'pb');
    pb.setAttribute('xml:id', 'm-' + uuidv4());
    pb.setAttribute('facs', '#' + surfaceId);
    newLayer.appendChild(pb);

    const neonNeumeLineSections = Array.from(section.querySelectorAll('section[type="neon-neume-line"]'));
    let nStaff = 0;
    let lastCb: Element = null;
    
    for (const neonNeumeLineSection of neonNeumeLineSections) {
      nStaff += 1;
      const staff = neonNeumeLineSection.querySelector('staff');
      const layer = staff.querySelector('layer');

      // if staff has a new type value,
      // add cb before sb
      if (staff.hasAttribute('type') && staff.getAttribute('type') != 'column' + nCol.toString()) {
        nCol += 1;
        const cb = meiDoc.createElementNS('http://www.music-encoding.org/ns/mei', 'cb');
        cb.setAttribute('n', nCol.toString());
        cb.setAttribute('xml:id', 'm-' + uuidv4());
        cb.setAttribute('facs', '#m-' + uuidv4());
        newLayer.appendChild(cb);

        // Calculate zone for previous cb
        if (lastCb) {
          calculateAndAddZone(lastCb, cb, surface);
        }
        lastCb = cb;
      }

      const sb = meiDoc.createElementNS('http://www.music-encoding.org/ns/mei', 'sb');
      sb.setAttribute('n', nStaff.toString());
      sb.setAttribute('facs', staff.getAttribute('facs'));
      sb.setAttribute('xml:id', staff.getAttribute('xml:id'));

      // Handle custos
      let custos: Element = undefined;
      if ((newLayer.lastElementChild !== null) &&
        (newLayer.lastElementChild.tagName === 'custos')) {
        custos = newLayer.removeChild(newLayer.lastElementChild);
      }

      if (custos !== undefined) newLayer.appendChild(custos);
      newLayer.appendChild(sb);

      // Add remaining elements of layer to newLayer
      while (layer.firstElementChild !== null) {
        newLayer.appendChild(layer.firstElementChild);
      }
      neonNeumeLineSection.remove();
    }

    // Calculate and add zone for the last cb in the section
    if (lastCb) {
      calculateAndAddZone(lastCb, null, surface);
    }
    section.appendChild(newStaff);
  }

  // Add <colLayout>
  if (nCol) {
    const scoreDef = mei.querySelector('scoreDef');
    const colLayout = meiDoc.createElementNS('http://www.music-encoding.org/ns/mei', 'colLayout');
    colLayout.setAttribute('xml:id', 'm-' + uuidv4());
    colLayout.setAttribute('n', nCol.toString());
    scoreDef.insertAdjacentElement('afterend', colLayout);
  }

  return vkbeautify.xml(serializer.serializeToString(meiDoc));

  function calculateAndAddZone(startElement: Element, endElement: Element | null, surface: Element) {
    // Collect elements between startCb and endCb
    const elementsBetween = collectAllElementsWithFacs(startElement.nextElementSibling, endElement);

    // Calculate zone attributes
    const zone = meiDoc.createElementNS('http://www.music-encoding.org/ns/mei', 'zone');
    const BBox = calculateBBox(elementsBetween, surface);
    zone.setAttribute('lrx', BBox.lrx.toString());
    zone.setAttribute('lry', BBox.lry.toString());
    zone.setAttribute('ulx', BBox.ulx.toString());
    zone.setAttribute('uly', BBox.uly.toString());
    zone.setAttribute('xml:id', startElement.getAttribute('facs').slice(1));

    // Add zone to the beginning of surface children
    surface.insertBefore(zone, surface.firstElementChild);
  }

  function collectAllElementsWithFacs(element: Element, endElement: Element, elementsBetween = []) {
    if (element && element !== endElement) {
      // Push elements only if it has facs
      if (element.hasAttribute('facs')) elementsBetween.push(element);

      if (element.children.length > 0) {
        for (const child of element.children) {
          collectAllElementsWithFacs(child, endElement, elementsBetween);
        }
      }

      if (element.nextElementSibling) {
        collectAllElementsWithFacs(element.nextElementSibling, endElement, elementsBetween);
      }
    }

    return elementsBetween;
  }

  function calculateBBox(elements: Element[], surface: Element) {
    let lrx = Infinity; let lry = 0; let ulx = 0; let uly = Infinity;

    elements.forEach((element) => {
      const zone = Array.from(surface.children).find(zone => 
        zone.getAttribute('xml:id') === element.getAttribute('facs').slice(1));
      lrx = Math.min(lrx, parseInt(zone.getAttribute('lrx')));
      lry = Math.max(lry, parseInt(zone.getAttribute('lry')));
      ulx = Math.max(ulx, parseInt(zone.getAttribute('ulx')));
      uly = Math.min(uly, parseInt(zone.getAttribute('uly')));
    });

    return { lrx, lry, ulx, uly };
  }
}

export function getSyllableText (syllable: Element): string {
  const syl = syllable.querySelector('syl')?.childNodes[0];
  let sylText: string;
  if (syl) {
    sylText = syl.nodeValue;
  }
  else {
    sylText = '◊';
  }

  return sylText;
}

/**
 * Check if zone is all-zero or not linked with glyphs
 */
export function isInvalidBBox (mei: HTMLElement, zone: Element): [boolean, Element?] {
  const isAllZero = (parseInt(zone.getAttribute('lrx')) === 0) && 
    (parseInt(zone.getAttribute('lry')) === 0) &&
    (parseInt(zone.getAttribute('ulx')) === 0) &&
    (parseInt(zone.getAttribute('uly')) === 0);
  const element = mei.querySelector(`*[facs="${'#'+zone.getAttribute('xml:id')}"]`);
  if (isAllZero || !element) return [true, element];
  return [false];
}


/**
 * Convert sb to staff for verovio
 * Also do heuristic checks:
 *    1. invalid zones
 *    2. neume without neume component
 *    3. syllable without neume
 *    4. linked syllables not linked
 *    5. incomplete linked syllable
 */
export function convertToVerovio(sbBasedMei: string): string {
  const parser = new DOMParser();
  const meiDoc = parser.parseFromString(sbBasedMei, 'text/xml');
  const mei = meiDoc.documentElement;
  let hasCols = false;

  const facsimile = mei.querySelector('facsimile');
  facsimile.setAttribute('type', 'transcription');

  // Remove all-zero zones
  // Remove zones not linked with glyphs
  const surface = mei.querySelector('surface');
  let hasInvalidBBox = false;
  const zones = Array.from(surface.getElementsByTagName('zone'));
  for (const zone of zones) {
    const [isInvalid, element] = isInvalidBBox(mei, zone);
    if (isInvalid) {
      if (element) element.parentNode.removeChild(element);
      zone.parentNode.removeChild(zone);
      hasInvalidBBox = true;
    }
  }
  if (hasInvalidBBox) {
    Notification.queueNotification('Removed invalid zones contained in this file', 'warning');
  }

  // Check if there is <colLayout> element and remove them
  // There will only be one <colLayout> element
  const colLayout = mei.querySelector('colLayout');
  if (colLayout) {
    hasCols = true;
    colLayout.parentNode.removeChild(colLayout);
  }

  // Check if there are <pb> elements and remove them
  const pageBegins = Array.from(mei.getElementsByTagName('pb'));
  for (const pb of pageBegins) {
    pb.parentNode.removeChild(pb);
  }

  // Check syllable without neume 
  const syllables = Array.from(mei.getElementsByTagName('syllable'));
  let hasEmptySyllable = false;
  let hasEmptyNeume = false;
  let emptySyllableInfo = 'The following syllable(s) have no neumes: \n\n'; 
  let emptyNeumeInfo = 'The following neume(s) have no neume components: \n\n'; 
  for (const syllable of syllables) {
    if (syllable.getElementsByTagName('neume').length === 0) {
      hasEmptySyllable = true;
      emptySyllableInfo += `- &lt;${syllable.tagName}&gt; with xml:id: ${syllable.getAttribute('xml:id')}\n`;
    }

    // Check neume without neume component
    const neumes = syllable.getElementsByTagName('neume');
    for (const neume of neumes) {
      const ncs = Array.from(neume.getElementsByTagName('nc'));
      if (ncs.length === 0) {
        hasEmptyNeume = true;
        emptyNeumeInfo += `- &lt;${neume.tagName}&gt; with xml:id: ${neume.getAttribute('xml:id')}\n`;
      } else {
        // To be removed in the future:
        // If nc has a @curve value, add a <liquescent> element
        for (const nc of ncs) {
          if (nc.hasAttribute('curve')) {
            const liq = meiDoc.createElementNS('http://www.music-encoding.org/ns/mei', 'liquescent');
            liq.setAttribute('xml:id', 'm-' + uuidv4());
            nc.appendChild(liq);
          }
        }
      }
    }
  }

  if (hasEmptySyllable) {
    Notification.queueNotification('This file contains syllable(s) without neume!', 'warning', emptySyllableInfo);
  }
  if (hasEmptyNeume) {
    Notification.queueNotification('This file contains neume(s) without neume component!', 'warning', emptyNeumeInfo);
  }

  // Go section by section just in case
  const sections = Array.from(mei.getElementsByTagName('section'));
  for (const section of sections) {
    // In case there are multiple staves here we want to preserve those
    // A separate array is necessary as the HTMLCollection will update!
    const originalStaves = Array.from(section.getElementsByTagName('staff'));
    for (const staff of originalStaves) {
      const layer = staff.querySelector('layer');
      // First pass: get all sb elements as direct children of layer
      const sbArray = Array.from(layer.getElementsByTagName('sb'));
      // Check if any syllables have sb inside (linked syllables)
      // Keep this check for files not produced by Rodan
      for (const sb of sbArray) {
        if (sb.parentElement.tagName !== 'layer') {
          const origSyllable: Element = sb.parentElement;
          let neumeBehind = false, neumeAhead = false;
          const childArray = Array.from(origSyllable.children);
          const sbIndex = childArray.indexOf(sb);
          for (const neume of origSyllable.getElementsByTagName('neume')) {
            const ind = childArray.indexOf(neume);
            if (ind < sbIndex) {
              neumeBehind = true;
            }
            else if (ind > sbIndex) {
              neumeAhead = true;
            }
          }

          // Mark if a new staff begins before the current syllable, after it, or in the middle of it
          // If in the middle, link syllables
          if (!neumeBehind && neumeAhead) {
            origSyllable.insertAdjacentElement('beforebegin', sb);
          }
          else if (neumeBehind && !neumeAhead) {
            origSyllable.insertAdjacentElement('afterend', sb);
          }
          else if (neumeBehind && neumeAhead){
            // We may need to split the syllable here
            const newSyllable = meiDoc.createElementNS('http://www.music-encoding.org/ns/mei', 'syllable');
            newSyllable.setAttribute('xml:id', 'm-' + uuidv4());
            newSyllable.setAttribute('follows', '#' + origSyllable.getAttribute('xml:id'));
            origSyllable.setAttribute('precedes', '#' + newSyllable.getAttribute('xml:id'));

            const sbIndex = childArray.indexOf(sb);

            for (const child of childArray) {
              const index = childArray.indexOf(child);
              if (index > sbIndex) {
                newSyllable.appendChild(child);
              }
            }

            origSyllable.insertAdjacentElement('afterend', sb);
            sb.insertAdjacentElement('afterend', newSyllable);

            // Move any custos in origSyllable out of it
            for (const custos of origSyllable.getElementsByTagName('custos')) {
              origSyllable.insertAdjacentElement('afterend', custos);
            }

            // Move any clef in newSyllable out of it
            for (const clef of newSyllable.getElementsByTagName('clef')) {
              newSyllable.insertAdjacentElement('beforebegin', clef);
            }
          }
          else {
            console.warn('NONE BEHIND NONE AHEAD');
            console.debug(origSyllable);
          }
        }
      }

      const sbs = Array.from(layer.getElementsByTagName('sb'));
      const layerChildren = Array.from(layer.children);
      let nCol = 0;
      for (let i = 0; i < sbs.length; i++) {
        const currentSb = sbs[i];
        const nextSb = (sbs.length > i + 1) ? sbs[i + 1] : undefined;

        const newSection = meiDoc.createElementNS('http://www.music-encoding.org/ns/mei', 'section');
        newSection.setAttribute('type', 'neon-neume-line');

        const newStaff = meiDoc.createElementNS('http://www.music-encoding.org/ns/mei', 'staff');
        copyAttributes(currentSb, newStaff);
        newStaff.setAttribute('n', '1');
        const currentIdx = layerChildren.indexOf(currentSb);
        if (hasCols) {
          if (layerChildren.at(currentIdx-1).tagName === 'cb') {
            nCol += 1;
            // Remove cb element and its zone
            const cb = layerChildren.at(currentIdx-1);
            const cbFacs = cb.getAttribute('facs');
            const cbZone = Array.from(surface.querySelectorAll('zone'))
              .find(zone => zone.getAttribute('xml:id') === cbFacs.slice(1));
            cb.parentNode.removeChild(cb);
            cbZone.parentNode.removeChild(cbZone);
          }
          newStaff.setAttribute('type', 'column' + nCol.toString());
        }
        
        const newLayer = meiDoc.createElementNS('http://www.music-encoding.org/ns/mei', 'layer');
        newLayer.setAttribute('n', '1');
        newLayer.setAttribute('xml:id', 'm-' + uuidv4());
        newSection.appendChild(newStaff);
        newStaff.appendChild(newLayer);

        const childrenArray = Array.from(layer.children);
        const copyArray = childrenArray.slice(childrenArray.indexOf(currentSb) + 1, childrenArray.indexOf(nextSb));

        for (const child of copyArray) {
          newLayer.appendChild(child);
        }

        // Remove the zones for the last element in the original file
        // because the last element is not included
        if (!nextSb) {
          const lastElement = childrenArray.at(-1);
          const facsChildren = collectFacsChildren(lastElement, []);
          for (const child of facsChildren) {
            const zone = zones.find(z => z.getAttribute('xml:id') == child.getAttribute('facs').slice(1));
            if (zone) {
              zone.parentNode.removeChild(zone);
            }
          }
        }

        section.insertBefore(newSection, staff);
      }
      staff.remove();
    }
  }

  // Second pass on all syllables to handle clefs and custos that might remain
  const newSyllables = Array.from(mei.getElementsByTagName('syllable'));
  let invalidLinked = false;
  let invalidLinkedInfo = 'The following linked syllables are not encoded correctly: \n\n';
  let invalidOblique = false;
  let invalidObliqueInfo = 'The following obliques are incomplete: \n\n';
  for (const syllable of mei.querySelectorAll('syllable')) {
    for (const clef of syllable.querySelectorAll('clef')) {
      syllable.insertAdjacentElement('beforebegin', clef);
    }
    for (const custos of syllable.querySelectorAll('custos')) {
      syllable.insertAdjacentElement('afterend', custos);
    }

    // Check incomplete obliques
    // Obliques always come as a pair
    const obliqueInfo = checkOblique(syllable);
    if (obliqueInfo) {
      invalidOblique = true;
      invalidObliqueInfo += obliqueInfo;
    }

    // Check syllables that contains @precedes or @follows
    // Update syllable arrays for each syllable
    const syllableIdx = newSyllables.indexOf(syllable);

    // Validate toggle-linked syllable
    if (syllable.hasAttribute('precedes') && syllable.hasAttribute('follows')) {
      // Check if the syllable has both @precedes and @follows
      invalidLinked = true;
      invalidLinkedInfo += `- &lt;${syllable.tagName}&gt; (${getSyllableText(syllable)}) with xml:id: ${syllable.getAttribute('xml:id')} has both @precedes and @follows\n`;
    }
    // Check the precedes syllable
    else if (syllable.hasAttribute('precedes')) {
      const info = checkPrecedesSyllable(syllable, syllableIdx, newSyllables);
      if (info) {
        invalidLinked = true;
        invalidLinkedInfo += info;
      }
    }
    // Check the follows syllable
    else if (syllable.hasAttribute('follows')) {
      const info = checkFollowsSyllable(syllable, newSyllables);
      if (info) {
        invalidLinked = true;
        invalidLinkedInfo += info;
      }
    }
  }
  if (invalidOblique) {
    Notification.queueNotification('This file contains incomplete oblique(s)', 'error', invalidObliqueInfo);
  }
  if (invalidLinked) {
    Notification.queueNotification('This file contains invalid linked syllable(s)', 'error', invalidLinkedInfo);
  }

  const serializer = new XMLSerializer();
  return vkbeautify.xml(serializer.serializeToString(meiDoc));
}

export function checkOutOfBoundsGlyphs (meiString: string): void {
  const parser = new DOMParser();
  const meiDoc = parser.parseFromString(meiString, 'text/xml');
  const mei = meiDoc.documentElement;

  // Check for out-of-bound glyphs
  const zones = Array.from(mei.querySelectorAll('zone'));
  const dimensions = mei.querySelector('surface');
  const meiLrx = Number(dimensions.getAttribute('lrx')), meiLry = Number(dimensions.getAttribute('lry'));

  function isAttrOutOfBounds(zone: Element, attr: string): boolean {
    const coord = Number(zone.getAttribute(attr));
    const comp = (attr == 'lrx' || attr == 'ulx') ? meiLrx : meiLry;
    return coord < 0 || coord > comp;
  }

  let info = 'The following glyphs are out of bounds: \n\n';

  const hasOutOfBounds = zones.some((zone) => {
    const isOutOfBounds = ['ulx', 'uly', 'lrx', 'lry'].some((attr) => isAttrOutOfBounds(zone, attr));
    if (isOutOfBounds) {
      const element = mei.querySelector(`*[facs="${'#'+zone.getAttribute('xml:id')}"]`);
      info += `- &lt;${element.tagName}&gt; with xml:id: ${element.getAttribute('xml:id')}\n`;
    }
    return isOutOfBounds;
  });

  if (hasOutOfBounds) {
    Notification.queueNotification('This folio contains glyph(s) placed out-of-bounds!', 'warning', info);
  }
}

function checkPrecedesSyllable (syllable: Element, idx: number, syllables: Element[]): string {
  // Get xml:id of the next syllable (without the #, if it exists)
  const nextSyllableId = syllable.getAttribute('precedes').replace('#', '');

  // Find the next syllable and its index in the array
  let nextSyllableIdx: number;
  const nextSyllable = syllables.find((element, idx) => {
    if (element.getAttribute('xml:id') === nextSyllableId) {
      nextSyllableIdx = idx;
      return true;
    }

    return false;
  });

  // Condition 1: The next (following) syllable cannot be found
  if (!nextSyllable) {
    return `- &lt;${syllable.tagName}&gt; (${getSyllableText(syllable)}) with xml:id: ${syllable.getAttribute('xml:id')} is missing the following part\n`;
  }

  // Condition 2: The next syllable has been found, but the @follows attribute does NOT EXIST
  if (!nextSyllable.hasAttribute('follows')) {
    return `- The following syllable of &lt;${syllable.tagName}&gt; (${getSyllableText(syllable)}) with xml:id: ${syllable.getAttribute('xml:id')} is not linked to any syllable\n`;
  }

  // Condition 3: The next syllable's @follows attribute exists, but it is not in the correct format #id
  if (nextSyllable.getAttribute('follows') != '#' + syllable.getAttribute('xml:id')) {
    return `- The following syllable of &lt;${syllable.tagName}&gt; (${getSyllableText(syllable)}) with xml:id: ${syllable.getAttribute('xml:id')} is linked to the wrong syllable\n`;
  }

  // Condition 4:
  // Since the @follows value is correct, a pair of syllables exist for the toggle-linked syllable.
  // Check if the @follows syllable is the next syllable (index-wise) in the array:
  if (nextSyllableIdx !== idx + 1) {
    const sylText = getSyllableText(syllable);
    const unexpectedSylsText = syllables
      .slice(idx + 1, nextSyllableIdx)
      .map((syllable) => getSyllableText(syllable));

    const sylsText = [sylText, ...unexpectedSylsText].join(' - ');
    return `- Unexpected syllable(s) inside toggle-linked &lt;${syllable.tagName}&gt; (${sylsText}) with xml:id: ${syllable.getAttribute('xml:id')} is linked to the wrong syllable\n`;
  }
}

function checkFollowsSyllable (syllable: Element, syllables: Element[]): string {
  const prevSyllableId = syllable.getAttribute('follows').replace('#', '');
  const prevSyllable = syllables.find((syllable) => syllable.getAttribute('xml:id') === prevSyllableId);

  // Condition 1: The previous syllable does not exist
  if (!prevSyllable) {
    return `- &lt;${syllable.tagName}&gt; (${getSyllableText(syllable)}) with xml:id: ${syllable.getAttribute('xml:id')} is missing the preceding part\n`;
  }

  // Condition 2: The previous syllable exists, but the @precedes attribute does NOT EXIST
  if (!prevSyllable.hasAttribute('precedes')) {
    return `- The preceding syllable of &lt;${syllable.tagName}&gt; (${getSyllableText(syllable)}) with xml:id: ${syllable.getAttribute('xml:id')} is not linked to any syllable\n`;
  }

  // Condition 3: The previous syllable's @precedes attribute exists, but it is not in the correct format #id
  if (prevSyllable.getAttribute('precedes') != '#' + syllable.getAttribute('xml:id')) {
    return `- The preceding syllable of &lt;${syllable.tagName}&gt; (${getSyllableText(prevSyllable)}) with xml:id: ${syllable.getAttribute('xml:id')} is linked to the wrong syllable\n`;
  }
}

function checkOblique (syllable: Element): string {
  const ncs = syllable.querySelectorAll('nc');
  let ncIdx = 0;
  let info = '';
  while (ncIdx < ncs.length) {
    if (ncs[ncIdx].getAttribute('ligated')) {
      if ((ncIdx < ncs.length-1 && !ncs[ncIdx+1].getAttribute('ligated')) || (ncIdx == ncs.length-1)) {
        // If nc is ligated, and the next nc is not
        // Or, nc is ligated, but already at the end (there is no next)
        info += `- The oblique in syllable (${getSyllableText(syllable)}) with xml:id: ${syllable.getAttribute('xml:id')}\n`;
      }
      ncIdx += 2;
    }
    ncIdx += 1;
  }

  return info;
}

export function removeColumnLabel(mei: string): string {
  const parser = new DOMParser();
  const meiDoc = parser.parseFromString(mei, 'text/xml');
  const meiForValidation = meiDoc.documentElement;

  for (const staff of Array.from(meiForValidation.getElementsByTagName('staff'))) {
    if (staff.hasAttribute('type')) {
      staff.removeAttribute('type');
    }
  }

  const serializer = new XMLSerializer();
  return vkbeautify.xml(serializer.serializeToString(meiForValidation));
}

function collectFacsChildren(element: Element, array: Element[]): Element[] {
  if (element.hasAttribute('facs')) array.push(element);
  for (const child of element.children) {
    // Recursively call the function for child's children
    collectFacsChildren(child, array);
  }
  return array;
} 