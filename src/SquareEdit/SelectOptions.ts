import * as Contents from './Contents';
import * as Grouping from './Grouping';
import * as Notification from '../utils/Notification';
import NeonView from '../NeonView';
import { SplitStaffHandler } from './StaffTools';
import { SplitNeumeHandler } from './NeumeTools';
import { ChainAction, ChangeStaffAction, EditorAction, RemoveAction, SetAction, SetClefAction } from '../Types';
import { getStaffBBox } from '../utils/SelectTools';

/**
 * The NeonView parent to call editor actions.
 */
let neonView: NeonView;

/**
 * Initialize NeonView.
 */
export function initNeonView (view: NeonView): void {
  neonView = view;
  Grouping.initNeonView(view);
}

/**
 * @param id - The id of the neume component.
 * @returns An action that unsets the inclinatum parameter of a neume component.
 */
export function unsetInclinatumAction (id: string): SetAction {
  return {
    action: 'set',
    param: {
      elementId: id,
      attrType: 'tilt',
      attrValue: ''
    }
  };
}

/**
 * @param id - The id of the neume component.
 * @returns An action that unsets the virga parameter of a neume component.
 */
export function unsetVirgaAction (id: string): SetAction {
  return {
    action: 'set',
    param: {
      elementId: id,
      attrType: 'tilt',
      attrValue: ''
    }
  };
}

/**
 * @param id - The id of the neume component.
 * @returns An action that unsets the reversed virga parameter of a neume component.
 */
export function unsetVirgaReversedAction (id: string): SetAction {
  return {
    action: 'set',
    param: {
      elementId: id,
      attrType: 'tilt',
      attrValue: ''
    }
  };
}

/**
 * @param id - The id of the neume component.
 * @returns An action that unsets the liquescent_clockwise parameter of a neume component.
 */
export function unsetLiquescentClockwiseAction (id: string): SetAction {
  return {
    action: 'set',
    param: {
      elementId: id,
      attrType: 'curve',
      attrValue: ''
    }
  };
}

/**
 * @param id - The id of the neume component.
 * @returns An action that unsets the liquescent_anticlockwise parameter of a neume component.
 */
export function unsetLiquescentAnticlockwiseAction (id: string): SetAction {
  return {
    action: 'set',
    param: {
      elementId: id,
      attrType: 'curve',
      attrValue: ''
    }
  };
}

/** Event handler for delete button press. */
export function deleteButtonHandler (evt: KeyboardEvent): void {
  if (evt.key === 'd' || evt.key === 'Backspace') { removeHandler(); evt.preventDefault(); }
}

/**
 * End the extra options menu.
 */
export function endOptionsSelection (): void {
  try {
    const moreEdit = document.getElementById('moreEdit');
    moreEdit.innerHTML = '';
    moreEdit.classList.add('is-hidden');
    document.getElementById('moreEdit').parentElement.classList.add('hidden');
  } catch (e) {}
  document.body.removeEventListener('keydown', deleteButtonHandler);
}


/**
 * Function to handle removing elements
 */
export function removeHandler (): void {
  const toRemove: RemoveAction[] = [];
  const selected = Array.from(document.getElementsByClassName('selected'));
  selected.forEach(elem => {
    if (elem.classList.contains('syl')) {
      elem = elem.closest('.syllable');
    }
    if (elem.classList.contains('accid')) {
      elem = elem.closest('.accid');
    }
    if (elem.classList.contains('divLine')) {
      elem = elem.closest('.divLine');
    }
    toRemove.push(
      {
        action: 'remove',
        param: {
          elementId: elem.id
        }
      }
    );
  });
  const chainAction: ChainAction = {
    action: 'chain',
    param: toRemove
  };
  endOptionsSelection();
  neonView.edit(chainAction, neonView.view.getCurrentPageURI()).then(() => { neonView.updateForCurrentPage(); });
}

/**
 * Function to handle re-associating elements to the nearest staff
 */
