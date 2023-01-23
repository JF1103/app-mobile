import React from 'react';
import RNFS from 'react-native-fs';

export const ValidoExistsArchivo = async (tempUri, setFileValid) => {
  //valido si existe el archivo en el path
  const exists = await RNFS.exists(tempUri);
  setFileValid(exists);
  console.log('exists', exists);
  console.log('tempUri', tempUri);
  return exists;
};
