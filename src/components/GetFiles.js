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
  TouchableOpacity,
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
import RNFS from 'react-native-fs';

import {Grayscale} from 'react-native-color-matrix-image-filters';

import {ItemSeparator} from './ItemSeparator';
import Recaudio from './Recaudio';
import {SetStorage} from './SetStorage';
import {handleResp} from '../helpers/handleRespt';
import {useLocation} from '../hooks/useLocation';

export const GetFiles = ({
  tareaId,
  idotd,
  formularioId,
  refformularioconector,
  pregunta,
  formularioPreguntas,
  setFormularioPreguntas,
  employee,
  idUsuario,
  formAsync,
  disabled,
  arrayReq,
  setArrayReq,
}) => {
  const [visualizaAudio, setvisualizaAudio] = useState(false);
  const {getCurrentLocation} = useLocation();
  const [fileReq, setfileReq] = useState(false);

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
      permissionStatus2 = await request(
        PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
      );
      permissionStatus = await request(PERMISSIONS.ACCESS_COARSE_LOCATION);

      permissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      permissionStatus2 = await check(
        PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
      );
      permissionStatus = await check(PERMISSIONS.ACCESS_COARSE_LOCATION);
      permissionStatus2 = await check(
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      );
    }
  };

  const datos = formAsync?.formcomplet
    .filter(item => item.idUsuario === idUsuario)[0]
    ?.ots.filter(item => item.id_ot === employee.id)[0]
    ?.tareas.filter(item => item.TareaId === tareaId)[0]
    ?.formularios.filter(item => item.FormularioId === formularioId)[0]
    ?.preguntas.filter(item => item.id === pregunta.id)[0]?.respuesta;

  const syncUri = datos?.base64;
  const typeFile = datos?.fileType;

  useEffect(() => {
    checkLocationPermissions();
  }, []);

  const [tempUri, setTempUri] = useState(syncUri ? 'file:' + syncUri : '');
  const [visualizaImagen, setvisualizaImagen] = useState(false);

  useEffect(() => {
    if (tempUri && typeFile) {
      if (tempUri.includes('.mp4')) {
        setvisualizaImagen(false);
        setvisualizaAudio(true);
      } else {
        setvisualizaImagen(true);
        setvisualizaAudio(false);
      }
    }
  }, [tempUri]);

  useEffect(() => {
    setvisualizaImagen(!visualizaAudio);
  }, [visualizaAudio]);

  useEffect(() => {
    if (
      arrayReq.length > 0 &&
      arrayReq.filter(item => item.id === pregunta.id).length > 0
    ) {
      setfileReq(true);
    } else {
      setfileReq(false);
    }
  }, [arrayReq]);

  const takePhoto = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.5,
        saveToPhotos: true,
        includeBase64: true,
      },
      resp => {
        if (resp.didCancel) return;
        if (resp.assets[0].uri) {
          /* console.log(resp.assets[0].base64); */

          resp.assets[0] && setTempUri(resp.assets[0].uri),
            resp.assets[0] &&
              handleRespFoto(
                tareaId,
                formularioId,
                pregunta.id,
                resp.assets[0].fileName,
                resp.assets[0].type,
                resp.assets[0].uri,
                resp.assets[0].base64,
                pregunta.tiporespuesta,
              );
          setvisualizaImagen(true);
          setArrayReq(arrayReq.filter(item => item.id !== pregunta.id));
        } else return;
      },
    );
  };

  const takeVideo = () => {
    launchCamera(
      {
        mediaType: 'video',
        durationLimit: 6,
        videoQuality: 'low',
        saveToPhotos: true,
      },
      resp => {
        if (resp.didCancel) return;
        if (resp.assets[0].uri) {
          setTempUri(resp.assets[0].uri);
          handleRespFoto(
            tareaId,
            formularioId,
            pregunta.id,
            resp.assets[0].fileName,
            resp.assets[0].type,
            resp.assets[0].uri,
            resp.assets[0].base64,
            pregunta.tiporespuesta,
          );
          setvisualizaImagen(true);
          setArrayReq(arrayReq.filter(item => item.id !== pregunta.id));
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
        includeBase64: true,
      },
      resp => {
        if (resp.didCancel) return;

        if (!resp.assets[0].uri) return;
        setTempUri(resp.assets[0].uri);
        handleRespFoto(
          tareaId,
          formularioId,
          pregunta.id,
          resp.assets[0].fileName,
          resp.assets[0].type,
          resp.assets[0].uri,
          resp.assets[0].base64,
          pregunta.tiporespuesta,
        );
        setvisualizaImagen(true);
        setArrayReq(arrayReq.filter(item => item.id !== pregunta.id));
      },
    );
  };

  const handleRespFoto = async (
    tareaId,
    formularioId,
    id,
    fileName,
    fileType,
    tempUri,
    respuesta,
    tipo,
  ) => {
    const base64 = await RNFS.readFile(tempUri, 'base64');

    let path = RNFS.DocumentDirectoryPath + `/${fileName}`;

    RNFS.writeFile(path, base64, 'base64')
      .then(success => {
        console.log('FILE WRITTEN!');
      })
      .catch(err => {
        console.log(err.message);
      });
    setfileReq(false);
    getCurrentLocation().then(cords => {
      handleResp(
        tareaId,
        idotd,
        formularioId,
        refformularioconector,
        id,
        {base64: path, tempUri: tempUri, fileType: fileType},
        tipo,
        formularioPreguntas,
        setFormularioPreguntas,
        employee,
        idUsuario,
        cords,
      );
    });
  };

  const handleRespAudio = async (tareaId, formularioId, id, tempUri, tipo) => {
    getCurrentLocation().then(cords => {
      handleResp(
        tareaId,
        idotd,
        formularioId,
        refformularioconector,
        id,
        {base64: tempUri, fileType: 'audio/mp4'},
        tipo,
        formularioPreguntas,
        setFormularioPreguntas,
        employee,
        idUsuario,
        cords,
      );
      setArrayReq(arrayReq.filter(item => item.id !== pregunta.id));
    });
  };

  return (
    <View key={pregunta.id}>
      <Text style={styles.archivo}>{pregunta.pregunta}</Text>
      <View
        style={
          fileReq
            ? {
                flexDirection: 'row',
                marginTop: 10,
                borderColor: 'red',
                borderWidth: 2,
                borderRadius: 10,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }
            : {
                flexDirection: 'row',
                marginTop: 10,
              }
        }>
        <TouchableOpacity
          style={disabled ? styles.btnDisable : styles.btn}
          onPress={takePhoto}>
          <Text style={styles.text5}>Foto</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={disabled ? styles.btnDisable : styles.btn}
          onPress={takeVideo}>
          <Text style={styles.text5}>Video</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={disabled ? styles.btnDisable : styles.btn}
          onPress={takePhotoFromGallery}>
          <Text style={styles.text5}>Galería</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={disabled ? styles.btnDisable : styles.btn}
          onPress={() => {
            visualizaAudio ? setvisualizaAudio(false) : setvisualizaAudio(true);
          }}>
          <Text style={styles.text5}>Audio</Text>
        </TouchableOpacity>
      </View>
      {visualizaAudio && (
        <Recaudio
          handleRespAudio={handleRespAudio}
          ot={idotd}
          tareaId={tareaId}
          formularioId={formularioId}
          pregunta={pregunta}
          formAsync={formAsync}
          tempUri={tempUri}
          typeFile={typeFile}
        />
      )}
      {visualizaImagen &&
        tempUri !== '' &&
        (disabled ? (
          <Grayscale>
            <Image
              source={{uri: tempUri}}
              style={{
                marginTop: 20,
                width: '100%',
                height: 300,
              }}
            />
          </Grayscale>
        ) : (
          <Image
            source={{uri: tempUri}}
            style={{
              marginTop: 20,
              width: '100%',
              height: 300,
            }}
          />
        ))}
    </View>
  );
};
const styles = StyleSheet.create({
  archivo: {
    fontSize: 14,
    color: '#fb8c00',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 20,
    textDecorationLine: 'underline',
  },
  btn: {
    flex: 1,
    backgroundColor: '#fb8c00',
    borderRadius: 20,
    boxShadow: 5,
    borderColor: '#c88719',
    borderWidth: 1.0,
    height: 30,
    justifyContent: 'center',
    marginRight: 5,
    marginLeft: 5,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  btnDisable: {
    flex: 1,
    backgroundColor: '#E8D3BB',
    borderRadius: 20,
    boxShadow: 5,
    borderColor: '#c88719',
    borderWidth: 1.0,
    height: 30,
    justifyContent: 'center',
    marginRight: 5,
    marginLeft: 5,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text5: {
    fontSize: 16,
    color: '#f5f5f5',
    textAlign: 'center',
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
