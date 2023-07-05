/**
 * HTML for each insert tab (neume, grouping, clef, system, and division).
 */
export const insertTabHtml: Record<string, string> = {
  primitiveTab: 
        `<p class="insert-element-container">
            <button id="punctum" class="side-panel-btn insertel smallel" aria-label="punctum" title="punctum"><img src="${__ASSET_PREFIX__}assets/img/punctum.png" class="image"/></button>
        </p>
        <p class="insert-element-container">
            <button id="virga" class="side-panel-btn insertel smallel" aria-label="virga" title="virga"><img src="${__ASSET_PREFIX__}assets/img/virga.png" class="image"></button>
        </p>
        <p class="insert-element-container">
            <button id="virgaReversed" class="side-panel-btn insertel smallel" aria-label="Reversed Virga" title="Reversed Virga"><img src="${__ASSET_PREFIX__}assets/img/virga_reversed.png" class="image"></button>
        </p>
        <p class="insert-element-container">
            <button id="diamond" class="side-panel-btn insertel smallel" aria-label="inclinatum" title="inclinatum"><img src="${__ASSET_PREFIX__}assets/img/diamond.png" class="image"></button>
        </p>
        <p class="insert-element-container">
            <button id="custos" class="side-panel-btn insertel smallel" aria-label="custos" title="custos"><img src="${__ASSET_PREFIX__}assets/img/custos.png" class="image"></button>
        </p>
        <p class="insert-element-container">
            <button id="cClef" class="side-panel-btn insertel smallel" aria-label="C Clef" title=" C Clef"><img src="${__ASSET_PREFIX__}assets/img/cClef.png" class="image"></button>
        </p>
        <p class="insert-element-container">
            <button id="fClef" class="side-panel-btn insertel smallel" aria-label="F Clef" title="F Clef"><img src="${__ASSET_PREFIX__}assets/img/fClef.png" class="image"></button>
        </p>
        <p class="insert-element-container">
            <button id="liquescentA" class="side-panel-btn insertel smallel" aria-label="Liquescent A" title="Liquescent A"><img src="${__ASSET_PREFIX__}assets/img/liquescentA.png" class="image"></button>
        </p>
        <p class="insert-element-container">
            <button id="liquescentC" class="side-panel-btn insertel smallel" aria-label="Liquescent C" title="Liquescent C"><img src="${__ASSET_PREFIX__}assets/img/liquescentC.png" class="image"></button>
        </p>
        <p class="insert-element-container">
            <button id="flat" class="side-panel-btn insertel smallel" aria-label="Flat" title="Flat"><img src="${__ASSET_PREFIX__}assets/img/accidFlat.png" class="image"></button>
        </p>
        <p class="insert-element-container">
            <button id="natural" class="side-panel-btn insertel smallel" aria-label="Natural" title="Natural"><img src="${__ASSET_PREFIX__}assets/img/accidNatural.png" class="image"></button>
        </p> 
        <p class="insert-element-container">
            <button id="divLineMaxima" class="side-panel-btn insertel smallel" aria-label="DivLine Maxima" title="DivLine Maxima"><img src="${__ASSET_PREFIX__}assets/img/divisio.png" class="image"></button>
        </p>`,
  groupingTab: 
        `<p class="insert-element-container">
            <button id="pes" class="side-panel-btn insertel smallel" aria-label="pes" title="pes"><img src="${__ASSET_PREFIX__}assets/img/pes.png" class="image"></button>
        </p>
        <p class="insert-element-container">
            <button id="clivis" class="side-panel-btn insertel smallel" aria-label="clivis" title="clivis"><img src="${__ASSET_PREFIX__}assets/img/clivis.png" class="image"></button>
        </p>
        <p class="insert-element-container">
            <button id="scandicus" class="side-panel-btn insertel smallel" aria-label="scandicus" title="scandicus"><img src="${__ASSET_PREFIX__}assets/img/scandicus.png" class="image"></button>
        </p>
        <p class="insert-element-container">
            <button id="climacus" class="side-panel-btn insertel smallel" aria-label="climacus" title="climacus"><img src="${__ASSET_PREFIX__}assets/img/climacus.png" class="image"></button>
        </p>
        <p class="insert-element-container">
            <button id="torculus" class="side-panel-btn insertel smallel" aria-label="toculus" title="toculus"><img src="${__ASSET_PREFIX__}assets/img/torculus.png" class="image"></button>
        </p>
        <p class="insert-element-container">
            <button id="porrectus" class="side-panel-btn insertel smallel" aria-label="porrectus" title="porrectus"><img src="${__ASSET_PREFIX__}assets/img/porrectus.png" class="image"></button>
        </p>
        <p class="insert-element-container">
            <button id="pressus" class="side-panel-btn insertel smallel" aria-label="pressus" title="pressus"><img src="${__ASSET_PREFIX__}assets/img/pressus.png" class="image"></button>
        </p>`,
  systemTab: 
        `<p class="insert-element-container">
            <button id="staff" class="side-panel-btn insertel longel" aria-label="system" title="system"><img src="${__ASSET_PREFIX__}assets/img/staff.png" class="image"></button>
        </p>
        <p>Click upper left and lower right corners of new staff.</p>`
  // divisionTab: "<p class='insert-element-container'>" +    
  // "<button id='smallDiv' class='side-panel-btn insertel tallel'><img src='" + __ASSET_PREFIX__ + 'assets/img/smalldiv.png "' class='image'/></button></p>" +
  // "<p class='insert-element-container'>" +
  //     "<button id='minorDiv' class='side-panel-btn insertel tallel'><img src='" + __ASSET_PREFIX__ + 'assets/img/minordiv.png"' class='image'/></button></p>" +
  //     "<p class='insert-element-container'>" +
  // "<button id='majorDiv' class='side-panel-btn insertel tallel'><img src='" + __ASSET_PREFIX__ + 'assets/img/majordiv.png "' class='image'/></button></p>" +
  // "<p class='insert-element-container'>" +
  // "<button id='finalDiv' class='side-panel-btn insertel tallel'><img src='" + __ASSET_PREFIX__ + 'assets/img/finaldiv.png "' class='image'/></button></p>"
};

