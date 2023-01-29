import React from 'react';
import RNFS from 'react-native-fs';

export const ValidoExistsArchivo = async (tempUri, setFileValid) => {
  //quito el file:// del path
  const stringUrl = tempUri.replace('file:', '');
  console.log('stringUrl', stringUrl);
  //valido si existe el archivo en el path
  console.log('entro a validar');
  const exists = await RNFS.exists(stringUrl);
  console.log('valido con resultado', exists);
  setFileValid(exists);
  console.log('exists', exists);
  console.log('tempUri', stringUrl);
  return exists;
};
