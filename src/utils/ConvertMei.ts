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

export function convertStaffToSb(staffBasedMei: string): string {
  const parser = new DOMParser();
  const serializer = new XMLSerializer();
  const meiDoc = parser.parseFromString(staffBasedMei, 'text/xml');
  const mei = meiDoc.documentElement;

  // const precedesSyllables: Set<Element> = new Set();

  for (const section of mei.getElementsByTagName('section')) {
    const newStaff = meiDoc.createElementNS('http://www.music-encoding.org/ns/mei', 'staff');
    const newLayer = meiDoc.createElementNS('http://www.music-encoding.org/ns/mei', 'layer');
    newStaff.setAttribute('n', '1');
    newLayer.setAttribute('n', '1');
    newStaff.appendChild(newLayer);

    const staves = Array.from(section.getElementsByTagName('staff'));

    for (const staff of staves) {
      const layer = staff.getElementsByTagName('layer')[0];

      const sb = meiDoc.createElementNS('http://www.music-encoding.org/ns/mei', 'sb');
      sb.setAttribute('n', staff.getAttribute('n'));
      sb.setAttribute('facs', staff.getAttribute('facs'));
      sb.setAttribute('xml:id', staff.getAttribute('xml:id'));

      // Handle custos
      let custos: Element = undefined;
      if ((newLayer.lastElementChild !== null) &&
        (newLayer.lastElementChild.tagName === 'custos')) {
        custos = newLayer.removeChild(newLayer.lastElementChild);
      }

      // Insert sb either as last child of layer or in the last syllable
      // const lastElement = newLayer.lastElementChild;
      // if ((lastElement !== null) && (lastElement.tagName === 'syllable') && lastElement.hasAttribute('precedes')) {
      //   if (custos !== undefined) lastElement.appendChild(custos);
      //   lastElement.appendChild(sb);
      // }
      // else {
      if (custos !== undefined) newLayer.appendChild(custos);
      newLayer.appendChild(sb);
      // }

      // Handle split syllables
      // for (const precedes of precedesSyllables) {
      //   const followsId = precedes.getAttribute('precedes');
      //   const followsSyllable = Array.from(layer.getElementsByTagName('syllable'))
      //     .filter(syllable => { return '#' + syllable.getAttribute('xml:id') === followsId; })
      //     .pop();
      //   if (followsSyllable !== undefined) {
      //     // Check for preceeding clef
      //     if ((followsSyllable.previousElementSibling !== null) &&
      //     (followsSyllable.previousElementSibling.tagName === 'clef')) {
      //       precedes.append(followsSyllable.previousElementSibling);
      //     }
      //     while (followsSyllable.firstChild !== null) {
      //       precedes.append(followsSyllable.firstChild);
      //     }
      //     followsSyllable.remove();
      //     precedes.removeAttribute('precedes');
      //     precedesSyllables.delete(precedes);
      //   }
      // }

      // Add remaining elements of layer to newLayer
      while (layer.firstElementChild !== null) {
        // if (layer.firstElementChild.hasAttribute('precedes')) {
        //   precedesSyllables.add(layer.firstElementChild);
        // }
        newLayer.appendChild(layer.firstElementChild);
      }
      staff.remove();
    }
    section.appendChild(newStaff);
  }

  return vkbeautify.xml(serializer.serializeToString(meiDoc));
}

export function getSyllableText (syllable: Element): string {
  const syl = syllable.getElementsByTagName('syl')[0].childNodes[0];
  let sylText: string;
  if (syl) {
    sylText = syl.nodeValue;
  }
  else {
    sylText = 'null';
  }

  return sylText;
}

