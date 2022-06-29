import * as Color from './Color';
import { updateHighlight } from '../DisplayPanel/DisplayControls';
import * as Grouping from '../SquareEdit/Grouping';
import { resize } from './Resize';
import { Attributes, SelectionType } from '../Types';
import NeonView from '../NeonView';
import DragHandler from './DragHandler';
import * as SelectOptions from '../SquareEdit/SelectOptions';
import * as d3 from 'd3';

/**
 * @returns The selection mode chosen by the user.
 */
export function getSelectionType (): SelectionType {
  const element = document.getElementsByClassName('sel-by is-active');
  if (element.length !== 0) {
    return element[0].id as SelectionType;
  } else {
    return null;
  }
}

/**
 * Unselect all selected elements and run undo any extra
 * actions.
 */
export function unselect (): void {
  document.querySelectorAll('.selected').forEach((selected: SVGGElement) => {
    selected.classList.remove('selected');
    if (selected.classList.contains('staff')) {
      selected.removeAttribute('style');
      Color.unhighlight(selected);
    } else {
      selected.removeAttribute('style');
      selected.style.fill = '';
    }
  });

  // Set the strokes of all divlines back to black
  Array.from(document.getElementsByClassName('divLine')).forEach((syllable: HTMLElement) => {
    syllable.style.stroke = 'black';
  });

  Array.from(document.getElementsByClassName('text-select')).forEach((el: SVGElement) => {
    el.style.color = '';
    el.style.fontWeight = '';
    el.classList.remove('text-select');
  });

  Array.from(document.getElementsByClassName('sylTextRect-display')).forEach((sylRect: HTMLElement) => {
    sylRect.style.fill = 'blue';
  });

  Array.from(document.getElementsByClassName('syllable-highlighted')).forEach((syllable: HTMLElement) => {
    syllable.style.fill = '';
    syllable.classList.add('syllable');
    syllable.classList.remove('syllable-highlighted');
  });

  d3.selectAll('#resizeRect').remove();
  d3.selectAll('.resizePoint').remove();
  d3.selectAll('.rotatePoint').remove();

  if (!document.getElementById('selByStaff').classList.contains('is-active')) {
    Grouping.endGroupingSelection();
  } else {
    SelectOptions.endOptionsSelection();
  }
  document.getElementById('extraEdit').innerHTML = '';
  document.getElementById('extraEdit').parentElement.classList.add('hidden');
  updateHighlight();
}

/**
 * Select a staff element.
 * @param staff - The staff element in the DOM.
 * @param dragHandler - The drag handler in use.
 */
export function selectStaff (staff: SVGGElement, dragHandler: DragHandler): void {
  if (!staff.classList.contains('selected')) {
    staff.classList.add('selected');
    Color.unhighlight(staff);
    Color.highlight(staff, '#d00');
    SelectOptions.triggerSplitActions();
    Grouping.initGroupingListeners();
    dragHandler.dragInit();
  }
}

/**
 * Select a layer element.
 * @param layerElement - The layer element in the DOM.
 * @param dragHandler - The drag handler in use.
 */
export function selectLayerElement (layerElement: SVGGElement, dragHandler: DragHandler): void {
  if (!layerElement.classList.contains('selected')) {
    layerElement.classList.add('selected');
    Color.unhighlight(layerElement);
    Color.highlight(layerElement, '#d00');
    dragHandler.dragInit();
  }
}

/**
 * Generic select function.
 * @param el - Element to select.
 * @param dragHandler - Only used for staves.
 */
