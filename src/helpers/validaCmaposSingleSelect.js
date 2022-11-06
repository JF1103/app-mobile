import React from 'react';

export const validaCamposSingleSelect = (selectedItem, setsingleSelectReq) => {
  console.log('selectedItem', selectedItem);
  if (
    selectedItem === null ||
    selectedItem === '' ||
    selectedItem === undefined
  ) {
    setsingleSelectReq(true);
    return false;
  } else {
    setsingleSelectReq(false);
    return true;
  }
};