/**
 * Structure of insert panel with basic grouping tabs.
 */
export const insertControlsPanel =
    `<div class="panel-heading" id="insertMenu">
        <div class="panel-heading-title">INSERT</div>
        <svg class="icon is-pulled-right">
            <use id="toggleInsert" xlink:href="${__ASSET_PREFIX__}assets/img/icons.svg#dropdown-down"></use>
        </svg>
    </div>
	<div class="panel-content-subsection first-subsection">
        <div id="insertContents" class="panel-contents" style="overflow-y: hidden;">
            <p class="panel-tabs">
                <a id="primitiveTab" class="insertTab">Primitive Elements</a>
                <a id="groupingTab" class="insertTab">Grouping</a>
                <a id="systemTab" class="insertTab">System</a>
            </p>
            <div id="insert_data"></div>
        </div>
    </div>`;

/**
 * Contents of edit panel with buttons.
 */
export const editControlsPanel =
    `<div class="panel-heading" id="editMenu">
        <div class="panel-heading-title focused">EDIT</div>
        <svg class="icon is-pulled-right">
            <use id="toggleEdit" xlink:href="${__ASSET_PREFIX__}assets/img/icons.svg#dropdown-down"></use>
        </svg>
    </div>
    <div id="editContents" class="panel-contents">
        <div class="panel-content-subsection first-subsection">
            <div id="selection-mode-container">
                <div class="panel-sub-title">Selection Mode:</div>
                <div id="selection-mode-btns-container"  class="right-side-panel-btns-container" style="overflow-x: auto;">
                    
                        <button class="side-panel-btn sel-by" id="selBySyllable">Syllable</button>
                        <button class="side-panel-btn sel-by" id="selByNeume">Neume</button>
                        <button class="side-panel-btn sel-by" id="selByNc">Neume Component</button>
                        <button class="side-panel-btn sel-by" id="selByStaff">Staff</button>
                        <button class="side-panel-btn sel-by" id="selByLayerElement">Layer Element</button>
                    
                </div>
            </div>
        </div>

        <div id="display-slider-actions-container">
                <div class="panel-content-subsection hidden">
                    <div id="moreEdit"></div>
                </div>
                <div class="panel-content-subsection hidden">
                    <div id="extraEdit"></div>
                </div>
                    <!--
                    * The extraEdit panel is added for edit options that have dropdown menus
                    * Like the Neume and Clef menus
                    * This is done because the moreEdit menu needs to have overflow for cases where it has lots of buttons
                    * But overflow ruins dropdown menus
                    -->
                <div class="panel-content-subsection hidden">
                    <div id="neumeEdit"></div>
                </div>
                <div class="panel-content-subsection">
                    <div id="undoRedo_controls"></div>
                </div>
        </div>
    </div>`;


