const et = require('elementtree');
const uuid = require('uuid/v4');

et.register_namespace('xml', 'http://www.w3.org/XML/1998/namespace');
et.register_namespace('', 'http://www.music-encoding.org/ns/mei');

export function convertStaffToSb (staffBasedMei) {
  let meiTree = et.parse(staffBasedMei);
  let meiTag = meiTree.getroot();

  for (let section of meiTag.findall('.//{http://www.music-encoding.org/ns/mei}section')) {
    let newStaff = et.Element('{http://www.music-encoding.org/ns/mei}staff', { 'n': '1' });
    let container = et.SubElement(newStaff, '{http://www.music-encoding.org/ns/mei}layer');
    container.set('n', '1');

    for (let staff of section.getchildren()) {
      for (let layer of staff.getchildren()) {
        // Replace every staff + layer with a sb with the same facsimile info
        let sb = et.Element('{http://www.music-encoding.org/ns/mei}sb', {
          'n': staff.get('n'),
          'facs': staff.get('facs'),
          '{http://www.w3.org/XML/1998/namespace}id': staff.get('{http://www.w3.org/XML/1998/namespace}id')
        });

        // Check for custos
        if (container.len() > 1) {
          if (container.getItem(container.len() - 1).tag === '{http://www.music-encoding.org/ns/mei}custos') {
            sb.append(container.getItem(container.len() - 1));
            container.remove(container.getItem(container.len() - 1));
          }
        }

        // Check if first syllable has @follows
        let firstSyllable = layer.find('{http://www.music-encoding.org/ns/mei}syllable');
        let syllableId = '';
        if (firstSyllable) {
          if (firstSyllable.get('follows')) {
            syllableId = firstSyllable.get('follows');
            for (let syl of firstSyllable.findall('{http://www.music-encoding.org/ns/mei}syl')) {
              firstSyllable.remove(syl);
            }
            layer.remove(firstSyllable);
          } else {
            firstSyllable = undefined;
          }
        }

        if (!firstSyllable) {
          container.append(sb);
        } else {
          let syllable = container.find(
            './/*[@{http://www.w3.org/XML/1998/namespace}id=\'' + syllableId + '\']'
          );
          syllable.append(sb);
          syllable.extend(firstSyllable.getchildren());
        }
        container.extend(layer.getchildren());
      }
    }
    let sectionId = section.get('{http://www.w3.org/XML/1998/namespace}id');
    section.clear();
    section.set('{http://www.w3.org/XML/1998/namespace}id', sectionId);
    section.append(newStaff);
  }

  return meiTree.write({ xml_declaration: true });
}

export function convertSbToStaff (sbBasedMei) {
  let meiTree = et.parse(sbBasedMei);
  let meiTag = meiTree.getroot();

  for (let section of meiTag.findall('.//{http://www.music-encoding.org/ns/mei}section')) {
    let staffStore = [];
    for (let staff of section.getchildren()) {
      for (let layer of staff.getchildren()) {
        let sbIndexes = [];
        for (let sb of layer.findall('{http://www.music-encoding.org/ns/mei}sb')) {
          sbIndexes.append(layer.getchildren().indexOf(sb));
        }

        for (let [sbIndex, n] of zip(sbIndexes, [...Array(sbIndexes.length).keys()])) {
          let sb = layer.getIndex(sbIndex);
          let newStaff = et.Element('{http://www.music-encoding.org/ns/mei}staff', sb.attrib);
          let container = et.SubElement(newStaff, '{http://www.music-encoding.org/ns/mei}layer');

          // Check for custos
          for (let custos in sb.getchildren()) {
            staffStore.getIndex(staffStore.len() - 1).getIndex(staffStore.len() - 1).append(custos);
          }

          // Set attributes
          container.set('n', '1');

          // Get elements to add
          let lastIndex = n + 1 === sbIndexes.length ? layer.len() : sbIndexes.getIndex(n + 1);
          container.extend(layer.getSlice(sbIndex + 1, lastIndex));
          staffStore.append(newStaff);
        }
      }
    }
    let sectionId = section.get('{http://www.w3.org/XML/1998/namespace}id');
    section.clear();
    section.set('{http://www.w3.org/XML/1998/namespace}id', sectionId);
    section.extend(staffStore);

    // Handle sb in syllables
    let stavesAdded = 0;
    for (let [staff, staffIndex] of zip(section.getchildren(), [...Array(section.len()).keys()])) {
      for (let layer of staff.getchildren()) {
        for (let syllable of layer.findall('.//{http://www.music-encoding.org/ns/mei}syllable')) {
          let sb = syllable.find('{http://www.music-encoding.org/ns/mei}sb');
          if (!sb) {
            continue;
          }
          let newStaff = et.Element('{http://www.music-encoding.org/ns/mei}staff', sb.attrib);
          let newLayer = et.SubElement(newStaff, '{http://www.music-encoding.or/ns/mei}layer');
          newLayer.set('n', '1');

          let newSyllableId = uuid();
          let newSyllable = et.SubElement(newLayer, '{http://www.music-encoding.org/ns/mei}syllable');
          newSyllable.set('follows', syllable.get('{http://www.w3.org/XML/1998/namespace}id'));
          newSyllable.set('{http://www.w3.org/XML/1998/namespace}id', newSyllableId);
          syllable.set('precedes', newSyllableId);
          newSyllable.extend(syllable.getSlice(syllable.getchildren().indexOf(sb) + 1, syllable.len()));

          let oldSyllableContent = syllable.getSlice(0, syllable.getchildren().indexOf(sb));
          let syllableAttrib = syllable.attrib;

          // Move remaining components to new staff.
          newLayer.extend(layer.getSlice(layer.getchildren().indexOf(syllable) + 1, layer.len()));
          let layerAttrib = layer.attrib;
          let layerContent = layer.getSlice(0, layer.getchildren().indexOf(syllable) + 1);
          layer.clear();
          layer.attrib = layerAttrib;
          layer.extend(layerContent);

          // Handle custos;
          layer.extend(sb.getchildren());

          // Shrink syllable
          syllable.clear();
          syllable.attrib = syllableAttrib;
          syllable.extend(oldSyllableContent);

          section.insert(staffIndex + stavesAdded + 1, newStaff);
        }
      }
    }
  }

  return meiTree.write({ xml_declaration: true });
}

function zip (array1, array2) {
  let result = [];
  for (let i = 0; i < (array1.length > array2.length ? array2.length : array1.length); i++) {
    result.push([array1[i], array2[i]]);
  }
  return result;
}
