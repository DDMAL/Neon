export const uploadAreaHTML = 
  `<div id="document-upload-container">

    <div id="initial_upload_container">
      <div id="initial_upload_area">
        <div id="initial_upload_message">Upload Files</div>
      </div>
    </div>
    
    <div id="uploading_container">
      <div class="file_container" id="unpaired_container">

        <div class="file-container-title">Unpaired Documents</div>

        <div id="files_container">

          <div id="mei_container">
            <div class="file_heading">MEI</div>
            <div class="file_sort_name">
              <div>Name</div>
              <div class="sort_name arrow_btn">&#x22C0;</div>
            </div>
            <div class="file_list" id="mei_list" style="position: relative;">
              <div class="unpaired_item_container" style="position: absolute; bottom: 0;">
                <label class="unpaired_item_label">
                  <input type="radio" class="unpaired_item_radio" name="mei_radio_group" value="create_mei">
                    <span style="margin-top: auto;margin-left: 3px;">
                      Create new MEI file
                    </span>
                </label>
              </div>
            </div>
          </div>

          <div id="image_container">
            <div class="file_heading">Images</div>
            <div class="file_sort_name">
              <div>Name</div>
              <div class="sort_name arrow_btn">&#x22C0;</div>
            </div>
            <div class="file_list" id="image_list"></div>
          </div>

        </div>

        <div id="generate-pair-button-container">
          <div class="action_button" id="make_pair">Make Pair</div>
        </div>
      </div>

      <div class="file_container" id="paired_container">

        <div class="file-container-title">Paired Folios</div>
        <div class="file_sort_name">
          <div>Name</div>
          <div class="sort_name arrow_btn">&#x22C0;</div>
        </div>
        <div class="folio_list" id="paired_list"></div>

        <div id="upload_button_container">
          <div class="action_button" id="upload_button">
            Upload
            <div id="uploading_spinner">↻</div>
          </div>
        </div>

      </div>

      <!--
      <div class="file_container" id="manuscripts_container">
        <h2 class="file_heading">Manuscripts</h2>
        <div class="folio_list" id="manuscript_list"></div>
      </div>
      -->

    </div>
  </div>`;

export const newFolderHTML = `
    <div id="rename_container">
      <div id="dashboard_input_container">
      </div>
      <div id="rename_buttons_container">
        <button id="cancel_dashboard">Cancel</button>
        <button id="confirm_dashboard">Create</button>
      </div>
    </div>
  `;

export const renameHTML = `
    <div id="rename_container">
      <div id="dashboard_input_container">
      </div>
      <div id="rename_buttons_container">
        <button id="cancel_dashboard">Cancel</button>
        <button id="confirm_dashboard">Confirm</button>
      </div>
    </div>
  `;