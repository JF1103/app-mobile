import React from 'react';

export const validaTextArea = (text, settextAreaReq) => {
  if (text === null || text === '' || text === undefined) {
    settextAreaReq(true);
    return false;
  } else {
    settextAreaReq(false);
    return true;
  }
};