/**
 * Contents of extra nc action menu.
 */
export const ncActionContents =
    `<label>Change Head Shape:</label>
    <div class="drop_select dropdown">
        <div class="dropdown-trigger">
            <button id="select-options" class="side-panel-btn" aria-haspopup="true" aria-controls="dropdown-menu">
                <span>Head Shapes</span>
                <svg class="icon"><use xlink:href="${__ASSET_PREFIX__}assets/img/icons.svg#dropdown-down"></use></svg>
            </button>
        </div>
        <div class="dropdown-menu" id="dropdown-menu" role="menu">
            <div class="dropdown-content">
                <a id="Inclinatum" class="dropdown-item">Inclinatum</a>
                <a id="LiquescentAnticlockwise" class="dropdown-item">Liquescent A</a>
                <a id="LiquescentClockwise" class="dropdown-item">Liquescent C</a>
                <a id="Punctum" class="dropdown-item">Punctum</a>
                <a id="Virga" class="dropdown-item">Virga</a> 
                <a id="VirgaReversed" class="dropdown-item">Reversed Virga</a>
            </div>
        </div>
    </div>`;

/**
 * Contents of basic neume action menu.
 */
export const defaultNeumeActionContents =
    `<div class="right-side-panel-btns-container">
        <button class="side-panel-btn" id="delete">Delete</button>
        <button class="side-panel-btn" id="split-neume">Split Neumes</button>
    </div>`;

/**
 * Contents of extra neume action menu.
 */
export const neumeActionContents =
    `<label>Grouping Options:</label>
    <div class="right-side-panel-btns-container">
        <div class="drop_select dropdown">
            <div class="dropdown-trigger">
                <button id="select-options" class="side-panel-btn" aria-haspopup="true" aria-controls="dropdown-menu">
                    <span>Groupings</span>
                    <svg class="icon">
                        <use xlink:href="${__ASSET_PREFIX__}assets/img/icons.svg#dropdown-down"></use>
                    </svg>
                </button>
            </div>
            <div class="dropdown-menu" id="dropdown-menu" role="menu">
            <div class="dropdown-content scrollable-dropdown">
                <a id="Climacus" class="dropdown-item grouping">Climacus</a>
                <a id="ClimacusResupinus" class="dropdown-item grouping">Climacus Resupinus</a>
                <a id="Clivis" class="dropdown-item grouping">Clivis</a>
                <a id="Pes" class="dropdown-item grouping">Pes</a>
                <a id="PesSubpunctis" class="dropdown-item grouping">Pes Subpunctis</a>
                <a id="Porrectus" class="dropdown-item grouping">Porrectus</a>
                <a id="PorrectusFlexus" class="dropdown-item grouping">Porrectus Flexus</a>
                <a id="PorrectusSubpunctis" class="dropdown-item grouping">Porrectus Subpunctis</a>
                <a id="Pressus" class="dropdown-item grouping">Pressus</a>
                <a id="Scandicus" class="dropdown-item grouping">Scandicus</a>
                <a id="ScandicusFlexus" class="dropdown-item grouping">Scandicus Flexus</a>
                <a id="ScandicusSubpunctis" class="dropdown-item grouping">Scandicus Subpunctis</a>
                <a id="Torculus" class="dropdown-item grouping">Torculus</a>
                <a id="TorculusResupinus" class="dropdown-item grouping">Torculus Resupinus</a>
            </div>
        </div>
    </div>
    <button class="side-panel-btn" id="ungroupNcs">Ungroup</button>`;

/**
 * Contents of extra staff action menu.
 */
export const staffActionContents =
    `<label>Merge Systems:</label>
    <button id="merge-systems" class="side-panel-btn">Merge</button>
    <button class="side-panel-btn" id="delete">Delete</button>`;

/**
 * Contents of default action menu.
 */
export const defaultActionContents = 
    `<div class="right-side-panel-btns-container">
        <button class="side-panel-btn" id="delete">Delete</button>
    </div>`;

/**
 * Contents of default action menu when selecting by syllable
 * Same as above except includes re-associate to nearest staff
 */
