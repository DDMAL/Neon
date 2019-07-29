/* eslint-env jest */
'use strict';

var index = 0;
const uuidList = [
  '06ac61aa-e700-44d9-8000-199d8e778c9f'
];

function v4 () {
  if (index < uuidList.length) {
    return uuidList[index++];
  } else {
    return uuidList[uuidList.length - 1];
  }
}

module.exports = v4;
