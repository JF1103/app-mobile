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
  if (checkinout) {
    console.log('checkinout adentro', checkinout);
    checkinout.checks.reverse();
    let arrayresponse = [];
    const arrayFinal = async () => {
      checkinout.checks.map(async check => {
        const formdata = new FormData();
        formdata.append('refusuarios', check.idusuario);
        formdata.append('checkin', check.type);
        formdata.append('latitud', check.latitude);
        formdata.append('longitud', check.longitude);
        formdata.append('fecha', check.today);
        try {
          const respone = await fetch(
            BASE_URL + '/ubicacionusuarios/insert.php?',
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
              },
              body: formdata,
            },
          );

          let messageRespon = await respone
            .json()
            .then(async messageRespon => {
              console.log('response', messageRespon);
              if (messageRespon?.error === false) {
                await AsyncStorage.removeItem('checkinout');
              } else {
                arrayresponse.unshift(check);
                await AsyncStorage.setItem(
                  'checkinout',
                  JSON.stringify({
                    checks: arrayresponse,
                  }),
                );
                //return check;
              }
            })
            .catch(error => {
              console.log('error', error);
            });
        } catch (error) {
          arrayresponse.unshift(check);
          await AsyncStorage.setItem(
            'checkinout',
            JSON.stringify({
              checks: arrayresponse,
            }),
          );
          console.log('error', error);
        }
      });
    };

    await arrayFinal();
  }
};