export const defaultSylActionContents =
    `<button class="side-panel-btn" id="delete">Delete</button>
    <button class="side-panel-btn" id="changeStaff">Re-associate to nearest staff</button>`;
    
/**
 * Contents of custos action menu.
 */
export const custosActionContents =
    `<div class="right-side-panel-btns-container">
        <button class="side-panel-btn" id="delete">Delete</button>
        <button class="side-panel-btn" id="changeStaff">Re-associate to nearest staff</button>
    </div>`;

/**
 * Contents of layer element (outside syllable) action menu.
 */
export const layerElementOutActionContents =
    `<div class="right-side-panel-btns-container">
        <button class="side-panel-btn" id="delete">Delete</button>
        <button class="side-panel-btn" id="insertToSyllable">Insert to nearest syllable</button>
        <button class="side-panel-btn" id="changeStaff">Re-associate to nearest staff</button>
    </div>`;

/**
 * Contents of layer element (inside syllable) action menu.
 */
export const layerElementInActionContents =
    `<div class="right-side-panel-btns-container">
        <button class="side-panel-btn" id="delete">Delete</button>
        <button class="side-panel-btn" id="moveOutsideSyllable">Move outside syllable</button>
        <button class="side-panel-btn" id="changeStaff">Re-associate to nearest staff</button>
    </div>`;

/**
 * Contents of accid action menu.
 */
export const accidActionContents =
    `<label>Change Accidental:</label>
    <div class="drop_select dropdown">
        <div class="dropdown-trigger"overflow="auto">
            <button id="select-options" class="side-panel-btn" aria-haspopup="true" aria-controls="dropdown-menu">
                <span>Shapes</span>
                <svg class="icon"><use xlink:href="${__ASSET_PREFIX__}assets/img/icons.svg#dropdown-down"></use></svg>
            </button>
        </div>
        <div class="dropdown-menu" id="dropdown-menu" role="menu">
            <div class="dropdown-content">
                <a id="ChangeToFlat" class="dropdown-item">Flat</a>
                <a id="ChangeToNatural" class="dropdown-item">Natural</a>
            </div>
        </div>
    </div>`;

/**
 * Contents of split action menu.
 */
export const splitActionContents =
    `<div>Split System:</div>
    <div id="split-system-btns-container" class="right-side-panel-btns-container">
        <button id="split-system" class="side-panel-btn">Split</button>
        <button id="reset-rotate" class="side-panel-btn">Reset Rotate</button>
        <button class="side-panel-btn" id="delete">Delete</button>
    </div>`;

/**
 * Contents of extra clef action menu.
 */
export const clefActionContents =
    `
    <div class="right-side-panel-btns-container">
        <div class="drop_select dropdown">
            <div class="dropdown-trigger" overflow="auto">
                <button id="select-options" class="side-panel-btn" aria-haspopup="true" aria-controls="dropdown-menu">
                    <span>Displace Octave</span>
                    <svg class="icon"><use xlink:href="${__ASSET_PREFIX__}assets/img/icons.svg#dropdown-down"></use></svg>
                </button>
            </div>
            <div class="dropdown-menu" id="dropdown-menu" role="menu">
                <div class="dropdown-content">
                    <a id="increment-octave" class="dropdown-item">+1 Octave</a>
                    <a id="decrement-octave" class="dropdown-item">-1 Octave</a>
                </div>
            </div>
        </div>
        <div class="drop_select dropdown">
            <div class="dropdown-trigger" overflow="auto">
                <button id="select-options" class="side-panel-btn" aria-haspopup="true" aria-controls="dropdown-menu">
                    <span>Change Clef Shape</span>
                    <svg class="icon"><use xlink:href="${__ASSET_PREFIX__}assets/img/icons.svg#dropdown-down"></use></svg>
                </button>
            </div>
            <div class="dropdown-menu" id="dropdown-menu" role="menu">
                <div class="dropdown-content">
                    <a id="CClef" class="dropdown-item">C Clef</a>
                    <a id="FClef" class="dropdown-item">F Clef</a>
                </div>
            </div>
        </div>
    </div>
    `;

/**
 * Contents of divLine type action menu.
 */
