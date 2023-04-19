import axios from 'axios';
import React from 'react';
import {BASE_URL} from '../config';

export const SendFakeGps = (idUsuario, timestamp) => {
  const formData = new FormData();
  formData.append('refusuarios', idUsuario);
  formData.append('fecha', timestamp);

  axios
    .post(`${BASE_URL}fakegeolocalizacion/insertar.php`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(res => {
      console.log(res);
    })
    .catch(e => {
      console.log(`sendFakeGps error ${e}`);
    });
};
