import { uuidv4 } from './random';

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
  return '';
}

export function convertSbToStaff(sbBasedMei: string): string {
  const parser = new DOMParser();
  const meiDoc = parser.parseFromString(sbBasedMei, 'text/xml');
  const mei = meiDoc.documentElement;

  // Go section by section just in case
  for (const section of mei.getElementsByTagName('section')) {
    // In case there are multiple staves here we want to preserve those
    // A separate array is necessary as the HTMLCollection will update!
    const originalStaves = Array.from(section.getElementsByTagName('staff'));
    for (const staff of originalStaves) {
      const layer = staff.getElementsByTagName('layer')[0];
      // First pass: get all sb elements as direct children of layer
      for (const sb of layer.getElementsByTagName('sb')) {
        if (sb.parentElement.tagName !== 'layer') {
          const origSyllable: Element = sb.parentElement;
          if (origSyllable.firstChild.isEqualNode(sb)) {
            layer.insertBefore(sb, origSyllable);
          }
          else if (origSyllable.lastChild.isEqualNode(sb)) {
            origSyllable.insertAdjacentElement('afterend', sb);
          }
          else {
            // We need to split the syllable here
            const newSyllable = meiDoc.createElementNS('http://www.music-encoding.org/ns/mei', 'syllable');
            newSyllable.setAttribute('xml:id', 'm-' + uuidv4());
            newSyllable.setAttribute('follows', origSyllable.getAttribute('xml:id'));
            origSyllable.setAttribute('precedes', newSyllable.getAttribute('xml:id'));

            const childArray = Array.from(origSyllable.children);
            const sbIndex = childArray.indexOf(sb);
            for (const child of origSyllable.children) {
              const index = childArray.indexOf(child);
              if (index > sbIndex) {
                newSyllable.appendChild(child);
              }
            }

            origSyllable.insertAdjacentElement('afterend', sb);
            sb.insertAdjacentElement('afterend', newSyllable);
          }
        }
      }

      const sbInfo: Array<string> = [];
      for (const sb of layer.getElementsByTagName('sb')) {
        sbInfo.push(sb.getAttribute('xml:id'));
      }
      console.log(sbInfo);

      for (let i = 0; i < sbInfo.length; i++) {
        console.log('i = ' + i);
        const currentSb = Array.from(layer.getElementsByTagName('sb'))
          .filter(el => { return el.getAttribute('xml:id') === sbInfo[i]; })[0];
        const nextSb = (i === sbInfo.length - 1) ? undefined :
          Array.from(layer.getElementsByTagName('sb')).filter(el => {
            return el.getAttribute('xml:id') === sbInfo[i + 1];
          })[0];

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
  const serializer = new XMLSerializer();
  return serializer.serializeToString(meiDoc);
}
