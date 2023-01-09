import React, {useContext} from 'react';
import {BASE_URL} from '../config';
import {AuthContext} from '../context/AuthContext';

export const SendCheckinOut = (idusuario, check, latitud, longitud, fecha) => {
  formdata = new FormData();
  formdata.append('refusuarios', idusuario);
  formdata.append('checkin', check);
  formdata.append('latitud', latitud);
  formdata.append('longitud', longitud);
  formdata.append('fecha', fecha);

  console.log('formdata', formdata);

  fetch(BASE_URL + '/ubicacionusuarios/insert.php', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    body: formdata,
  })
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);
    })
    .catch(error => {
      console.error(error);
    });
};
