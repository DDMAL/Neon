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
    sylText = '◊';
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
      // neume.remove();
      Notification.queueNotification('This file contains a neume without neume component!', 'warning');
    }
  }

  // Check syllable without neume 
  const syllables = Array.from(mei.getElementsByTagName('syllable'));
  for (const syllable of syllables) {
    if (syllable.getElementsByTagName('neume').length === 0) {
      // syllable.remove();
      Notification.queueNotification('This file contains a syllable without neume!', 'warning');
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
  const newSyllables = Array.from(mei.getElementsByTagName('syllable'));

  for (const syllable of mei.querySelectorAll('syllable')) {
    for (const clef of syllable.querySelectorAll('clef')) {
      syllable.insertAdjacentElement('beforebegin', clef);
    }
    for (const custos of syllable.querySelectorAll('custos')) {
      syllable.insertAdjacentElement('afterend', custos);
    }

    // Check syllables that contains @precedes or @follows
    // Update syllable arrays for each syllable
    const syllableIdx = newSyllables.indexOf(syllable);

    // For each toggle-linked syllable
    // Set @precedes and @follows to make sure pointing to the correct syllable
    if (syllable.hasAttribute('precedes')) {
      // Get xml:id of the next syllable (without the #, if it exists)
      const nextSyllableId = syllable.getAttribute('precedes').replace('#', '');

      // Find the next syllable and its index in the array
      let nextSyllableIdx: number;
      const nextSyllable = newSyllables.find((element, idx) => {
        if (element.getAttribute('xml:id') === nextSyllableId) {
          nextSyllableIdx = idx;
          return true;
        }

        return false;
      });

      // Condition 1: The next (following) syllable cannot be found
      if (!nextSyllable) {
        const sylText = getSyllableText(syllable);
        Notification.queueNotification(`Missing the 2nd part of the toggle-linked syllable (${sylText})`);
        continue;
      }

      // Condition 2: The next syllable has been found, but the @follows attribute does NOT EXIST
      if (!nextSyllable.hasAttribute('follows')) {
        const sylText = getSyllableText(syllable);
        Notification.queueNotification(`The 2nd part of the toggle-linked syllable (${sylText}) does not link to any syllable`);
        continue;
      }

      // Condition 3: The next syllable's @follows attribute exists, but it is not in the correct format #id
      if (nextSyllable.getAttribute('follows') != '#' + syllable.getAttribute('xml:id')) {
        const sylText = getSyllableText(syllable);
        Notification.queueNotification(`The 2nd part of the toggle-linked syllable (${sylText}) links to the wrong syllable`);
        continue;
      }

      // Condition 4:
      // Since the @follows value is correct, a pair of syllables exist for the toggle-linked syllable.
      // Check if the @follows syllable is the next syllable (index-wise) in the array:
      if (nextSyllableIdx !== syllableIdx + 1) {
        const sylText = getSyllableText(syllable);
        const unexpectedSylsText = newSyllables
          .slice(syllableIdx + 1, nextSyllableIdx)
          .map((syllable) => getSyllableText(syllable));

        const sylsText = [sylText, ...unexpectedSylsText].join(' - ');
        Notification.queueNotification(`Unexpected syllable(s) inside toggle-linked syllable: ${sylsText}`);
      }
    }
    // Toggle-linked syllables: Check the FOLLOWING syllable
    else if (syllable.hasAttribute('follows')) {
      const prevSyllableId = syllable.getAttribute('follows').replace('#', '');
      const prevSyllable = newSyllables.find((syllable) => syllable.getAttribute('xml:id') === prevSyllableId);

      // Condition 1: The previous syllable does not exist
      if (!prevSyllable) {
        const sylText = getSyllableText(syllable);
        Notification.queueNotification(`Missing the 1st part of the toggle-linked syllable (${sylText})`);
        continue;
      }

      // Condition 2: The previous syllable exists, but the @precedes attribute does NOT EXIST
      if (!prevSyllable.hasAttribute('precedes')) {
        const sylText = getSyllableText(prevSyllable);
        Notification.queueNotification(`The 1st part of the toggle-linked syllable (${sylText}) does not link to any syllable`);
        continue;
      }

      // Condition 3: The previous syllable's @precedes attribute exists, but it is not in the correct format #id
      if (prevSyllable.getAttribute('precedes') != '#' + syllable.getAttribute('xml:id')) {
        const sylText = getSyllableText(prevSyllable);
        Notification.queueNotification(`The 1st part of the toggle-linked syllable (${sylText}) links to the wrong syllable`);
      }
    }
  }

  const serializer = new XMLSerializer();
  return vkbeautify.xml(serializer.serializeToString(meiDoc));
}

