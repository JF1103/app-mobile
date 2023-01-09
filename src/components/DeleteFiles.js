import RNFS from 'react-native-fs';

export const deleteFiles = async filepath => {
  let exists = await RNFS.exists(filepath);
  if (exists) {
    // exists call delete
    await RNFS.unlink(filepath);
  } else {
  }
};
