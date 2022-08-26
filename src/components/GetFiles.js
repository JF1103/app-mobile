import React, {useState, useContext, useEffect} from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  Switch,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
} from 'react-native';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import {PERMISSIONS} from 'react-native-permissions';

export const GetFiles = ({pregunta}) => {
  const [stateRecord, setStateRecord] = useState({
    isLoggingIn: false,
    recordSecs: 0,
    recordTime: '00:00:00',
    currentPositionSec: 0,
    currentDurationSec: 0,
    playTime: '00:00:00',
    duration: '00:00:00',
  });
  PERMISSIONS.ANDROID.RECORD_AUDIO;
  PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
  PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
  const getPermision = async () => {
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
          console.log('Permissions granted');
        } else {
          console.log('All required permissions not granted');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
  };

  useEffect(() => {
    getPermision();
  }, []);
  const audioRecorderPlayer = new AudioRecorderPlayer();
  audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1

  const onStartRecord = async () => {
    console.log('onStartRecord');

    //if (result === 'granted') {
    const path = 'recorded.mp4';
    const audioSet = {
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVSampleRateKeyIOS: 44100.0,
      AVEncoderAudioQualityKey: AudioEncoderAndroidType.aac,
      AVEncoderBitRateKeyAndroid: 32000,
      AVNumberOfChannelsKey: 2,
      AVSampleRateKey: 44100.0,
      AVFormatIDKey: AudioSourceAndroidType.default,
    };
    const uri = await audioRecorderPlayer.startRecorder(path, audioSet);
    audioRecorderPlayer.addRecordBackListener(e => {
      setStateRecord({
        recordSecs: e.current_position,
        recordTime: audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
      });
      return;
    });
    console.log(`uri: ${uri}`);
  };
  //};

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setStateRecord({
      recordSecs: 0,
    });
    console.log(result);
  };

  const onStartPlay = async () => {
    console.log('onStartPlay');
    const msg = await audioRecorderPlayer.startPlayer();
    console.log(msg);
    audioRecorderPlayer.addPlayBackListener(e => {
      if (e.current_position === e.duration) {
        console.log('finished');
        audioRecorderPlayer.stopPlayer();
      }
      setStateRecord({
        currentPositionSec: e.current_position,
        currentDurationSec: e.duration,
        playTime: audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
        duration: audioRecorderPlayer.mmssss(Math.floor(e.duration)),
      });
    });
  };

  const onPausePlay = async () => {
    await audioRecorderPlayer.pausePlayer();
  };

  const onResumePlay = async () => {
    await audioRecorderPlayer.resumePlayer();
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
          setTempUri(resp.assets[0].uri);
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
    AudioRecord.init(options);
    AudioRecord.start();
    setTimeout(() => {
      AudioRecord.stop();
    }, 5000);
  };

  return (
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
  );

  /* return (
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
 */
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
