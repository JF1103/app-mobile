import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {BASE_URL} from '../config';

export const SendArraaycheckInOut = async () => {
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('checkinout');
      /* console.log('jsonvalue', jsonValue); */
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log(e);
    }
  };
  const checkinout = await getData();

  checkinout.checks.reverse();
  let arrayresponse = [];
  checkinout.checks.some(async check => {
    const formdata = new FormData();
    formdata.append('refusuarios', check.idusuario);
    formdata.append('checkin', check.type);
    formdata.append('latitud', check.latitude);
    formdata.append('longitud', check.longitude);
    formdata.append('fecha', check.today);

    const respone = await fetch(BASE_URL + '/ubicacionusuarios/insert.php?', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formdata,
    });

    respone.json().then(async response => {
      console.log('response', response);
      if (response?.error === 'false') {
        check.send = true;
        arrayresponse.unshift(check);
        return true;
      } else {
        arrayresponse.unshift(check);
        return false;
      }
    });
  });

  let arrayasync = arrayresponse.reverse();
  /* .filter(check => check.send === false); */
  await AsyncStorage.setItem('checkinout', JSON.stringify(arrayasync));
};