export function changeStaffHandler(): void {
  const toChange: ChangeStaffAction[] = [];
  const selected = Array.from(document.getElementsByClassName('selected'));
  selected.forEach(elem => {
    toChange.push(
      {
        action: 'changeStaff',
        param: {
          elementId: elem.id
        }
      }
    );
  });
  const chainAction: EditorAction = {
    action: 'chain',
    param: toChange
  };
  endOptionsSelection();
  neonView.edit(chainAction, neonView.view.getCurrentPageURI()).then(() => { neonView.updateForCurrentPage(); });
}

/**
 * Function to handle inserting divisio or accidental into nearest syllable
 */
export function insertToSyllableHandler(): void {
  // const toInsert = [];
  const toInsert: EditorAction[] = [];
  const selected = Array.from(document.getElementsByClassName('selected'));
  selected.forEach(elem => {
    toInsert.push(
      {
        action: 'insertToSyllable',
        param: {
          elementId: elem.id
        }
      }
    );
  });
  const chainAction: ChainAction = {
    action: 'chain',
    param: toInsert
  };
  neonView.edit(chainAction, neonView.view.getCurrentPageURI()).then((result) => { 
    if (result) {
      Notification.queueNotification('Insert Success');
    } else {
      Notification.queueNotification('Insert Failed XoX');
    }
    endOptionsSelection();
    neonView.updateForCurrentPage(); 
  });
}

/**
 * Trigger the extra layer element action menu for a selection.
 */
//  export function triggerLayerElementActions (): void {
//   endOptionsSelection();
//   try {
//     const moreEdit = document.getElementById('moreEdit');
//     moreEdit.classList.remove('is-hidden');
//     moreEdit.innerHTML = Contents.defaultActionContents;
//   } catch (e) {}

//   try {
//     const del = document.getElementById('delete');
//     del.removeEventListener('click', removeHandler);
//     del.addEventListener('click', removeHandler);
//     document.body.addEventListener('keydown', deleteButtonHandler);
//   } catch (e) {}
// }

/**
 * Trigger the extra nc action menu for a selection.
 */
