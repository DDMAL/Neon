// If user right-clicks on background and nothing is selected
export const defaultOptions = 
    `<div id="cm-upload-doc-btn" class="context-menu-item-wrapper">
        <div class="context-menu-item">Upload document</div>
        <img class="context-menu-item-icon" src="${__ASSET_PREFIX__}assets/img/new-doc.svg">
    </div>
    <div id="cm-new-folder-btn" class="context-menu-item-wrapper">
        <div class="context-menu-item">New folder</div>
        <img class="context-menu-item-icon" src="${__ASSET_PREFIX__}assets/img/new-folder.svg">
    </div>`;

// If a single file is selected
export const singleFileOptions = 
    `<div id="cm-open-btn" class="context-menu-item-wrapper">
        <div class="context-menu-item">Open</div>
        <img class="context-menu-item-icon" src="${__ASSET_PREFIX__}assets/img/open-doc.svg">
    </div>
    <div id="cm-remove-btn" class="context-menu-item-wrapper">
        <div class="context-menu-item">Move to Trash</div>
        <img class="context-menu-item-icon" src="${__ASSET_PREFIX__}assets/img/remove-doc.svg">
    </div>
    <div id="cm-rename-btn" class="context-menu-item-wrapper">
        <div class="context-menu-item">Rename</div>
        <img class="context-menu-item-icon" src="${__ASSET_PREFIX__}assets/img/rename-doc.svg">
    </div>
    <div id="cm-move-btn" class="context-menu-item-wrapper">
        <div class="context-menu-item">Move</div>
        <img class="context-menu-item-icon" src="${__ASSET_PREFIX__}assets/img/move-doc-icon.svg">
    </div>`;

// If multiple files are selected
export const multiFileOptions = 
    `<div id="cm-open-btn" class="context-menu-item-wrapper">
        <div class="context-menu-item">Open</div>
        <img class="context-menu-item-icon" src="${__ASSET_PREFIX__}assets/img/open-doc.svg">
    </div>
    <div id="cm-remove-btn" class="context-menu-item-wrapper">
        <div class="context-menu-item">Move to Trash</div>
        <img class="context-menu-item-icon" src="${__ASSET_PREFIX__}assets/img/remove-doc.svg">
    </div>
    <div id="cm-move-btn" class="context-menu-item-wrapper">
        <div class="context-menu-item">Move</div>
        <img class="context-menu-item-icon" src="${__ASSET_PREFIX__}assets/img/move-doc-icon.svg">
    </div>`;

// If 1 or more files and 1 or more folders are selected
export const folderAndFileOptions = 
    `<div id="cm-remove-btn" class="context-menu-item-wrapper">
        <div class="context-menu-item">Delete</div>
        <img class="context-menu-item-icon" src="${__ASSET_PREFIX__}assets/img/remove-doc.svg">
    </div>
    <div id="cm-move-btn" class="context-menu-item-wrapper">
        <div class="context-menu-item">Move</div>
        <img class="context-menu-item-icon" src="${__ASSET_PREFIX__}assets/img/move-doc-icon.svg">
    </div>`;

// If one folder is selected
export const singleFolderOptions = 
    `<div id="cm-open-btn" class="context-menu-item-wrapper">
        <div class="context-menu-item">Open</div>
        <img class="context-menu-item-icon" src="${__ASSET_PREFIX__}assets/img/open-doc.svg">
    </div>
    <div id="cm-remove-btn" class="context-menu-item-wrapper">
        <div class="context-menu-item">Move to Trash</div>
        <img class="context-menu-item-icon" src="${__ASSET_PREFIX__}assets/img/remove-doc.svg">
    </div>
    <div id="cm-rename-btn" class="context-menu-item-wrapper">
        <div class="context-menu-item">Rename</div>
        <img class="context-menu-item-icon" src="${__ASSET_PREFIX__}assets/img/rename-doc.svg">
    </div>
    <div id="cm-move-btn" class="context-menu-item-wrapper">
        <div class="context-menu-item">Move</div>
        <img class="context-menu-item-icon" src="${__ASSET_PREFIX__}assets/img/move-doc-icon.svg">
    </div>`;

// If multiple folders are selected
export const multiFolderOptions = 
    `<div id="cm-remove-btn" class="context-menu-item-wrapper">
        <div class="context-menu-item">Move to Trash</div>
        <img class="context-menu-item-icon" src="${__ASSET_PREFIX__}assets/img/remove-doc.svg">
    </div>
    <div id="cm-move-btn" class="context-menu-item-wrapper">
        <div class="context-menu-item">Move</div>
        <img class="context-menu-item-icon" src="${__ASSET_PREFIX__}assets/img/move-doc-icon.svg">
    </div>`;

// If trash folder is selected
export const trashFolderOptions = 
    `<div id="cm-delete-btn" class="context-menu-item-wrapper">
        <div class="context-menu-item">Empty Trash</div>
        <img class="context-menu-item-icon" src="${__ASSET_PREFIX__}assets/img/remove-doc.svg">
    </div>`;

// If entry in trash folder is selected
export const trashEntryOptions = 
    `<div id="cm-recover-btn" class="context-menu-item-wrapper">
        <div class="context-menu-item">Recover</div>
        <img class="context-menu-item-icon" src="${__ASSET_PREFIX__}assets/img/recover-doc.svg">
    </div>
    <div id="cm-delete-btn" class="context-menu-item-wrapper">
        <div class="context-menu-item">Delete</div>
        <img class="context-menu-item-icon" src="${__ASSET_PREFIX__}assets/img/remove-doc.svg">
    </div>`;

