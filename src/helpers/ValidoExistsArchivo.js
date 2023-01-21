import React from 'react';
import RNFS from 'react-native-fs';

export const ValidoExistsArchivo = async tempUri => {
  //valido si existe el archivo en el path
  const exists = await RNFS.exists(tempUri);
  console.log('exists', exists);
  console.log('tempUri', tempUri);
  return exists;
};
