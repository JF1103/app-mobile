import moment from 'moment';
import React from 'react';
import {ToastAndroid} from 'react-native';
import {SendFakeGps} from './SendFakeGps';

export const FakeGpsError = idUsuario => {
  const TimeStamp = moment().format('YYYY-MM-DD HH:mm:ss');

  console.log('error', idUsuario, TimeStamp);
  SendFakeGps(idUsuario, TimeStamp);
  ToastAndroid.show(
    'Está usando fake gps y no se pueden enviar los datos',
    ToastAndroid.LONG,
  );
};
