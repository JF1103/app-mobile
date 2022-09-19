import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SetStorage = async formularioPreguntas => {
  //console.log('SetStorage');

  try {
    await AsyncStorage.setItem(
      'form',
      JSON.stringify(formularioPreguntas).toString(),
    );
  } catch (e) {
    console.log(e);
  }
};