export const divLineActionContents =
`<label>Change DivLine:</label>
<div class="drop_select dropdown">
    <div class="dropdown-trigger"overflow="auto">
        <button id="select-options" class="side-panel-btn" aria-haspopup="true" aria-controls="dropdown-menu">
            <span>Shapes</span>
            <svg class="icon"><use xlink:href="${__ASSET_PREFIX__}assets/img/icons.svg#dropdown-down"></use></svg>
        </button>
    </div>
    <div class="dropdown-menu" id="dropdown-menu" role="menu">
        <div class="dropdown-content">
            <a id="ChangeToCaesura" class="dropdown-item">Caesura</a>
            <a id="ChangeToFinalis" class="dropdown-item">Finalis</a>
            <a id="ChangeToMinima" class="dropdown-item">Minima</a>
            <a id="ChangeToMaior" class="dropdown-item">Maior</a>
            <a id="ChangeToMaxima" class="dropdown-item">Maxima</a>
            <a id="ChangeToVirgula" class="dropdown-item">Virgula</a>
        </div>
    </div>
</div>`;

/**
 * HTML for grouping selection menu.
 */
export const groupingMenu = {
  nc: `<div class="more-edit-btn panel-btn">
            <div class="right-side-panel-btns-container">
                <button class="side-panel-btn more-edit-btn" id="groupNcs">Group Neume Components</button>
                <button class="side-panel-btn" id="delete">Delete</button>
            </div>
        </div>`,
  neume: `<div class="more-edit-btn panel-btn">
            <div class="right-side-panel-btns-container">
                <button class="side-panel-btn" id="groupNeumes">Group Neumes</button>
                <button class="side-panel-btn" id="delete">Delete</button>
            </div>
        </div>`,
  syl: `<div class="more-edit-btn panel-btn">
            <div class="right-side-panel-btns-container">
                <button class="side-panel-btn" id="mergeSyls">Merge Syllables</button>
                <button class="side-panel-btn" id="delete">Delete</button>
                <button class="side-panel-btn" id="changeStaff">Re-associate to nearest staff</button>
            </div>
		</div>`,
  ligatureNc: `<div class="more-edit-btn panel-btn">
                    <div class="right-side-panel-btns-container">
                        <button class="side-panel-btn" id="groupNcs">Group Neume Components</button>
                        <button class="side-panel-btn" id="toggle-ligature">Toggle Ligature</button>
                        <button class="side-panel-btn" id="delete">Delete</button>
                    </div>
                </div>`,
  ligature: `<div class="more-edit-btn panel-btn">
                <div class="right-side-panel-btns-container">
                    <button class="side-panel-btn" id="toggle-ligature">Toggle Ligature</button>
                    <button class="side-panel-btn" id="delete">Delete</button>
                </div>
            </div>`,
  splitSyllable: `<div class="more-edit-btn panel-btn">
                    <div class="right-side-panel-btns-container">
                        <button class="side-panel-btn" id="toggle-link">Toggle Linked Syllables</button>
                        <button class="side-panel-btn" id="delete">Delete</button>
                    </div>
                </div>`
};



/* BGINNING OF MODAL WINDOW CONTENT SECTION */

/**
 * HTML for Edit Syllable Text modal window
 */
export const editTextModal = 
    `<div class="neon-modal-window-content" id="neon-modal-window-content-edit-text">
        <label for="neon-modal-window-edit-text-input" id="neon-modal-window-edit-text-label">Enter Syllable Text:</label>
        <input id="neon-modal-window-edit-text-input" type="text">
        <div id="neon-modal-window-edit-text-btns">
        <div class="neon-modal-window-btn" id="neon-modal-window-edit-text-cancel">Cancel</div>
        <div class="neon-modal-window-btn" id="neon-modal-window-edit-text-save">Save</div>        
        </div>
    </div>`;


/**
 * HTML for Hotkeys modal window
 */
