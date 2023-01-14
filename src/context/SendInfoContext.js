import {useNetInfo} from '@react-native-community/netinfo';
import React, {createContext, useReducer, useState, useEffect} from 'react';
import {SendArraaycheckInOut} from '../components/SendArraayCheckInOut';

export const SendingInfoContext = createContext({});

export const AuthProvider = ({children}) => {
  const {isConnected} = useNetInfo();

  const sendCheckinOut = async () => {
    await SendArraaycheckInOut();
    //setReloadCardList(true);
  };

  useEffect(() => {
    if (isConnected === true) {
      console.log('enviando storage');

      sendCheckinOut();
    }
  }, [isConnected]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
