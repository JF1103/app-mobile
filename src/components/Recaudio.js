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
  Dimensions,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {Component} from 'react';
import RNFS from 'react-native-fs';

import Button from './Button';
/* import RNFetchBlob from 'rn-fetch-blob'; */
import {Wave} from 'react-native-animated-spinkit';
import {FakeGpsError} from '../helpers/FakeGpsError';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#455A64',
    flexDirection: 'column',
    alignItems: 'center',
  },
  titleTxt: {
    marginTop: 100,
    color: 'white',
    fontSize: 28,
  },
  viewRecorder: {
    marginTop: 40,
    width: '100%',
    alignItems: 'center',
  },
  recordBtnWrapper: {
    flexDirection: 'row',
  },
  viewPlayer: {
    marginTop: 10,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  viewBarWrapper: {
    marginTop: 28,
    marginHorizontal: 28,
    alignSelf: 'stretch',
  },
  viewBar: {
    backgroundColor: '#ccc',
    height: 4,
    alignSelf: 'stretch',
  },
  viewBarPlay: {
    backgroundColor: '#fb8c00',
    height: 4,
    width: 0,
  },
  playStatusTxt: {
    marginTop: 8,
    color: '#ccc',
  },
  playBtnWrapper: {
    flexDirection: 'row',
    marginTop: 40,
  },
  btn: {
    borderColor: '#fb8c00',
    borderWidth: 1,
  },
  txt: {
    color: '#fb8c00',
    fontSize: 14,
    marginHorizontal: 8,
    marginVertical: 4,
  },
  txtRecordCounter: {
    marginTop: 32,
    color: '#fb8c00',
    fontSize: 20,
    textAlignVertical: 'center',
    fontWeight: '200',
    fontFamily: 'Helvetica Neue',
    letterSpacing: 3,
  },
  txtCounter: {
    marginTop: 12,
    color: '#fb8c00',
    fontSize: 20,
    textAlignVertical: 'center',
    fontWeight: '200',
    fontFamily: 'Helvetica Neue',
    letterSpacing: 3,
  },
});

const screenWidth = Dimensions.get('screen').width - 40;

class Page extends Component {
  dirs = RNFS.DocumentDirectoryPath;
  path = Platform.select({
    android: `${this.dirs}/audio_${this.props.ot}_${this.props.tareaId}_${this.props.formularioId}_${this.props.pregunta.id}.mp4`,
  });

  audioRecorderPlayer;

  constructor(props) {
    super(props);
    this.state = {
      isLoggingIn: false,
      recordSecs: 0,
      recordTime:
        props.tempUri !== '' && props.typeFile === 'audio/mp4'
          ? '00:00:10'
          : '00:00:00',
      currentPositionSec: 0,
      currentDurationSec: 0,
      playTime: '00:00:00',
      duration: '00:00:00',
      grabando: false,
    };

    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.audioRecorderPlayer.setSubscriptionDuration(0.1); // optional. Default is 0.5
  }

  render() {
    let playWidth =
      (this.state.currentPositionSec / this.state.currentDurationSec) *
      (screenWidth - 56);

    if (!playWidth) {
      playWidth = 0;
    }
    /* console.log('render' + playWidth); */
    return (
      <SafeAreaView>
        <View style={styles.viewRecorder}>
          <View style={styles.recordBtnWrapper}>
            {!this.state.grabando && (
              <Button
                style={styles.btn}
                onPress={this.onStartRecord}
                textStyle={styles.txt}>
                Record
              </Button>
            )}
            {this.state.grabando && (
              <Button
                style={[styles.btn, {marginLeft: 12}]}
                onPress={this.onStopRecord}
                textStyle={styles.txt}>
                Stop
              </Button>
            )}
            {this.state.recordTime !== '00:00:00' && !this.state.grabando && (
              <Button
                style={styles.btn}
                onPress={this.onStartPlay}
                textStyle={styles.txt}>
                Play
              </Button>
            )}
          </View>
        </View>
        <View style={styles.viewPlayer}>
          {!this.state.grabando ? (
            <>
              <TouchableOpacity
                style={styles.viewBarWrapper}
                onPress={this.onStatusPress}>
                <View style={styles.viewBar}>
                  <View style={[styles.viewBarPlay, {width: playWidth}]} />
                </View>
              </TouchableOpacity>
              <Text style={styles.txtCounter}>
                {this.state.playTime} / {this.state.duration}
              </Text>
              <View style={styles.playBtnWrapper}></View>
            </>
          ) : (
            <Wave size={60} color="#fb8c00" />
          )}
        </View>
      </SafeAreaView>
    );
  }

