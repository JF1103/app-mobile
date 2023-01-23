import React, {useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FormContext} from '../context/FormContext';

export const GetStorage = async () => {
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('form');

      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log(e);
    }
  };
  const form = await getData();
  return form;
};

export const getCheckInOut = async () => {
  /*  const {data} = useContext(FormContext); */
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('checkinout');

      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log(e);
    }
  };
  const checkinout = await getData();

  return checkinout;
};