export function select (el: SVGGraphicsElement, dragHandler?: DragHandler): void {
  if (el.classList.contains('staff')) {
    return selectStaff(el, dragHandler);
  }
  if (el.classList.contains('layer')) {
    return selectLayerElement(el, dragHandler);
  }

  if (!el.classList.contains('selected') && !el.classList.contains('sylTextRect') &&
      !el.classList.contains('sylTextRect-display')) {
    el.classList.add('selected');
    // set fill to red
    // set stroke to red only if selected elem is a divLine
    el.style.fill = '#d00';
    el.style.stroke = (el.classList.contains('divLine'))? '#d00' : 'black';

    if (el.querySelectorAll('.sylTextRect-display').length) {
      el.querySelectorAll('.sylTextRect-display').forEach((elem: HTMLElement) => {
        elem.style.fill = '#d00';
      });
    }

    if (el.querySelectorAll('.divLine').length) {
      el.querySelectorAll('.divLine').forEach((elem: HTMLElement) => {
        elem.style.stroke = '#d00';
      });
    }

    // Set color of the corresponding text in the text panel to red
    let sylId;
    if (el.classList.contains('syllable')) {
      sylId = el.id;
    } else if (el.closest('.syllable') !== null) {
      sylId = el.closest('.syllable').id;
    }
    if (sylId !== undefined) {
      const spans = document.querySelectorAll('span.' + sylId);
      spans.forEach((span: HTMLElement) => {
        span.style.color = '#d00';
        span.style.fontWeight = 'bold';
        span.classList.add('text-select');
      });
    }
  }
  updateHighlight();
}

/**
 * Select an nc.
 * @param el - The neume component.
 */
export async function selectNcs (el: SVGGraphicsElement, neonView: NeonView, dragHandler: DragHandler): Promise<void> {
  if (!el.parentElement.classList.contains('selected')) {
    const parent = el.parentElement as unknown as SVGGraphicsElement;
    unselect();
    select(parent);
    if (await isLigature(parent, neonView)) {
      const prevNc = parent.previousSibling as unknown as SVGGraphicsElement;
      if (await isLigature(prevNc, neonView)) {
        select(prevNc);
      } else {
        const nextNc = parent.nextSibling as unknown as SVGGraphicsElement;
        if (await isLigature(nextNc, neonView)) {
          select(nextNc);
        } else {
          console.warn('Error: Neither prev or next nc are ligatures');
        }
      }
      Grouping.triggerGrouping('ligature');
    } else if (parent.classList.contains('nc')) {
      SelectOptions.triggerNcActions(parent);
    } else {
      console.warn('No action triggered!');
    }
    dragHandler.dragInit();
  }
}

/**
 * @param nc - The neume component.
 * @param neonView - The [[NeonView]] for this instance.
 * @returns True if the neume component is part of a ligature.
 */
export async function isLigature (nc: SVGGraphicsElement, neonView: NeonView): Promise<boolean> {
  const attributes: Attributes = await neonView.getElementAttr(nc.id, neonView.view.getCurrentPageURI());
  return (attributes.ligated);
}

/**
 * Check if list of elements of a certain type are logically adjacent to each other.
 * Includes elements that are on separate staves but would otherwise be next to each other.
 * Can not apply to elements of type neume component.
 * 
 * @param selectionType user selection mode
 * @param elements the elements of interest
 * @returns true if elements are adjacent, false otherwise
 */
export function areAdjacent(selectionType: string, elements: SVGGraphicsElement[]): boolean {

  // 2 elements cannot be adjacent if there is only 1 element
  if (elements.length < 2) return false;

  const parentElem = elements[0].parentElement;
  let allChildren = Array.from(parentElem.children);

  switch(selectionType) {
    case 'selBySyllable':
      allChildren = Array.from(parentElem.children).filter((el) => {
        return el.classList.contains('syllable');
      });
      break;

    case 'selByNeume':
      allChildren = Array.from(parentElem.children).filter((el) => {
        return el.classList.contains('neume');
      });
      break;

    case 'selByNc':
      allChildren = Array.from(parentElem.children).filter((el) => {
        return el.classList.contains('nc');
      });
      break;

    case 'selByStaff':
      allChildren = Array.from(parentElem.children).filter((el) => {
        return el.classList.contains('staff');
      });
      break;

    default:
      return false;
  }

  let sortedElements = [];
  // sort elements in order of appearance
  for (let i=0; i<allChildren.length; i++) {
    for (let j=0; j<elements.length; j++) {
      if (allChildren[i].isSameNode(elements[j])) {
        sortedElements.push(elements[j]);
      }
    }
  }

  // now check if they are all adjacent
  for (let i=0; i<sortedElements.length-1; i++) {
    const firstElem = sortedElements[i];
    const secondElem = sortedElements[i+1];

    if (Math.abs(allChildren.indexOf(firstElem) - allChildren.indexOf(secondElem)) !== 1) return false
  }

  return true;
}


