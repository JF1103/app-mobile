import React from 'react';
import RNFS from 'react-native-fs';

export default async function getFileBase64(filePath) {
  const data = await RNFS.readFile(filePath, 'base64');

  return data;
}
