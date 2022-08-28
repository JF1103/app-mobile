import React, {useState, useContext, useEffect} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
  PlayBackType,
  RecordBackType,
} from 'react-native-audio-recorder-player';
import {
  check,
  PERMISSIONS,
  PermissionStatus,
  request,
  openSettings,
} from 'react-native-permissions';
import RNFetchBlob from 'rn-fetch-blob';

export const GetFiles = ({pregunta}) => {
  const checkLocationPermissions = async () => {
    let permissionStatus, permissionStatus2;
    if (Platform.OS === 'android') {
      let permissionsStatus = await request(
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      );
      let permissionsStatus2 = await request(
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      );
      let permissionsStatus3 = await request(PERMISSIONS.ANDROID.CAMERA);
      let permissionsStatus4 = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
      let permissionsStatus5 = await request(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
      console.log('permiso externo1 ' + permissionsStatus);
      console.log('permiso externo 2' + permissionsStatus2);
      console.log('permiso externo 3' + permissionsStatus3);
      console.log('permiso externo 4' + permissionsStatus4);
      permissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      permissionStatus2 = await check(
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      );
    }

    console.log('permiso externo 5' + permissionStatus);
    console.log('permiso externo 6' + permissionStatus2);
  };

  useEffect(() => {
    checkLocationPermissions();
  }, []);

  /*   const dirs = RNFetchBlob.fs.dirs;
  const path = Platform.select({
    ios: 'hello.m4a',
    android: `${this.dirs.CacheDir}/hello.mp3`,
  }); */

  const [recState, setRecState] = useState({
    isLoggingIn: false,
    recordSecs: 0,
    recordTime: '00:00:00',
    currentPositionSec: 0,
    currentDurationSec: 0,
    playTime: '00:00:00',
    duration: '00:00:00',
  });

  let audioRecorderPlayer = new AudioRecorderPlayer();

  audioRecorderPlayer.setSubscriptionDuration(0.1);

  const onStartRecord = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        console.log('write external stroage', grants);

        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('permissions granted');
        } else {
          console.log('All required permissions not granted');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }

    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };

    console.log('audioSet', audioSet);
    //? Custom path
    // const uri = await this.audioRecorderPlayer.startRecorder(
    //   this.path,
    //   audioSet,
    // );

    //? Default path
    const uri = await audioRecorderPlayer.startRecorder(undefined, audioSet);

    audioRecorderPlayer.addRecordBackListener(e => {
      // console.log('record-back', e);
      setRecState({
        recordSecs: e.currentPosition,
        recordTime: audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
      });
    });
    console.log(`uri: ${uri}`);
  };
  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecState({
      recordSecs: 0,
    });
    console.log(result);
  };

  const onPauseRecord = async () => {
    try {
      const r = await audioRecorderPlayer.pauseRecorder();
      console.log(r);
    } catch (err) {
      console.log('pauseRecord', err);
    }
  };

  const onResumeRecord = async () => {
    await audioRecorderPlayer.resumeRecorder();
  };

  const [tempUri, setTempUri] = useState('');

  const takePhoto = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.5,
        saveToPhotos: true,
      },
      resp => {
        if (resp.didCancel) return;
        if (resp.assets[0].uri) {
          console.log('entre');
          resp.assets[0] && setTempUri(resp.assets[0].uri);
        } else return;
      },
    );
  };

  const takeVideo = () => {
    launchCamera(
      {
        mediaType: 'video',
        quality: 0.5,
      },
      resp => {
        if (resp.didCancel) return;
        if (resp.assets[0].uri) {
          console.log('entre');
          setTempUri(resp.assets[0].uri);
        } else return;
      },
    );
  };

  const takePhotoFromGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'mixed',
        saveToPhotos: true,
        quality: 0.5,
      },
      resp => {
        if (resp.didCancel) return;
        if (!resp.uri) return;
        setTempUri(resp.uri);
      },
    );
  };

  const takeAudio = () => {
    onStartRecord();

    setTimeout(() => {
      onStopRecord();
    }, 5000);
  };

  /*  return (
    <>
      <Text>{stateRecord.recordTime}</Text>
      <Button
        mode="contained"
        icon="record"
        onPress={() => onStartRecord()}
        title="grabar"
      />

      <Button
        icon="stop"
        mode="outlined"
        onPress={() => onStopRecord()}
        title="STOP"
      />

      <Text>
        {stateRecord.playTime} / {stateRecord.duration}
      </Text>
      <Button
        mode="contained"
        icon="play"
        onPress={() => onStartPlay()}
        title="Play"
      />

      <Button
        icon="pause"
        mode="contained"
        onPress={() => onPausePlay()}
        title="pause"
      />

      <Button
        icon="stop"
        mode="outlined"
        onPress={() => onStopPlay()}
        title="STOP"
      />
    </>
  ); */

  return (
    <View key={pregunta.id}>
      <Text style={styles.archivo}>{pregunta.pregunta}</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: 10,
        }}>
        <Button title="Foto" onPress={takePhoto} />
        <Button title="Video" onPress={takeVideo} />
        <Button title="Audio" onPress={takeAudio} />

        <Button title="Galería" onPress={takePhotoFromGallery} />
      </View>

      {tempUri && (
        <Image
          source={{uri: tempUri}}
          style={{
            marginTop: 20,
            width: '100%',
            height: 300,
          }}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  row: {
    backgroundColor: '#fb8c00',
    marginHorizontal: '6%',
    marginVertical: '5%',
    padding: '5%',
    borderRadius: 20,
    boxShadow: 5,
    borderColor: '#000000',
    borderWidth: 0.5,
  },
  welcome: {
    fontSize: 18,
    color: '#000000',
    padding: 5,
    fontWeight: 'bold',
  },
  icon: {
    fontSize: 40,
    marginRight: 300,
    color: '#ff0000',
    marginTop: 20,
  },
  title: {
    fontSize: 40,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000000',
    marginTop: -50,
  },
  container2: {
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    color: '#000000',
    padding: 5,
    marginVertical: '5%',
    fontWeight: 'bold',
  },
  selsim: {
    fontSize: 18,
    color: '#000000',
    padding: 5,
    marginVertical: '5%',
    fontWeight: 'bold',
  },
  selmul: {
    fontSize: 18,
    color: '#000000',
    padding: 5,
    marginVertical: '5%',
    fontWeight: 'bold',
  },
  geo: {
    fontSize: 18,
    color: '#000000',
    padding: 5,
    marginVertical: '5%',
    fontWeight: 'bold',
  },
  textarea: {
    borderRadius: 20,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sm: {
    borderRadius: 30,

    alignItems: 'center',
    justifyContent: 'center',
  },
  geolocalizacion: {
    flex: 1,
    borderRadius: 30,
  },
});
const stylesRec = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
