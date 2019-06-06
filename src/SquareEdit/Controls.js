import * as Contents from './EditContents.js';
import * as Cursor from '../utils/Cursor.js';
import Icons from '../img/icons.svg';
import * as Notification from '../utils/Notification.js';
import { unselect } from './SelectTools.js';
const $ = require('jquery');

/**
 * Bind listeners to insert tabs.'
 * @param {InsertHandler} insertHandler - An InsertHandler to run the tasks.
 */
export function bindInsertTabs (insertHandler) {
  var insertTabs = $('.insertTab');
  var tabIds = $.map(insertTabs, function (tab, i) {
    return tab.id;
  });

  $.each(tabIds, function (i, tab) {
    $('#' + tab).on('click', () => {
      deactivate('.insertTab');
      activate(tab, insertHandler);
      Cursor.resetCursor();
      $('#insert_data').empty();
      $('#insert_data').append(Contents.insertTabHtml[tab]);
      bindElements(insertHandler);
    });
  });
}