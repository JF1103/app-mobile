import React from 'react';
import {SendCheckinOut} from './SendCheckinOut';
import moment from 'moment';
import {SaveCheckinOut} from './SaveCheckinOut';
import {SendArraaycheckInOut} from './SendArraayCheckInOut';

export const CheckinOut = (getCurrentLocation, userInfo, type) => {
  const today = moment().format('YYYY-MM-DD HH:mm:ss');

  if (type === 0) {
    getCurrentLocation().then(location => {
      SendCheckinOut(
        userInfo.idusuario,
        type,
        location.latitude,
        location.longitude,
        today,
      );
    });
  } else {
    getCurrentLocation().then(location => {
      SaveCheckinOut(
        userInfo.idusuario,
        type,
        location.latitude,
        location.longitude,
        today,
      );
      //no enviar cuando este la funionalidad de enviar array
      /* SendCheckinOut(
        userInfo.idusuario,
        type,
        location.latitude,
        location.longitude,
        today,
      ); */
    });
  }
};
