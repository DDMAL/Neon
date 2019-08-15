import * as et from 'elementtree';
import * as uuid from 'uuid/v4';

et.register_namespace('xml', 'http://www.w3.org/XML/1998/namespace');
et.register_namespace('', 'http://www.music-encoding.org/ns/mei');

export function convertStaffToSb (staffBasedMei: string): string {
  const meiTree = et.parse(staffBasedMei);
  const meiTag = meiTree.getroot();
  for (const section of meiTag.findall('.//section')) {
    const newStaff = et.Element('staff', { 'n': '1' });
    const container: any = et.SubElement(newStaff, 'layer');

    container.set('n', '1');

    for (const staff of section.getchildren()) {
      for (const layer of staff.getchildren()) {
        // Replace every staff + layer with a sb with the same facsimile info
        const sb = et.Element('sb', {
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
            for (const syl of firstSyllable.findall('syl')) {
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
          const syllable: any = container.find(
            './/*[@xml:id=\'' + syllableId + '\']'
          );
          syllable.append(sb);
          syllable._children = syllable._children.concat(firstSyllable.getchildren());
        }
        container._children = container._children.concat(layer.getchildren());
      }
    }
    const sectionId = section.get('xml:id');
    section.clear();
    section.set('xml:id', sectionId);
    section.append(newStaff);
  }

  return meiTree.write({ 'xml_declaration': true, indent: 4 });
}

export function convertSbToStaff (sbBasedMei: string): string {
  const meiTree = et.parse(sbBasedMei);
  const meiTag = meiTree.getroot();

  for (const section of meiTag.findall('.//section') as any) {
    const staffStore = [];
    for (const staff of section.getchildren()) {
      for (const layer of staff.getchildren()) {
        const sbIndexes = [];
        for (const sb of layer.findall('sb')) {
          sbIndexes.push(layer.getchildren().indexOf(sb));
        }

        for (const [sbIndex, n] of zip(sbIndexes, [...Array(sbIndexes.length).keys()])) {
          const sb = layer.getItem(sbIndex);
          const newStaff = et.Element('staff', sb.attrib);
          const container: any = et.Element('layer', { 'n': '1' });

          // Check for custos
          for (let i = 0; i < sb.len(); i++) {
            const custos = sb.getItem(0);
            const lastStaff = staffStore[staffStore.length - 1];
            lastStaff.getItem(lastStaff.len() - 1).append(custos);
          }

          // Get elements to add
          const lastIndex = n + 1 === sbIndexes.length ? layer.len() : sbIndexes[n + 1];
          container._children = container._children.concat(layer.getSlice(sbIndex + 1, lastIndex));
          newStaff.append(container);
          staffStore.push(newStaff);
        }
      }
    }
    const sectionId = section.get('xml:id');
    section.clear();
    section.set('xml:id', sectionId);
    section._children = section._children.concat(staffStore);

    // Handle sb in syllables
    const stavesAdded = 0;
    for (const [staff, staffIndex] of zip(section.getchildren(), [...Array(section.len()).keys()])) {
      for (const layer of staff.getchildren()) {
        for (const syllable of layer.findall('.//syllable')) {
          const sb = syllable.find('sb');
          if (!sb) {
            continue;
          }
          const newStaff = et.Element('staff', sb.attrib);
          const newLayer: any = et.SubElement(newStaff, 'layer');
          newLayer.set('n', '1');

          const newSyllableId = uuid();
          const newSyllable: any = et.SubElement(newLayer, 'syllable');
          newSyllable.set('follows', syllable.get('xml:id'));
          newSyllable.set('xml:id', newSyllableId);
          syllable.set('precedes', newSyllableId);
          newSyllable._children = newSyllable._children.concat(syllable.getSlice(syllable.getchildren().indexOf(sb) + 1, syllable.len()));

          const oldSyllableContent = syllable.getSlice(0, syllable.getchildren().indexOf(sb));
          const syllableAttrib = syllable.attrib;

          // Move remaining components to new staff.
          newLayer._children = newLayer._children.concat(layer.getSlice(layer.getchildren().indexOf(syllable) + 1, layer.len()));
          const layerAttrib = layer.attrib;
          const layerContent = layer.getSlice(0, layer.getchildren().indexOf(syllable) + 1);
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

  return meiTree.write({ 'xml_declaration': true, indent: 4 });
}

function zip (array1: Array<any>, array2: Array<any>): Array<any> {
  const result = [];
  for (let i = 0; i < (array1.length > array2.length ? array2.length : array1.length); i++) {
    result.push([array1[i], array2[i]]);
  }
  return result;
}
