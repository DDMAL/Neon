import * as Contents from './Contents';
import * as Grouping from './Grouping';
import * as Notification from '../utils/Notification';
import NeonView from '../NeonView';
import { SplitHandler } from './StaffTools';

/**
 * The NeonView parent to call editor actions.
 */
var neonView: NeonView;

/**
 * Initialize NeonView.
 */
export function initNeonView (view: NeonView): void {
  neonView = view;
  Grouping.initNeonView(view);
}

/**
 * Return an action that unsets the inclinatum parameter of an nc.
 * @param id - The id of the neume component.
 */
export function unsetInclinatumAction (id: string): object {
  return {
    'action': 'set',
    'param': {
      'elementId': id,
      'attrType': 'tilt',
      'attrValue': ''
    }
  };
}

/**
 * Return an action that unsets the virga parameter of an nc.
 * @param id - The id of the neume component.
 */
export function unsetVirgaAction (id: string): object {
  return {
    'action': 'set',
    'param': {
      'elementId': id,
      'attrType': 'tilt',
      'attrValue': ''
    }
  };
}

/**
 * Function to handle removing elements
 */
export function removeHandler () {
  let toRemove = [];
  var selected = Array.from(document.getElementsByClassName('selected'));
  selected.forEach(elem => {
    toRemove.push(
      {
        'action': 'remove',
        'param': {
          'elementId': elem.id
        }
      }
    );
  });
  let chainAction = {
    'action': 'chain',
    'param': toRemove
  };
  endOptionsSelection();
  neonView.edit(chainAction, neonView.view.getCurrentPageURI()).then(() => { neonView.updateForCurrentPage(); });
}

/**
 * Function to handle re-associating elements to the nearest staff
 */
export function changeStaffHandler() {
  let toChange = [];
  var selected = Array.from(document.getElementsByClassName('selected'));
  selected.forEach(elem => {
    toChange.push(
      {
        'action': 'changeStaff',
        'param': {
          'elementId': elem.id
        }
      }
    );
  });
  let chainAction = {
    'action': 'chain',
    'param': toChange
  };
  endOptionsSelection();
  neonView.edit(chainAction, neonView.view.getCurrentPageURI()).then(() => { neonView.updateForCurrentPage(); });
}

/**
 * Trigger the extra nc action menu for a selection.
 */
