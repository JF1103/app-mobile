import React from 'react';
import {getCheckInOut} from './GetStorage';
import {SendArraaycheckInOut} from './SendArraayCheckInOut';
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
  /* 
  console.log('aarray storge', array); */
  if (array != null) {
    /*   console.log('entre en storage'); */
    array.checks.unshift({
      idusuario: idusuario,
      type: type,
      latitude: latitude,
      longitude: longitude,
      today: today,
      send: false,
    });
    await setCheckInOut(array);
  } else {
    /*   console.log('entre en null'); */
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
    /*  console.log('fichadas', array); */
    await setCheckInOut(array);
  }

  SendArraaycheckInOut();

  // SendCheckinOut(idusuario, type, latitude, longitude, today);
};
