import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SetStorage = async formularioPreguntas => {
  /* console.log('SetStorage'); */

  console.log('guardo en el  storage', JSON.stringify(formularioPreguntas));
  try {
    await AsyncStorage.setItem(
      'form',
      JSON.stringify(formularioPreguntas).toString(),
    );
  } catch (e) {
    console.log(e);
  }
};

export const setCheckInOut = async checkinout => {
  //console.log('SetStorage');

  try {
    await AsyncStorage.setItem(
      'checkinout',
      JSON.stringify(checkinout).toString(),
    );
  } catch (e) {
    console.log(e);
  }
};