export function triggerNcActions (nc: SVGGraphicsElement): void {
  endOptionsSelection();
  try {
    const moreEdit = document.getElementById('moreEdit');
    moreEdit.classList.remove('is-hidden');
    document.getElementById('moreEdit').parentElement.classList.remove('hidden');
    document.getElementById('extraEdit').parentElement.classList.remove('hidden');
    moreEdit.innerHTML = Contents.defaultActionContents;
  } catch (e) {}
  try {
    const extraEdit = document.getElementById('extraEdit');
    extraEdit.classList.remove('is-hidden');
    extraEdit.innerHTML = Contents.ncActionContents;
  } catch (e) {}
  document.querySelector('#Punctum.dropdown-item')
    .addEventListener('click', () => {
      const unsetInclinatum = unsetInclinatumAction(nc.id);
      const unsetVirga = unsetVirgaAction(nc.id);
      const unsetVirgaReversed = unsetVirgaReversedAction(nc.id);
      const unsetLiquescentClockwise = unsetLiquescentClockwiseAction(nc.id);
      const unsetLiquescentAnticlockwise = unsetLiquescentAnticlockwiseAction(nc.id);
      neonView.edit({ action: 'chain', param: [ unsetInclinatum, unsetVirga, unsetVirgaReversed, unsetLiquescentClockwise, unsetLiquescentAnticlockwise ] }, neonView.view.getCurrentPageURI()).then((result) => {
        if (result) {
          Notification.queueNotification('Shape Changed');
        } else {
          Notification.queueNotification('Shape Change Failed');
        }
        endOptionsSelection();
        neonView.updateForCurrentPage();
      });
    });

  document.querySelector('#Inclinatum.dropdown-item')
    .addEventListener('click', () => {
      const unsetVirga = unsetVirgaAction(nc.id);
      const unsetVirgaReversed = unsetVirgaReversedAction(nc.id);
      const unsetLiquescentClockwise = unsetLiquescentClockwiseAction(nc.id);
      const unsetLiquescentAnticlockwise = unsetLiquescentAnticlockwiseAction(nc.id);
      const setInclinatum: SetAction = {
        action: 'set',
        param: {
          elementId: nc.id,
          attrType: 'tilt',
          attrValue: 'se'
        }
      };
      neonView.edit({ action: 'chain', param: [ unsetVirga, unsetVirgaReversed, unsetLiquescentClockwise, unsetLiquescentAnticlockwise, setInclinatum ] } , neonView.view.getCurrentPageURI()).then((result) => {
        if (result) {
          Notification.queueNotification('Shape Changed');
        } else {
          Notification.queueNotification('Shape Change Failed');
        }
        endOptionsSelection();
        neonView.updateForCurrentPage();
      });
    });

  document.querySelector('#Virga.dropdown-item')
    .addEventListener('click', () => {
      const unsetVirgaReversed = unsetVirgaReversedAction(nc.id);
      const unsetInclinatum = unsetInclinatumAction(nc.id);
      const unsetLiquescentClockwise = unsetLiquescentClockwiseAction(nc.id);
      const unsetLiquescentAnticlockwise = unsetLiquescentAnticlockwiseAction(nc.id);
      const setVirga: SetAction = {
        action: 'set',
        param: {
          elementId: nc.id,
          attrType: 'tilt',
          attrValue: 's'
        }
      };
      neonView.edit({ action: 'chain', param: [ unsetVirgaReversed, unsetInclinatum, unsetLiquescentClockwise, unsetLiquescentAnticlockwise, setVirga ] }, neonView.view.getCurrentPageURI()).then((result) => {
        if (result) {
          Notification.queueNotification('Shape Changed');
        } else {
          Notification.queueNotification('Shape Change Failed');
        }
        endOptionsSelection();
        neonView.updateForCurrentPage();
      });
    });

  document.querySelector('#VirgaReversed.dropdown-item')
    .addEventListener('click', () => {
      const unsetInclinatum = unsetInclinatumAction(nc.id);
      const unsetVirga = unsetVirgaAction(nc.id);
      const unsetLiquescentClockwise = unsetLiquescentClockwiseAction(nc.id);
      const unsetLiquescentAnticlockwise = unsetLiquescentAnticlockwiseAction(nc.id);
      const setVirgaReversed: SetAction = {
        action: 'set',
        param: {
          elementId: nc.id,
          attrType: 'tilt',
          attrValue: 'n'
        }
      };
      neonView.edit({ action: 'chain', param: [ unsetInclinatum, unsetVirga, unsetLiquescentClockwise, unsetLiquescentAnticlockwise, setVirgaReversed ] }, neonView.view.getCurrentPageURI()).then((result) => {
        if (result) {
          Notification.queueNotification('Shape Changed');
        } else {
          Notification.queueNotification('Shape Change Failed');
        }
        endOptionsSelection();
        neonView.updateForCurrentPage();
      });
    });

  document.querySelector('#LiquescentClockwise.dropdown-item')
    .addEventListener('click', () => {
      const unsetInclinatum = unsetInclinatumAction(nc.id);
      const unsetVirga = unsetVirgaAction(nc.id);
      const unsetVirgaReversed = unsetVirgaReversedAction(nc.id);
      const unsetLiquescentAnticlockwise = unsetLiquescentAnticlockwiseAction(nc.id);
      const setLiquescentClockwise: SetAction = {
        action: 'set',
        param: {
          elementId: nc.id,
          attrType: 'curve',
          attrValue: 'c'
        }
      };
      neonView.edit({ action: 'chain', param: [ unsetInclinatum, unsetVirga, unsetVirgaReversed, unsetLiquescentAnticlockwise, setLiquescentClockwise ] }, neonView.view.getCurrentPageURI()).then((result) => {
        if (result) {
          Notification.queueNotification('Shape Changed');
        } else {
          Notification.queueNotification('Shape Change Failed');
        }
        endOptionsSelection();
        neonView.updateForCurrentPage();
      });
    });  

  document.querySelector('#LiquescentAnticlockwise.dropdown-item')
    .addEventListener('click', () => {
      const unsetInclinatum = unsetInclinatumAction(nc.id);
      const unsetVirga = unsetVirgaAction(nc.id);
      const unsetVirgaReversed = unsetVirgaReversedAction(nc.id);
      const unsetLiquescentClockwise = unsetLiquescentClockwiseAction(nc.id);
      const setLiquescentAnticlockwise: SetAction = {
        action: 'set',
        param: {
          elementId: nc.id,
          attrType: 'curve',
          attrValue: 'a'
        }
      };
      neonView.edit({ action: 'chain', param: [ unsetInclinatum, unsetVirga, unsetVirgaReversed, unsetLiquescentClockwise, setLiquescentAnticlockwise ] }, neonView.view.getCurrentPageURI()).then((result) => {
        if (result) {
          Notification.queueNotification('Shape Changed');
        } else {
          Notification.queueNotification('Shape Change Failed');
        }
        endOptionsSelection();
        neonView.updateForCurrentPage();
      });
    });  

  try {
    const del = document.getElementById('delete');
    del.removeEventListener('click', removeHandler);
    del.addEventListener('click', removeHandler);
  } catch (e) {}
  document.body.addEventListener('keydown', deleteButtonHandler);

  initOptionsListeners();
}

