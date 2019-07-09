const et = require('elementtree');
const uuid = require('uuid/v4');

et.register_namespace('xml', 'http://www.w3.org/XML/1998/namespace');
et.register_namespace('', 'http://www.music-encoding.org/ns/mei');

export function convertStaffToSb (staffBasedMei) {
  let meiTree = et.parse(staffBasedMei);
  let meiTag = meiTree.getroot();
  for (let section of meiTag.findall('.//section')) {
    let newStaff = et.Element('staff', { 'n': '1' });
    let container = et.SubElement(newStaff, 'layer');

    container.set('n', '1');

    for (let staff of section.getchildren()) {
      for (let layer of staff.getchildren()) {
        // Replace every staff + layer with a sb with the same facsimile info
        let sb = et.Element('sb', {
          'n': staff.get('n'),
          'facs': staff.get('facs'),
          'xml:id': staff.get('xml:id')
        });

        // Check for custos
        if (container.len() > 1) {
          if (container.getItem(container.len() - 1).tag === 'custos') {
            sb.append(container.getItem(container.len() - 1));
            container.remove(container.getItem(container.len() - 1));
          }
        }

        // Check if first syllable has @follows
        let firstSyllable = layer.find('syllable');
        let syllableId = '';
        if (firstSyllable) {
          if (firstSyllable.get('follows')) {
            syllableId = firstSyllable.get('follows');
            for (let syl of firstSyllable.findall('syl')) {
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
            './/*[@xml:id=\'' + syllableId + '\']'
          );
          syllable.append(sb);
          syllable._children = syllable._children.concat(firstSyllable.getchildren());
        }
        container._children = container._children.concat(layer.getchildren());
      }
    }
    let sectionId = section.get('xml:id');
    section.clear();
    section.set('xml:id', sectionId);
    section.append(newStaff);
  }

  return meiTree.write({ xml_declaration: true });
}

export function convertSbToStaff (sbBasedMei) {
  let meiTree = et.parse(sbBasedMei);
  let meiTag = meiTree.getroot();

  for (let section of meiTag.findall('.//section')) {
    let staffStore = [];
    for (let staff of section.getchildren()) {
      for (let layer of staff.getchildren()) {
        let sbIndexes = [];
        for (let sb of layer.findall('sb')) {
          sbIndexes.push(layer.getchildren().indexOf(sb));
        }

        for (let [sbIndex, n] of zip(sbIndexes, [...Array(sbIndexes.length).keys()])) {
          let sb = layer.getItem(sbIndex);
          let newStaff = et.Element('staff', sb.attrib);
          let container = et.Element('layer', { 'n': '1' });

          // Check for custos
          for (let i = 0; i < sb.len(); i++) {
            let custos = sb.getItem(0);
            let lastStaff = staffStore[staffStore.length - 1];
            lastStaff.getItem(lastStaff.len() - 1).append(custos);
          }

          // Get elements to add
          let lastIndex = n + 1 === sbIndexes.length ? layer.len() : sbIndexes[n + 1];
          container._children = container._children.concat(layer.getSlice(sbIndex + 1, lastIndex));
          newStaff.append(container);
          staffStore.push(newStaff);
        }
      }
    }
    let sectionId = section.get('xml:id');
    section.clear();
    section.set('xml:id', sectionId);
    section._children = section._children.concat(staffStore);

    // Handle sb in syllables
    let stavesAdded = 0;
    for (let [staff, staffIndex] of zip(section.getchildren(), [...Array(section.len()).keys()])) {
      for (let layer of staff.getchildren()) {
        for (let syllable of layer.findall('.//syllable')) {
          let sb = syllable.find('sb');
          if (!sb) {
            continue;
          }
          let newStaff = et.Element('staff', sb.attrib);
          let newLayer = et.SubElement(newStaff, 'layer');
          newLayer.set('n', '1');

          let newSyllableId = uuid();
          let newSyllable = et.SubElement(newLayer, 'syllable');
          newSyllable.set('follows', syllable.get('xml:id'));
          newSyllable.set('xml:id', newSyllableId);
          syllable.set('precedes', newSyllableId);
          newSyllable._children = newSyllable._children.concat(syllable.getSlice(syllable.getchildren().indexOf(sb) + 1, syllable.len()));

          let oldSyllableContent = syllable.getSlice(0, syllable.getchildren().indexOf(sb));
          let syllableAttrib = syllable.attrib;

          // Move remaining components to new staff.
          newLayer._children = newLayer._children.concat(layer.getSlice(layer.getchildren().indexOf(syllable) + 1, layer.len()));
          let layerAttrib = layer.attrib;
          let layerContent = layer.getSlice(0, layer.getchildren().indexOf(syllable) + 1);
          layer.clear();
          layer.attrib = layerAttrib;
          layer._children = layer._children.concat(layerContent);

          // Handle custos;
          layer._children = layer._children.concat(sb.getchildren());

          // Shrink syllable
          syllable.clear();
          syllable.attrib = syllableAttrib;
          syllable._children = syllable._children.concat(oldSyllableContent);

          section._children.splice(staffIndex + stavesAdded + 1, 0, newStaff);
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
