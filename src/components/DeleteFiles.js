import RNFS from 'react-native-fs';

export const deleteFiles = async filepath => {
  console.log('deleteFiles', filepath);
  let exists = await RNFS.exists(filepath);
  if (exists) {
    // exists call delete
    await RNFS.unlink(filepath);
    console.log('File Deleted');
  } else {
    console.log('File Not Available');
  }
};