/**
 * Trigger extra neume actions.
 */
export function triggerNeumeActions (): void {
  endOptionsSelection();
  try {
    const moreEdit = document.getElementById('moreEdit');
    moreEdit.classList.remove('is-hidden');
    document.getElementById('moreEdit').parentElement.classList.remove('hidden');
    moreEdit.innerHTML = Contents.defaultNeumeActionContents;
  } catch (e) {}
  try {
    const extraEdit = document.getElementById('extraEdit');
    extraEdit.classList.remove('is-hidden');
    document.getElementById('extraEdit').parentElement.classList.remove('hidden');
    extraEdit.innerHTML = Contents.neumeActionContents;
  } catch (e) {}
  const neume = document.querySelectorAll('.selected');
  if (neume.length !== 1) {
    console.warn('More than one neume selected! Cannot trigger Neume ClickSelect actions.');
    return;
  }

  // TODO add trigger for split action
  document.getElementById('split-neume')
    .addEventListener('click', () => {
      const neume = document.querySelector('.neume.selected') as SVGGElement;
      if (neume !== null) {
        const split = new SplitNeumeHandler(neonView, neume);
        split.startSplit();
        endOptionsSelection();
      } else {
        console.error('No staff was selected!');
        endOptionsSelection();
      }
    });

  document.querySelector('#Pes.dropdown-item')
    .addEventListener('click', (e) => {
      const contour = neonView.info.getContourByValue((e.target as HTMLElement).id);
      triggerChangeGroup(contour); 
    }); 
  document.querySelector('#PesSubpunctis.dropdown-item')
    .addEventListener('click', (e) => {
      const contour = neonView.info.getContourByValue((e.target as HTMLElement).id);
      triggerChangeGroup(contour); 
    }); 
  document.querySelector('#Clivis.dropdown-item')
    .addEventListener('click', (e) => {
      const contour = neonView.info.getContourByValue((e.target as HTMLElement).id);
      triggerChangeGroup(contour); 
    }); 
  document.querySelector('#Scandicus.dropdown-item')
    .addEventListener('click', (e) => {
      const contour = neonView.info.getContourByValue((e.target as HTMLElement).id);
      triggerChangeGroup(contour); 
    }); 
  document.querySelector('#ScandicusFlexus.dropdown-item')
    .addEventListener('click', (e) => {
      const contour = neonView.info.getContourByValue((e.target as HTMLElement).id);
      triggerChangeGroup(contour); 
    }); 
  document.querySelector('#ScandicusSubpunctis.dropdown-item')
    .addEventListener('click', (e) => {
      const contour = neonView.info.getContourByValue((e.target as HTMLElement).id);
      triggerChangeGroup(contour); 
    }); 
  document.querySelector('#Climacus.dropdown-item')
    .addEventListener('click', (e) => {
      const contour = neonView.info.getContourByValue((e.target as HTMLElement).id);
      triggerChangeGroup(contour); 
    }); 
  document.querySelector('#ClimacusResupinus.dropdown-item')
    .addEventListener('click', (e) => {
      const contour = neonView.info.getContourByValue((e.target as HTMLElement).id);
      triggerChangeGroup(contour); 
    }); 
  document.querySelector('#Torculus.dropdown-item')
    .addEventListener('click', (e) => {
      const contour = neonView.info.getContourByValue((e.target as HTMLElement).id);
      triggerChangeGroup(contour); 
    }); 
  document.querySelector('#TorculusResupinus.dropdown-item')
    .addEventListener('click', (e) => {
      const contour = neonView.info.getContourByValue((e.target as HTMLElement).id);
      triggerChangeGroup(contour); 
    }); 
  document.querySelector('#Porrectus.dropdown-item')
    .addEventListener('click', (e) => {
      const contour = neonView.info.getContourByValue((e.target as HTMLElement).id);
      triggerChangeGroup(contour); 
    }); 
  document.querySelector('#PorrectusFlexus.dropdown-item')
    .addEventListener('click', (e) => {
      const contour = neonView.info.getContourByValue((e.target as HTMLElement).id);
      triggerChangeGroup(contour); 
    }); 
  document.querySelector('#PorrectusSubpunctis.dropdown-item')
    .addEventListener('click', (e) => {
      const contour = neonView.info.getContourByValue((e.target as HTMLElement).id);
      triggerChangeGroup(contour); 
    }); 
  document.querySelector('#Pressus.dropdown-item')
    .addEventListener('click', (e) => {
      const contour = neonView.info.getContourByValue((e.target as HTMLElement).id);
      triggerChangeGroup(contour); 
    }); 

  function triggerChangeGroup (contour: string): void {
    const changeGroupingAction: EditorAction = {
      action: 'changeGroup',
      param: {
        elementId: neume[0].id,
        contour: contour
      }
    };
    neonView.edit(changeGroupingAction, neonView.view.getCurrentPageURI()).then((result) => {
      if (result) {
        Notification.queueNotification('Grouping Changed');
      } else {
        Notification.queueNotification('Grouping Failed');
      }
      endOptionsSelection();
      neonView.updateForCurrentPage();
    });
  }
  try {
    const del = document.getElementById('delete');
    del.removeEventListener('click', removeHandler);
    del.addEventListener('click', removeHandler);
  } catch (e) {}
  document.body.addEventListener('keydown', deleteButtonHandler);

  initOptionsListeners();
}