/**
 * @param elements - The elements to compare.
 * @returns True if the elements have the same parent up two levels, otherwise false.
 */
export function sharedSecondLevelParent (elements: SVGElement[]): boolean {
  const tempElements = Array.from(elements);
  const firstElement = tempElements.pop();
  const secondParent = firstElement.parentElement.parentElement;
  for (const element of tempElements) {
    const secPar = element.parentElement.parentElement;
    if (secPar.id !== secondParent.id) {
      return false;
    }
  }
  return true;
}

/**
 * Check if user selected elements accross multiple staves
 * @param elements the user-selected elements
 * @returns true if selection is accross multiple staves, false otherwise
 */
export function isMultiStaveSelection(elements: SVGElement[]): boolean {
  let elementsArray = Array.from(elements);

  for (let i=0; i<elementsArray.length; i++) {
    const staff = elementsArray[i].closest('.staff');

    for (let j=i; j<elementsArray.length; j++) {
      const anotherStaff = elementsArray[j].closest('.staff');
      // compare with other staves
      if (!staff.isSameNode(anotherStaff)) return true;
    }
  }

  return false;
}

/**
 * Bounding box object interface for getStaffBBox()
 */
export interface StaffBBox {
  id: string;
  ulx: number;
  uly: number;
  lrx: number;
  lry: number;
  rotate: number;
}

/**
 * Get the bounding box of a staff based on its staff lines.
 * Rotate is included in radians.
 */
export function getStaffBBox (staff: SVGGElement): StaffBBox {
  let ulx, uly, lrx, lry, rotate;
  staff.querySelectorAll('path').forEach(path => {
    const coordinates: number[] = path.getAttribute('d')
      .match(/\d+/g)
      .map(element => Number(element));
    if (rotate === undefined) {
      rotate = Math.atan((coordinates[3] - coordinates[1]) /
        (coordinates[2] - coordinates[0]));
    }

    if (uly === undefined || Math.min(coordinates[1], coordinates[3]) < uly) {
      uly = Math.min(coordinates[1], coordinates[3]);
    }
    if (ulx === undefined || coordinates[0] < ulx) {
      ulx = coordinates[0];
    }
    if (lry === undefined || Math.max(coordinates[1], coordinates[3]) > lry) {
      lry = Math.max(coordinates[1], coordinates[3]);
    }
    if (lrx === undefined || coordinates[2] > lrx) {
      lrx = coordinates[2];
    }
  });

  return {
    id: staff.id,
    ulx: ulx,
    uly: uly,
    lrx: lrx,
    lry: lry,
    rotate: rotate,
  };
}

/**
 * select a boundingbox element
 * @param el - the bbox (sylTextRect) element in the DOM
 * @param dragHandler - the drag handler in use
 */
export function selectBBox (el: SVGGraphicsElement, dragHandler: DragHandler, neonView: NeonView): void {
  const bbox = el;
  const syl = bbox.closest('.syl');
  if (!syl.classList.contains('selected')) {
    syl.classList.add('selected');
    bbox.style.fill = '#d00';
    const closest = el.closest('.syllable') as HTMLElement;
    closest.style.fill = '#d00';
    closest.classList.add('syllable-highlighted');
    if (neonView !== undefined ){
      resize(syl as SVGGraphicsElement, neonView, dragHandler);
    }
    if (dragHandler !== undefined) {
      dragHandler.dragInit();
    }
    const sylId = el.closest('.syllable').id;
    if (sylId !== undefined) {
      const span: HTMLSpanElement = document.querySelector('span.' + sylId);
      if (span) {
        span.style.color = '#d00';
        span.style.fontWeight = 'bold';
        span.classList.add('text-select');
      }
    }
  }
}

/**
 * Select not neume elements.
 * @param notNeumes - An array of not neumes elements.
 */
export function selectNn (notNeumes: SVGGraphicsElement[]): boolean {
  if (notNeumes.length > 0) {
    notNeumes.forEach(nn => { select(nn); });
    return false;
  } else {
    return true;
  }
}

