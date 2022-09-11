import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GetStorage = async () => {
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('form');
      // console.log(jsonValue);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log(e);
    }
  };
  const form = await getData();
  return form;
};