/**
 * Trigger extra syllable actions.
 */
export function triggerSylActions (): void {
  endOptionsSelection();
  try {
    const moreEdit = document.getElementById('moreEdit');
    moreEdit.classList.remove('is-hidden');
    document.getElementById('moreEdit').parentElement.classList.remove('hidden');
    moreEdit.innerHTML =
      '<div><p class=\'control\'>' +
        '<button class=\'button\' id=\'mergeSyls\'>Merge Syllables</button></p></div>' +
      '<div><p class=\'control\'>' +
          '<button class=\'button\' id=\'ungroupNeumes\'>Ungroup</button></p></div>' +
      '<div><p class=\'control\'>' +
          '<button class=\'button\' id=\'delete\'>Delete</button></p></div>' +
      '<div><p class=\'control\'>' +
        '<button class=\'button\' id=\'changeStaff\'>Re-associate to nearest staff</button></p></div>';
    document.getElementById('changeStaff').addEventListener('click', changeStaffHandler);
  } catch (e) { console.debug(e); }
  try {
    const del = document.getElementById('delete');
    del.removeEventListener('click', removeHandler);
    del.addEventListener('click', removeHandler);
  } catch (e) {}
  document.body.addEventListener('keydown', deleteButtonHandler);
}

/**
 * Trigger extra clef actions for a specific clef.
 * @param clef - The clef on which to trigger additional actions.
 */