/**
 * Handle selecting an array of elements based on the selection type.
 */
export async function selectAll (elements: Array<SVGGraphicsElement>, neonView: NeonView, dragHandler: DragHandler): Promise<void> {
  const selectionType = getSelectionType();
  unselect();
  if (elements.length === 0) {
    return;
  }
  let selectionClass;
  let containsClefOrCustosOrAccidOrDivLine = false;
  let containsNc = false;

  switch (selectionType) {
    case 'selBySyllable':
      selectionClass = '.syllable';
      break;
    case 'selByNeume':
      selectionClass = '.neume';
      break;
    case 'selByNc':
      selectionClass = '.nc';
      break;
    case 'selByStaff':
      selectionClass = '.staff';
      break;
    case 'selByBBox':
      selectionClass = '.sylTextRect-display';
      break;
    case 'selByLayerElement':
      selectionClass = '.clef, .custos, .accid, .divLine';
      break;
    default:
      console.error('Unknown selection type ' + selectionType);
      return;
  }

  // Get the groupings specified by selectionClass
  // that contain the provided elements to select.
  const groupsToSelect = new Set();
  for (const element of elements) {
    let grouping = element.closest(selectionClass);
    if (grouping === null) {
      // Check if we click-selected a clef or a custos or an accid or a divLine
      grouping = element.closest('.clef, .custos, .accid, .divLine');
      if (grouping === null) {
        console.warn('Element ' + element.id + ' is not part of specified group and is not a clef or custos or accid or divLine.');
        continue;
      }
      containsClefOrCustosOrAccidOrDivLine = containsClefOrCustosOrAccidOrDivLine || true;
    } else {
      containsNc = containsNc || true;
    }
    groupsToSelect.add(grouping);

    // Check for precedes/follows
    const follows = grouping.getAttribute('mei:follows');
    if (follows) {
      groupsToSelect.add(document.getElementById(follows.slice(1)));
    }
    const precedes = grouping.getAttribute('mei:precedes');
    if (precedes) {
      groupsToSelect.add(document.getElementById(precedes.slice(1)));
    }
  }
  // Select the elements
  groupsToSelect.forEach((group: SVGGraphicsElement) => { select(group, dragHandler); });

  /* Determine the context menu to display (if any) */

  const groups = Array.from(groupsToSelect.values()) as SVGGraphicsElement[];

  // Handle occurance of clef or custos or accid or divLine
  if (containsClefOrCustosOrAccidOrDivLine && !containsNc) {
    // A context menu will only be displayed if there is a single clef
    if (groupsToSelect.size === 1 && groups[0].classList.contains('clef')) {
      SelectOptions.triggerClefActions(groups[0]);
    } else if (groupsToSelect.size === 1 && groups[0].classList.contains('custos')) {
      SelectOptions.triggerCustosActions();
    } else if (groupsToSelect.size === 1 && groups[0].classList.contains('accid')) {
      SelectOptions.triggerAccidActions(groups[0]);
    } else if (groupsToSelect.size === 1 && groups[0].classList.contains('divLine')) {
      SelectOptions.triggerLayerElementActions(groups[0]);
    }else {
      if (selectionType == 'selBySyllable') {
        SelectOptions.triggerDefaultSylActions();
      } else {
        SelectOptions.triggerDefaultActions();
      }
    }
    return;
  }

  switch (selectionType) {
    case 'selByStaff':
      switch (groups.length) {
        case 1:
          SelectOptions.triggerSplitActions();
          Grouping.initGroupingListeners();
          resize(groups[0], neonView, dragHandler);
          break;
        default:
          SelectOptions.triggerStaffActions();
          Grouping.initGroupingListeners();
      }
      break;

    case 'selByLayerElement':
      if (groupsToSelect.size === 1 && groups[0].classList.contains('clef')) {
        SelectOptions.triggerClefActions(groups[0]);
      } else if (groupsToSelect.size === 1 && groups[0].classList.contains('custos')) {
        SelectOptions.triggerCustosActions();
      } else if (groupsToSelect.size === 1 && groups[0].classList.contains('accid')) {
        SelectOptions.triggerAccidActions(groups[0]);
      } else if (groupsToSelect.size === 1 && groups[0].classList.contains('divLine')) {
        SelectOptions.triggerLayerElementActions(groups[0]);
      }else {
        SelectOptions.triggerDefaultActions();
      }
      break;

    case 'selBySyllable':

      switch (groups.length) {
        case 1:
          // TODO change context if it is only a neume/nc.
          SelectOptions.triggerSyllableActions('singleSelect');
          break;

        case 2:
          // Check if this is a linked syllable split by a staff break
          // if they are linkable, user can toggle linked-sylls
          if (Grouping.isLinkable('selBySyllable', groups)) { 
            SelectOptions.triggerSyllableActions('linkableSelect');
          }
          else if (Grouping.isGroupable('selBySyllable', groups)) {
            SelectOptions.triggerSyllableActions('multiSelect');
          }
          else {
            SelectOptions.triggerSyllableActions('default');
          }
          break;

        default:
          // if syllables are all located on one stave, they should be groupable
          if (Grouping.isGroupable('selBySyllable', groups)) {
            SelectOptions.triggerSyllableActions('multiSelect');
          }
          // if sylls are accross multiple staves
          else {
            SelectOptions.triggerSyllableActions('default');
          }
      }
      break;

    case 'selByNeume':
      switch (groups.length) {
        case 1:
          // TODO change context if it is only a nc.
          SelectOptions.triggerNeumeActions();
          Grouping.initGroupingListeners();
          break;
        default:
          if (Grouping.isGroupable(selectionType, groups)) {
            Grouping.triggerGrouping('neume');
          } else {
            SelectOptions.triggerDefaultActions();
          }
      }
      break;

    case 'selByNc':
      switch (groups.length) {
        case 1:
          SelectOptions.triggerNcActions(groups[0]);
          break;
        case 2:
          if (sharedSecondLevelParent(groups)) {
            // Check if this selection is a ligature or can be a ligature
            // Check if these neume components are part of the same neume
            if (groups[0].parentElement === groups[1].parentElement) {
              const children = Array.from(groups[0].parentElement.children);
              
              // Check that neume components are adjacent
              if (Math.abs(children.indexOf(groups[0]) - children.indexOf(groups[1])) === 1) {
                
                // Check that second neume component is lower than first.
                // Note that the order in the list may not be the same as the
                // order by x-position.
                let firstNC = (groups[0].children[0] as SVGUseElement);
                let secondNC = (groups[1].children[0] as SVGUseElement);

                let firstNCX  = firstNC.x.baseVal.value;
                let secondNCX = secondNC.x.baseVal.value;
                let firstNCY  = firstNC.y.baseVal.value;
                let secondNCY = secondNC.y.baseVal.value;

                // order nc's by x coord (left to right)
                if ( (firstNCX > secondNCX) 
                  || (firstNCX === secondNCX && firstNCY < secondNCY)) {
                  [firstNC, secondNC] = [secondNC, firstNC];
                  [firstNCX, firstNCY, secondNCX, secondNCY] = [secondNCX, secondNCY, firstNCX, firstNCY];
                }

                // if stacked nc's/ligature (identical x), or descending nc's (y descends)
                if (firstNCX === secondNCX || firstNCY < secondNCY) {
                  Grouping.triggerGrouping('ligature'); 
                  break;
                }
              }
            }
            Grouping.triggerGrouping('nc');
          } else {
            SelectOptions.triggerDefaultActions();
          }
          break;
        default:
          if (sharedSecondLevelParent(groups)) {
            Grouping.triggerGrouping('nc');
          } else {
            SelectOptions.triggerDefaultActions();
          }
      }
      break;
    case 'selByBBox':
      switch (groups.length) {
        case 1:
          selectBBox(groups[0], dragHandler, neonView);
          SelectOptions.triggerDefaultActions();
          break;
        default:
          groups.forEach(g => selectBBox(g, dragHandler, undefined));
          break;
      }
      break;
    default:
      console.error('Unknown selection type. This should not have occurred.');
  }
  
  function changeStaffListener(): void {
    try {
      document.getElementById('changeStaff')
        .addEventListener('click', SelectOptions.changeStaffHandler);
    } catch (e) {console.debug(e);}
  }
}
