import React from 'react';

export const DivideRespMult = strResp => {
  console.log('strResp', strResp);
  let resp = strResp.respuesta.split('/**/');
  let respMult = [];
  resp.forEach(element => {
    respMult.push({id: element, value: element, isChecked: true});
  });
  return respMult;
};