export function triggerClefActions (clef: SVGGraphicsElement): void {
  endOptionsSelection();
  try {
    const moreEdit = document.getElementById('moreEdit');
    moreEdit.classList.remove('is-hidden');
    document.getElementById('moreEdit').parentElement.classList.remove('hidden');
    // custos contents is just the delete button
    moreEdit.innerHTML = Contents.custosActionContents;
  } catch (e) {}
  try {
    const extraEdit = document.getElementById('extraEdit');
    extraEdit.classList.remove('is-hidden');
    extraEdit.innerHTML = Contents.clefActionContents;
  } catch (e) {}

  try {
    document.getElementById('changeStaff')
      .addEventListener('click', changeStaffHandler);
  } catch (e) {console.debug(e);}
  
  document.querySelector('#CClef.dropdown-item')
    .addEventListener('click', () => {
      const setCClef: SetClefAction = {
        action: 'setClef',
        param: {
          elementId: clef.id,
          shape: 'C'
        }
      };
      neonView.edit(setCClef, neonView.view.getCurrentPageURI()).then((result) => {
        if (result) {
          Notification.queueNotification('Shape Changed');
        } else {
          Notification.queueNotification('Shape Change Failed');
        }
        endOptionsSelection();
        neonView.updateForCurrentPage();
      });
    });
  document.querySelector('#FClef.dropdown-item')
    .addEventListener('click', () => {
      const setFClef: SetClefAction = {
        action: 'setClef',
        param: {
          elementId: clef.id,
          shape: 'F'
        }
      };
      neonView.edit(setFClef, neonView.view.getCurrentPageURI()).then((result) => {
        if (result) {
          Notification.queueNotification('Shape Changed');
        } else {
          Notification.queueNotification('Shape Change Failed');
        }
        endOptionsSelection();
        neonView.updateForCurrentPage();
      });
    });

  try {
    const del = document.getElementById('delete');
    del.removeEventListener('click', removeHandler);
    del.addEventListener('click', removeHandler);
    document.getElementById('changeStaff').addEventListener('click', changeStaffHandler);
  } catch (e) {console.debug(e);}
  document.body.addEventListener('keydown', deleteButtonHandler);


  initOptionsListeners();
}

/**
 * Trigger extra custos actions.
 */
export function triggerCustosActions (): void {
  endOptionsSelection();
  try {
    const moreEdit = document.getElementById('moreEdit');
    moreEdit.classList.remove('is-hidden');
    document.getElementById('moreEdit').parentElement.classList.remove('hidden');
    moreEdit.innerHTML += Contents.custosActionContents;
  } catch (e) {}

  try {
    document.getElementById('changeStaff')
      .addEventListener('click', changeStaffHandler);
  } catch (e) {console.debug(e);}

  try {
    const del = document.getElementById('delete');
    del.removeEventListener('click', removeHandler);
    del.addEventListener('click', removeHandler);
    document.body.addEventListener('keydown', deleteButtonHandler);
  } catch (e) {}
}

/**
 * Trigger extra accid actions.
 */