export function triggerNcActions (nc: SVGGraphicsElement) {
  endOptionsSelection();
  try {
    let moreEdit = document.getElementById('moreEdit');
    moreEdit.classList.remove('is-invisible');
    moreEdit.innerHTML = Contents.ncActionContents;
  } catch (e) {}

  document.querySelector('#Punctum.dropdown-item')
    .addEventListener('click', () => {
      let unsetInclinatum = unsetInclinatumAction(nc.id);
      let unsetVirga = unsetVirgaAction(nc.id);
      neonView.edit({ 'action': 'chain', 'param': [ unsetInclinatum, unsetVirga ] }, neonView.view.getCurrentPageURI()).then((result) => {
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
      let setInclinatum = {
        'action': 'set',
        'param': {
          'elementId': nc.id,
          'attrType': 'tilt',
          'attrValue': 'se'
        }
      };
      neonView.edit(setInclinatum, neonView.view.getCurrentPageURI()).then((result) => {
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
      let unsetInclinatum = unsetInclinatumAction(nc.id);
      let setVirga = {
        'action': 'set',
        'param': {
          'elementId': nc.id,
          'attrType': 'tilt',
          'attrValue': 'n'
        }
      };
      neonView.edit({ 'action': 'chain', 'param': [ unsetInclinatum, setVirga ] }, neonView.view.getCurrentPageURI()).then((result) => {
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
    let del = document.getElementById('delete');
    del.removeEventListener('click', removeHandler);
    del.addEventListener('click', removeHandler);
  } catch (e) {}
  document.body.addEventListener('keydown', deleteButtonHandler);

  initOptionsListeners();
}

/**
 * Trigger extra neume actions.
 */
export function triggerNeumeActions () {
  endOptionsSelection();
  try {
    let moreEdit = document.getElementById('moreEdit');
    moreEdit.classList.remove('is-invisible');
    moreEdit.innerHTML = Contents.neumeActionContents;
  } catch (e) {}
  var neume = document.querySelectorAll('.selected');
  if (neume.length !== 1) {
    console.warn('More than one neume selected! Cannot trigger Neume ClickSelect actions.');
    return;
  }

  document.querySelector('.grouping')
    .addEventListener('click', (e) => {
      var contour = neonView.info.getContourByValue((<HTMLElement>e.target).id);
      triggerChangeGroup(contour);
    });

  function triggerChangeGroup (contour) {
    let changeGroupingAction = {
      'action': 'changeGroup',
      'param': {
        'elementId': neume[0].id,
        'contour': contour
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
    let del = document.getElementById('delete');
    del.removeEventListener('click', removeHandler);
    del.addEventListener('click', removeHandler);
  } catch (e) {}
  document.body.addEventListener('keydown', deleteButtonHandler);

  initOptionsListeners();
  Grouping.initGroupingListeners();
}

/**
 * Trigger extra syllable actions.
 */
export function triggerSylActions () {
  endOptionsSelection();
  try {
    let moreEdit = document.getElementById('moreEdit');
    moreEdit.classList.remove('is-invisible');
    moreEdit.innerHTML =
      "<div><p class='control'>" +
          "<button class='button' id='ungroupNeumes'>Ungroup</button></p></div>" +
      "<div><p class='control'>" +
          "<button class='button' id='delete'>Delete</button></p></div>" +
      "<div><p class='control'>" +
        "<button class='button' id='changeStaff'>Re-associate to nearest staff</button></p></div>";
    document.getElementById('changeStaff').addEventListener('click', changeStaffHandler);
  } catch (e) {}
  try {
    let del = document.getElementById('delete');
    del.removeEventListener('click', removeHandler);
    del.addEventListener('click', removeHandler);
  } catch (e) {}
  document.body.addEventListener('keydown', deleteButtonHandler);

  Grouping.initGroupingListeners();
}

/**
 * Trigger extra clef actions for a specific clef.
 */
export function triggerClefActions (clef: SVGGraphicsElement) {
  endOptionsSelection();
  try {
    let moreEdit = document.getElementById('moreEdit');
    moreEdit.classList.remove('is-invisible');
    moreEdit.innerHTML = Contents.clefActionContents;
  } catch (e) {}
  document.querySelector('#CClef.dropdown-item')
    .addEventListener('click', () => {
      let setCClef = {
        'action': 'setClef',
        'param': {
          'elementId': clef.id,
          'shape': 'C'
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
      let setFClef = {
        'action': 'setClef',
        'param': {
          'elementId': clef.id,
          'shape': 'F'
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
    let del = document.getElementById('delete');
    del.removeEventListener('click', removeHandler);
    del.addEventListener('click', removeHandler);
    document.getElementById('changeStaff').addEventListener('click', changeStaffHandler);
  } catch (e) {}
  document.body.addEventListener('keydown', deleteButtonHandler);


  initOptionsListeners();
}

/**
 * trigger extra custos actions.
 */
export function triggerCustosActions () {
  endOptionsSelection();
  try {
    let moreEdit = document.getElementById('moreEdit');
    moreEdit.classList.remove('is-invisible');
    moreEdit.innerHTML += Contents.custosActionContents;
  } catch (e) {}

  try {
    document.getElementById('changeStaff')
      .addEventListener('click', changeStaffHandler);
  } catch (e) {}

  try {
    let del = document.getElementById('delete');
    del.removeEventListener('click', removeHandler);
    del.addEventListener('click', removeHandler);
    document.body.addEventListener('keydown', deleteButtonHandler);
  } catch (e) {}
}

/**
 * Trigger extra staff actions.
 */
export function triggerStaffActions () {
  endOptionsSelection();
  try {
    let moreEdit = document.getElementById('moreEdit');
    moreEdit.classList.remove('is-invisible');
    moreEdit.innerHTML = Contents.staffActionContents;
  } catch (e) {}

  document.getElementById('merge-systems')
    .addEventListener('click', () => {
      let systems = document.querySelectorAll('.staff.selected');
      let elementIds = [];
      systems.forEach(staff => {
        elementIds.push(staff.id);
      });
      let editorAction = {
        'action': 'merge',
        'param': {
          'elementIds': elementIds
        }
      };
      neonView.edit(editorAction, neonView.view.getCurrentPageURI()).then((result) => {
        if (result) {
          Notification.queueNotification('Staff Merged');
          endOptionsSelection();
          neonView.updateForCurrentPage();
        } else {
          Notification.queueNotification('Merge Failed');
        }
      });
    });

  try {
    let del = document.getElementById('delete');
    del.removeEventListener('click', removeHandler);
    del.addEventListener('click', removeHandler);
  } catch (e) {}
  document.body.addEventListener('keydown', deleteButtonHandler);
}

/**
 * Trigger split staff option
 */
export function triggerSplitActions () {
  endOptionsSelection();
  try {
    let moreEdit = document.getElementById('moreEdit');
    moreEdit.classList.remove('is-invisible');
    moreEdit.innerHTML = Contents.splitActionContents;
  } catch (e) {}

  // TODO add trigger for split action
  document.getElementById('split-system')
    .addEventListener('click', () => {
      var split = new SplitHandler(neonView);
      split.startSplit();
      endOptionsSelection();
    });

  try {
    let del = document.getElementById('delete');
    del.removeEventListener('click', removeHandler);
    del.addEventListener('click', removeHandler);
  } catch (e) {}
  document.body.addEventListener('keydown', deleteButtonHandler);
}

/**
 * Trigger default selection option.
 */
export function triggerDefaultActions () {
  endOptionsSelection();
  try {
    let moreEdit = document.getElementById('moreEdit');
    moreEdit.classList.remove('is-invisible');
    moreEdit.innerHTML = Contents.defaultActionContents;
  } catch (e) {}

  try {
    let del = document.getElementById('delete');
    del.removeEventListener('click', removeHandler);
    del.addEventListener('click', removeHandler);
  } catch (e) {}
  document.body.addEventListener('keydown', deleteButtonHandler);
}

/**
 * End the extra options menu.
 */
export function endOptionsSelection () {
  try {
    let moreEdit = document.getElementById('moreEdit');
    moreEdit.innerHTML = '';
    moreEdit.classList.add('is-invisible');
  } catch (e) {}
  document.body.removeEventListener('keydown', deleteButtonHandler);
}

/**
 * Initialize extra dropdown options.
 */
function initOptionsListeners () {
  document.getElementById('drop_select').addEventListener('click', function () {
    this.classList.toggle('is-active');
  });
}

/** Event handler for delete button press. */
export function deleteButtonHandler (evt: KeyboardEvent) {
  if (evt.key === 'd' || evt.key === 'Backspace') { removeHandler(); evt.preventDefault(); }
}
