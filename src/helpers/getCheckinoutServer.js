import React from 'react';
import {getCheckInOut} from '../components/GetStorage';

export const getCheckinoutServer = async dataServer => {
  const asincData = await getCheckInOut();
  console.log('asincData', asincData);
  if (asincData !== null) {
    // si tiene datos en el storage se compara con los datos del servidor
    console.log('fecha  asinc ', asincData?.checks[0].today);
    console.log('fecha real ', dataServer?.ultimocheckin?.fechareal);
    if (dataServer?.ultimocheckin?.fechareal > asincData?.checks[0].today) {
      // si la fecha del ultimo checkin del servidor es mayor a la fecha del ultimo checkin del storage
      // se toma la  accion del servidor}
      console.log('se toma la accion del servidor');
      return dataServer?.ultimocheckin?.checkin;
    } else {
      // si la fecha del ultimo checkin del servidor es menor a la fecha del ultimo checkin del storage
      // se toma la  accion del storage
      console.log('entre en storage');
      return asincData?.checks[0].type;
    }
  } else {
    if (dataServer !== null) {
      // si no hay datos en el storage y si hay datos en el servidor
      console.log('no hay datos en el storage y si hay datos en el servidor');
      console.log('dataServer', dataServer?.ultimocheckin);
      return dataServer?.ultimocheckin?.checkin;
    } else {
      console.log(' no hay datos en el storage y no hay datos en el servidor');
      //si no tiene nada en el storage y no tiene nada en el servidor es in
      return 1;
    }
    return 1;
  }
};