export function triggerAccidActions (accid: SVGGraphicsElement): void {
  endOptionsSelection();
  try {
    const moreEdit = document.getElementById('moreEdit');
    moreEdit.classList.remove('is-hidden');
    document.getElementById('moreEdit').parentElement.classList.remove('hidden');
    moreEdit.innerHTML += Contents.divlineActionContents;
  } catch (e) {}

  try {
    const extraEdit = document.getElementById('extraEdit');
    extraEdit.classList.remove('is-hidden');
    extraEdit.innerHTML = Contents.accidActionContents;
  } catch (e) {}

  try {
    document.getElementById('changeStaff')
      .addEventListener('click', changeStaffHandler);
  } catch (e) {console.debug(e);}

  try {
    document.getElementById('insertToSyllable')
      .addEventListener('click', insertToSyllableHandler);
  } catch (e) {console.debug(e);}

  document.querySelector('#ChangeToFlat.dropdown-item')
    .addEventListener('click', () => {
      const changeToFlat: SetAction = {
        action: 'set',
        param: {
          elementId: accid.id,
          attrType: 'accid',
          attrValue: 'f'
        }
      };
      neonView.edit(changeToFlat, neonView.view.getCurrentPageURI()).then((result) => {
        if (result) {
          Notification.queueNotification('Shape Changed');
        } else {
          Notification.queueNotification('Shape Change Failed');
        }
        endOptionsSelection();
        neonView.updateForCurrentPage();
      });
    });
  document.querySelector('#ChangeToNatural.dropdown-item')
    .addEventListener('click', () => {
      const changeToNatural: EditorAction = {
        action: 'set',
        param: {
          elementId: accid.id,
          attrType: 'accid',
          attrValue: 'n'
        }
      };
      neonView.edit(changeToNatural, neonView.view.getCurrentPageURI()).then((result) => {
        if (result) {
          Notification.queueNotification('Shape Changed');
        } else {
          Notification.queueNotification('Shape Change Failed');
        }
        endOptionsSelection();
        neonView.updateForCurrentPage();
      });
    });

  try {
    const del = document.getElementById('delete');
    del.removeEventListener('click', removeHandler);
    del.addEventListener('click', removeHandler);
    document.body.addEventListener('keydown', deleteButtonHandler);
  } catch (e) {}

  initOptionsListeners();
}

/**
 * Trigger extra accid or divLine actions.
 */
export function triggerDivLineActions (): void {
  endOptionsSelection();
  try {
    const moreEdit = document.getElementById('moreEdit');
    moreEdit.classList.remove('is-hidden');
    document.getElementById('moreEdit').parentElement.classList.remove('hidden');
    moreEdit.innerHTML += Contents.divlineActionContents;
  } catch (e) {}

  try {
    document.getElementById('changeStaff')
      .addEventListener('click', changeStaffHandler);
  } catch (e) {console.debug(e);}

  try {
    const del = document.getElementById('delete');
    del.removeEventListener('click', removeHandler);
    del.addEventListener('click', removeHandler);
    document.body.addEventListener('keydown', deleteButtonHandler);
  } catch (e) {}

  try {
    document.getElementById('insertToSyllable')
      .addEventListener('click', insertToSyllableHandler);
  } catch (e) {console.debug(e);}
}


/**
 * Trigger extra staff actions.
 */
export function triggerStaffActions (): void {
  endOptionsSelection();
  try {
    const moreEdit = document.getElementById('moreEdit');
    moreEdit.classList.remove('is-hidden');
    document.getElementById('moreEdit').parentElement.classList.remove('hidden');
    moreEdit.innerHTML = Contents.staffActionContents;
  } catch (e) {}

  document.getElementById('merge-systems')
    .addEventListener('click', () => {
      Grouping.mergeStaves();
    });

  try {
    const del = document.getElementById('delete');
    del.removeEventListener('click', removeHandler);
    del.addEventListener('click', removeHandler);
  } catch (e) {}
  document.body.addEventListener('keydown', deleteButtonHandler);
}

/**
 * Enter staff splitting mode
 */
