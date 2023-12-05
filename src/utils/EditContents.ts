/**
 * Contents of navbar menu after switching to edit mode.
 */

// "File" Dropdown
export const navbarDropdownFileMenu: HTMLDivElement = document.createElement('div');
navbarDropdownFileMenu.classList.add('navbar-item', 'has-dropdown', 'is-hoverable');
const fileDropdownBtn = document.createElement('div');
fileDropdownBtn.classList.add('navbar-btn');
fileDropdownBtn.innerHTML = '<div>File</div>';
const fileNavbarContents = document.createElement('div');
fileNavbarContents.classList.add('navbar-dropdown');
fileNavbarContents.id = 'navbar-dropdown-options';

const fileDropdownContents = [
  ['save', 'Save'],
  ['export', 'Save and Export to File'],
  ['getmei', 'Download MEI']
];

fileDropdownContents.forEach(content => {
  const item = document.createElement('div');
  item.id = content[0];
  item.classList.add('navbar-dropdown-item');
  item.textContent = content[1];
  fileNavbarContents.appendChild(item);
});

navbarDropdownFileMenu.appendChild(fileDropdownBtn);
navbarDropdownFileMenu.appendChild(fileNavbarContents);

// "MEI Actions" Dropdown
export const navbarDropdownMEIActionsMenu: HTMLDivElement = document.createElement('div');
navbarDropdownMEIActionsMenu.classList.add('navbar-item', 'has-dropdown', 'is-hoverable');
const meiActionsDropdownBtn = document.createElement('div');
meiActionsDropdownBtn.classList.add('navbar-btn');
meiActionsDropdownBtn.innerHTML = '<div>MEI Actions</div>';
const meiActionsNavbarContents = document.createElement('div');
meiActionsNavbarContents.classList.add('navbar-dropdown');
meiActionsNavbarContents.id = 'navbar-dropdown-options';
const meiActionsDropdownContents = [
  ['remove-empty-syls', 'Remove Empty Syllables'],
  ['remove-empty-neumes', 'Remove Empty Neumes'],
  ['revert', 'Revert']
];

meiActionsDropdownContents.forEach(content => {
  const item = document.createElement('div');
  item.id = content[0];
  item.classList.add('navbar-dropdown-item');
  item.textContent = content[1];
  meiActionsNavbarContents.appendChild(item);
});

navbarDropdownMEIActionsMenu.appendChild(meiActionsDropdownBtn);
navbarDropdownMEIActionsMenu.appendChild(meiActionsNavbarContents);

/**
 * Finalize option in the navbar for rodan
 */
export const navbarFinalize =
    '<a id="finalize" class="navbar-item"> Finalize MEI </a>';

/**
 * Contents of the undo/redo panel with buttons
 */
export const undoRedoPanel =
  `<button class="side-panel-btn" id="undo">Undo</button>
  <button class="side-panel-btn" id="redo">Redo</button>`;