export const hotkeysModal = `
    <div class="neon-modal-window-content" id="neon-modal-window-content-hotkeys">
        <!-- "Display" hotkeys -->
        <div class="hotkey-subcategory-container">
            <div class="hotkey-subcategory-title">Display</div>
            <div class="hotkey-entry-container">
                <div class="hotkey-container">
                    <div class="hotkey-entry">Shift</div>
                    <div>+</div>
                    <div class="hotkey-entry">+</div>
                </div>
                <div class="hotkey-entry-description">Zoom In</div>
            </div>
            <div class="hotkey-entry-container">
                <div class="hotkey-container">
                    <div class="hotkey-entry">Shift</div>
                    <div>+</div>
                    <div class="hotkey-entry">-</div>
                </div>
                <div class="hotkey-entry-description">Zoom Out</div>
            </div>
            <div class="hotkey-entry-container">
                <div class="hotkey-container">
                    <div class="hotkey-entry">0</div>
                </div>
                <div class="hotkey-entry-description">Zoom Reset</div>
            </div>
            <div class="hotkey-entry-container">
                <div class="hotkey-container">
                    <div class="hotkey-entry">h</div>
                </div>
                <div class="hotkey-entry-description">Hide Glyph</div>
            </div>
            <div class="hotkey-entry-container">
                <div class="hotkey-container">
                    <div class="hotkey-entry">Shift</div>
                    <div>+</div>
                    <div class="hotkey-entry">T</div>
                </div>
                <div class="hotkey-entry-description">Scroll To Syllable Text</div>
            </div>
        </div>

        <!-- "Edit" hotkeys -->
        <div class="hotkey-subcategory-container">
            <div class="hotkey-subcategory-title">Edit</div>
            <div class="hotkey-entry-container">
                <div class="hotkey-container">
                    <div class="hotkey-entry">Ctrl</div>
                    <div>+</div>
                    <div class="hotkey-entry">z</div>
                    <div>or</div>
                    <div class="hotkey-entry">⌘</div>
                    <div>+</div>
                    <div class="hotkey-entry">z</div>
                </div>
                <div class="hotkey-entry-description">Undo</div>
            </div>
            <div class="hotkey-entry-container">
                <div class="hotkey-container">
                    <div class="hotkey-entry">Ctrl</div>
                    <div>+</div>
                    <div class="hotkey-entry">Shift</div>
                    <div>+</div>
                    <div class="hotkey-entry">z</div>
                    <div>or</div>
                    <div class="hotkey-entry">⌘</div>
                    <div>+</div>
                    <div class="hotkey-entry">Shift</div>
                    <div>+</div>
                    <div class="hotkey-entry">z</div>
                </div>
                <div class="hotkey-entry-description">Redo</div>
            </div>
            <div class="hotkey-entry-container">
                <div class="hotkey-container">
                    <div class="hotkey-entry">q/w/e/r/t/y</div>
                </div>
                <div class="hotkey-entry-description">
                    Highlight by Staff/Syllable/Neume/LayerElement/Selection/Off
                </div>
            </div>
            <div class="hotkey-entry-container">
                <div class="hotkey-container">
                    <div class="hotkey-entry">1/2/3/4/5/6</div>
                </div>
                <div class="hotkey-entry-description">
                    Select by Syllable/Neume/Neume Component/Staff/Layer Element/BBox
                </div>
            </div>
            <div class="hotkey-entry-container">
                <div class="hotkey-container">
                    <div class="hotkey-entry">Shift</div>
                    <div>+</div>
                    <div class="hotkey-entry">Number</div>
                </div>
                <div class="hotkey-entry-description">
                    Begin Insert for the <i>nth</i> option in the selected tab
                </div>
            </div>
        </div>

        <!-- "Other" hotkeys -->
        <div class="hotkey-subcategory-container">
            <div class="hotkey-subcategory-title">Other</div>
            <div class="hotkey-entry-container">
                <div class="hotkey-container">
                    <div class="hotkey-entry">s</div>
                </div>
                <div class="hotkey-entry-description">Save File</div>
            </div>
            <div class="hotkey-entry-container">
                <div class="hotkey-container">
                    <div class="hotkey-entry">Esc</div>
                </div>
                <div class="hotkey-entry-description">Return to Edit Mode</div>
            </div>
        </div>
    </div>`;

export const syllableActionsContent = `
  <div class="right-side-panel-btns-container">
    <button class="side-panel-btn" id="mergeSyls">Merge Syllables</button>
    <button class="side-panel-btn" id="ungroupNeumes">Ungroup</button>
    <button class="side-panel-btn" id="delete">Delete</button>
    <button class="side-panel-btn" id="changeStaff">Re-associate to nearest staff</button>
  </div>
`;

export const errorLogsPanelContents = 
    `<div class="panel-heading" id="errorLogHeading">
        <div class="panel-heading-title">Error Log</div>
        <svg class="icon">
            <use id="toggleErrorLog" xlink:href="${__ASSET_PREFIX__}/assets/img/icons.svg#dropdown-down"></use>
        </svg>
    </div>
    <div class="panel-contents" id="errorLogContents" style="overflow: scroll; padding: 0.5em 0.75em;"><div>`;