  onStatusPress = e => {
    const touchX = e.nativeEvent.locationX;
    console.log(`touchX: ${touchX}`);
    const playWidth =
      (this.state.currentPositionSec / this.state.currentDurationSec) *
      (screenWidth - 56);
    /*     console.log(`currentPlayWidth: ${playWidth}`); */

    const currentPosition = Math.round(this.state.currentPositionSec);

    if (playWidth && playWidth < touchX) {
      const addSecs = Math.round(currentPosition + 1000);
      this.audioRecorderPlayer.seekToPlayer(addSecs);
      /* console.log(`addSecs: ${addSecs}`); */
    } else {
      const subSecs = Math.round(currentPosition - 1000);
      this.audioRecorderPlayer.seekToPlayer(subSecs);
      /* console.log(`subSecs: ${subSecs}`); */
    }
  };

  onStartRecord = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        /*   console.log('write external stroage', grants); */

        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          /*  console.log('permissions granted'); */
        } else {
          /*  console.log('All required permissions not granted'); */
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

    /*     console.log('audioSet', audioSet); */

    const uri = await this.audioRecorderPlayer.startRecorder(
      this.path,
      audioSet,
    );

    /*    //? Default path
    const uri = await this.audioRecorderPlayer.startRecorder(
      undefined,
      audioSet,
    ); */

    this.audioRecorderPlayer.addRecordBackListener(e => {
      // console.log('record-back', e);
      this.setState({
        recordSecs: e.currentPosition,
        recordTime: this.audioRecorderPlayer.mmssss(
          Math.floor(e.currentPosition),
        ),
        grabando: true,
      });
    });
    /*   console.log(`uri: ${uri}`); */
  };

  onPauseRecord = async () => {
    try {
      const r = await this.audioRecorderPlayer.pauseRecorder();
      console.log(r);
    } catch (err) {
      /*  console.log('pauseRecord', err); */
    }
  };

  onResumeRecord = async () => {
    await this.audioRecorderPlayer.resumeRecorder();
  };

  onStopRecord = async () => {
    const result = await this.audioRecorderPlayer.stopRecorder();
    this.audioRecorderPlayer.removeRecordBackListener();
    this.setState({
      recordSecs: 0,
      grabando: false,
    });

    const base64 = await RNFS.readFile(result, 'base64');
    /*  console.log('base64', result); */
    if (!this.props.mocked) {
      this.props.handleRespAudio(
        this.props.tareaId,
        this.props.formularioId,
        this.props.pregunta.id,
        result.substring(result.lastIndexOf(':') + 1),
        this.props.pregunta.tiporespuesta,
      );
    } else {
      FakeGpsError(this.idUsuario);
    }
  };

  onStartPlay = async () => {
    /*   console.log('onStartPlay'); */
    //? Custom path
    const msg = await this.audioRecorderPlayer.startPlayer(this.path);

    //? Default path
    /*  const msg = await this.audioRecorderPlayer.startPlayer(); */
    const volume = await this.audioRecorderPlayer.setVolume(1.0);
    /*     console.log(`file: ${msg}`, `volume: ${volume}`); */

    this.audioRecorderPlayer.addPlayBackListener(e => {
      this.setState({
        currentPositionSec: e.currentPosition,
        currentDurationSec: e.duration,
        playTime: this.audioRecorderPlayer.mmssss(
          Math.floor(e.currentPosition),
        ),
        duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
      });
    });
  };

  onPausePlay = async () => {
    await this.audioRecorderPlayer.pausePlayer();
  };

  onResumePlay = async () => {
    await this.audioRecorderPlayer.resumePlayer();
  };

  onStopPlay = async () => {
    /* console.log('onStopPlay'); */
    this.audioRecorderPlayer.stopPlayer();
    this.audioRecorderPlayer.removePlayBackListener();
  };
}

export default Page;
