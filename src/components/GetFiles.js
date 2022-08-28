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
} from 'react-native';
import {Buffer} from 'buffer';
import Permissions from 'react-native-permissions';

export const GetFiles = ({pregunta}) => {
  const options = {
    sampleRate: 16000, // default 44100
    channels: 1, // 1 or 2, default 1
    bitsPerSample: 16, // 8 or 16, default 16
    audioSource: 6, // android only (see below)
    wavFile: 'test.wav', // default 'audio.wav'
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
    <View key={pregunta.id}>
      <Text style={styles.archivo}>{pregunta.pregunta}</Text>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 5,
        }}>

      <TouchableOpacity style={styles.btn} onPress={takePhoto}>
        <Text style={styles.text5}>Foto</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={takeVideo}>
        <Text style={styles.text5}>Video</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={takeAudio}>
        <Text style={styles.text5}>Audio</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={takePhotoFromGallery}>
        <Text style={styles.text5}>Galería</Text>
      </TouchableOpacity>
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
    textAlign: 'center',
  },
  textarea: {
    borderRadius: 20,
    height: 70,
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
  archivo: {
    fontSize: 18,
    color: '#000000',
    padding: 5,
    marginVertical: '5%',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  btn: {
    flex: 1,
    backgroundColor: '#ffb74d',
    borderRadius: 20,
    boxShadow: 5,
    borderColor: '#fb8c00',
    borderWidth: 1.0,
    height: 30,
    width: '20%',
    justifyContent: 'center',
    marginRight: 3,
  },
  text5: {
    fontSize: 16,
    color: '#eeeeee',
    textAlign: 'center',
    fontWeight: 'bold',
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