export function triggerStaffSplitMode (): void {
  const staff = document.querySelector('.staff.selected') as SVGGElement;
  if (staff !== null) {
    const split = new SplitStaffHandler(neonView, staff);
    split.startSplit();
    endOptionsSelection();
  } else {
    console.error('No staff was selected!');
    endOptionsSelection();
  }
}

/**
 * Trigger split staff option
 */
export function triggerSplitActions (): void {
  endOptionsSelection();
  try {
    const moreEdit = document.getElementById('moreEdit');
    moreEdit.classList.remove('is-hidden');
    document.getElementById('moreEdit').parentElement.classList.remove('hidden');
    moreEdit.innerHTML = Contents.splitActionContents;
  } catch (e) {}

  // TODO add trigger for split action
  document.getElementById('split-system')
    .addEventListener('click', () => {
      triggerStaffSplitMode();
    });

  document.getElementById('reset-rotate')
    .addEventListener('click', () => {
      const staff = document.querySelector('.staff.selected') as SVGElement;
      // Unused variables:
      // const rect = staff.querySelector('#resizeRect');
      // const co = rect.getAttribute('points').split(' ');
      // const dy = parseInt(co[0].split(',')[1]) - parseInt(co[1].split(',')[1]);
      const points = getStaffBBox(staff as SVGGElement);
      const y_change = Math.tan(points.rotate)*(points.lrx - points.ulx);
      if (staff !== null) {
        const editorAction: EditorAction = {
          action: 'resizeRotate',
          param: {
            elementId: staff.id,
            ulx: points.ulx,
            uly: points.rotate > 0 ? points.uly + y_change/2 : points.uly - y_change/2,
            lrx: points.lrx,
            lry: points.rotate > 0 ? points.lry - y_change/2 : points.lry + y_change/2,
            rotate: 0
          }
        };
        neonView.edit(editorAction, neonView.view.getCurrentPageURI()).then(async (result) => {
          if (result) {
            await neonView.updateForCurrentPage();
          }
        });
        endOptionsSelection();
      } else {
        console.error('No staff was selected');
        endOptionsSelection();
      }
    });

  try {
    const del = document.getElementById('delete');
    del.removeEventListener('click', removeHandler);
    del.addEventListener('click', removeHandler);
  } catch (e) {}
  document.body.addEventListener('keydown', deleteButtonHandler);
}

/**
 * Trigger default actions when selecting by syl
 */
export function triggerDefaultSylActions (): void {
  endOptionsSelection();
  try {
    const moreEdit = document.getElementById('moreEdit');
    moreEdit.classList.remove('is-hidden');
    document.getElementById('moreEdit').parentElement.classList.remove('hidden');
    moreEdit.innerHTML = Contents.defaultSylActionContents;
  } catch (e) {}

  try {
    const del = document.getElementById('delete');
    del.removeEventListener('click', removeHandler);
    del.addEventListener('click', removeHandler);
  } catch (e) {}
  document.body.addEventListener('keydown', deleteButtonHandler);
  try {
    const changeStaff = document.getElementById('changeStaff');
    changeStaff.removeEventListener('click', changeStaffHandler);
    changeStaff.addEventListener('click', changeStaffHandler);
  } catch(e) {console.debug(e);}
}

/**
 * Trigger default selection option.
 */
export function triggerDefaultActions (): void {
  endOptionsSelection();
  try {
    const moreEdit = document.getElementById('moreEdit');
    moreEdit.classList.remove('is-hidden');
    document.getElementById('moreEdit').parentElement.classList.remove('hidden');
    moreEdit.innerHTML = Contents.defaultActionContents;
  } catch (e) {}

  try {
    const del = document.getElementById('delete');
    del.removeEventListener('click', removeHandler);
    del.addEventListener('click', removeHandler);
  } catch (e) {}
  document.body.addEventListener('keydown', deleteButtonHandler);
}

/**
 * Initialize extra dropdown options.
 */
function initOptionsListeners (): void {
  document.getElementById('drop_select').addEventListener('click', function () {
    this.classList.toggle('is-active');
  });
}