export function convertSbToStaff(sbBasedMei: string): string {
  const parser = new DOMParser();
  const meiDoc = parser.parseFromString(sbBasedMei, 'text/xml');
  const mei = meiDoc.documentElement;

  // Check neume without neume component
  const neumes = Array.from(mei.getElementsByTagName('neume'));
  for (const neume of neumes) {
    if (neume.getElementsByTagName('nc').length === 0) {
      neume.remove();
      Notification.queueNotification('This file contains a neume without neume component!');
    }
  }

  // Check syllable without neume 
  const syllables = Array.from(mei.getElementsByTagName('syllable'));
  for (const syllable of syllables) {
    if (syllable.getElementsByTagName('neume').length === 0) {
      syllable.remove();
      Notification.queueNotification('This file contains a syllable without neume!');
    }
  }

  // Go section by section just in case
  for (const section of mei.getElementsByTagName('section')) {
    // In case there are multiple staves here we want to preserve those
    // A separate array is necessary as the HTMLCollection will update!
    const originalStaves = Array.from(section.getElementsByTagName('staff'));
    for (const staff of originalStaves) {
      const layer = staff.getElementsByTagName('layer')[0];
      // First pass: get all sb elements as direct children of layer
      const sbArray = Array.from(layer.getElementsByTagName('sb'));
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
      for (let i = 0; i < sbs.length; i++) {
        const currentSb = sbs[i];
        const nextSb = (sbs.length > i + 1) ? sbs[i + 1] : undefined;

        const newStaff = meiDoc.createElementNS('http://www.music-encoding.org/ns/mei', 'staff');
        copyAttributes(currentSb, newStaff);
        const newLayer = meiDoc.createElementNS('http://www.music-encoding.org/ns/mei', 'layer');
        newLayer.setAttribute('n', '1');
        newLayer.setAttribute('xml:id', 'm-' + uuidv4());
        newStaff.appendChild(newLayer);

        const childrenArray = Array.from(layer.children);
        const copyArray = childrenArray.slice(childrenArray.indexOf(currentSb) + 1, childrenArray.indexOf(nextSb));

        for (const child of copyArray) {
          newLayer.appendChild(child);
        }

        section.insertBefore(newStaff, staff);
      }
      staff.remove();
    }
  }

  // Second pass on all syllables to handle clefs and custos that might remain
  for (const syllable of mei.querySelectorAll('syllable')) {
    for (const clef of syllable.querySelectorAll('clef')) {
      syllable.insertAdjacentElement('beforebegin', clef);
    }
    for (const custos of syllable.querySelectorAll('custos')) {
      syllable.insertAdjacentElement('afterend', custos);
    }

    // Check syllables that contains @precedes or @follows
    // Update syllable arrays for each syllable
    const newSyllables = Array.from(mei.getElementsByTagName('syllable'));
    // For each toggle-linked syllable
    // Set @precedes and @follows to make sure pointing to the correct syllable
    if (syllable.hasAttribute('precedes')) {
      const syllableIdx = newSyllables.indexOf(syllable);
      if (syllableIdx >= 0) {
        const nextSyllable = newSyllables[syllableIdx+1];
        if (nextSyllable) {
          if (nextSyllable.hasAttribute('follows')) {
            if (nextSyllable.getAttribute('follows') != '#' + syllable.getAttribute('xml:id')) {
              const sylText = getSyllableText(syllable);
              Notification.queueNotification('Wrong @follows value for toggle-linked syllable: ' + sylText);
            }
          }
          else {
            const sylText = getSyllableText(syllable);
            Notification.queueNotification('No @follows value found for toggle-linked syllable: ' + sylText);
          }
        }
        else {
          Notification.queueNotification('No syllables found after @precedes');
        }
      }
    }
    else if (syllable.hasAttribute('follows')) {
      const syllableIdx = newSyllables.indexOf(syllable);
      if (syllableIdx > 0) {
        const prevSyllable = newSyllables[syllableIdx-1];
        if (prevSyllable) {
          if (prevSyllable.hasAttribute('precedes')) {
            if (prevSyllable.getAttribute('precedes') != '#' + syllable.getAttribute('xml:id')) {
              const sylText = getSyllableText(prevSyllable);
              Notification.queueNotification('Wrong @precedes value for toggle-linked syllable: ' + sylText);
            }
          }
          else {
            const sylText = getSyllableText(prevSyllable);
            Notification.queueNotification('No @precedes value found for toggle-linked syllable: ' + sylText);
          }
        }
      }
    }
  }

  const serializer = new XMLSerializer();
  return vkbeautify.xml(serializer.serializeToString(meiDoc));
}

