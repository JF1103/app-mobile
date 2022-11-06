import React from 'react';
import RNFS from 'react-native-fs';

export default async function getFileBase64(filePath) {
  /* console.log('filePath', filePath); */
  const data = await RNFS.readFile(filePath, 'base64');
  /*  console.log('data', data); */

  return data;
}
