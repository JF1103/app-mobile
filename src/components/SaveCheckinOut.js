import React from 'react';
import {getCheckInOut} from './GetStorage';
import {SendCheckinOut} from './SendCheckinOut';
import {setCheckInOut} from './SetStorage';

export const SaveCheckinOut = async (
  idusuario,
  type,
  latitude,
  longitude,
  today,
) => {
  let array = await getCheckInOut();

  console.log('aarray storge', array);
  if (array != null) {
    console.log('entre en storage');
    array.checks.push({
      idusuario: idusuario,
      type: type,
      latitude: latitude,
      longitude: longitude,
      today: today,
      send: false,
    });
    setCheckInOut(array);
  } else {
    array = {
      checks: [
        {
          idusuario: idusuario,
          type: type,
          latitude: latitude,
          longitude: longitude,
          today: today,
          send: false,
        },
      ],
    };
    console.log('fichadas', array);
    setCheckInOut(array);
  }

  /* SendCheckinOut(idusuario, type, latitude, longitude, today); */
};
