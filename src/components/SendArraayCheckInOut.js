import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

export const SendArraaycheckInOut = async () => {
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('checkinout');
      console.log('jsonvalue', jsonValue);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log(e);
    }
  };
  const checkinout = await getData();
  checkinout.checks.foreach(async check => {
    formdata = new FormData();
    formdata.append('refusuarios', check.idusuario);
    formdata.append('checkin', check.check);
    formdata.append('latitud', check.latitude);
    formdata.append('longitud', check.longitude);
    formdata.append('fecha', check.fecha);
    fetch(BASE_URL + '/ubicacionusuarios/insert.php?', {
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
  });
};
