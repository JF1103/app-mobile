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

import {ItemSeparator} from './ItemSeparator';
import Recaudio from './Recaudio';
import {SetStorage} from './SetStorage';

export const GetFiles = ({
  tareaId,
  pregunta,
  formularioPreguntas,
  setFormularioPreguntas,
}) => {
  const [visualizaAudio, setvisualizaAudio] = useState(false);

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

      permissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      permissionStatus2 = await check(
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      );
    }
  };

  useEffect(() => {
    checkLocationPermissions();
  }, []);

  const [tempUri, setTempUri] = useState('');

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
                pregunta.id,
                resp.assets[0].fileName,
                resp.assets[0].type,
                resp.assets[0].uri,
                resp.assets[0].base64,
                pregunta.tiporespuesta,
              );
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
          handleRespVideo(
            tareaId,
            pregunta.id,
            resp.assets[0].fileName,
            resp.assets[0].type,
            resp.assets[0].uri,
            resp.assets[0].base64,
            pregunta.tiporespuesta,
          );
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
          pregunta.id,
          resp.assets[0].fileName,
          resp.assets[0].type,
          resp.assets[0].uri,
          resp.assets[0].base64,
          pregunta.tiporespuesta,
        );
      },
    );
  };

  const handleRespFoto = async (
    tareaId,
    id,
    fileName,
    fileType,
    tempUri,
    respuesta,
    tipo,
  ) => {
    const base64 = await RNFS.readFile(tempUri, 'base64');

    let path = RNFS.DocumentDirectoryPath + `/${fileName}`;

    RNFS.writeFile(path, base64, 'utf8')
      .then(success => {
        console.log('FILE WRITTEN!');
      })
      .catch(err => {
        console.log(err.message);
      });

    const indexTarea = formularioPreguntas.tareas.findIndex(
      tarea => tarea.TareaId === tareaId,
    );

    if (indexTarea === -1) {
      setFormularioPreguntas({
        ...formularioPreguntas,
        tareas: [
          ...formularioPreguntas.tareas,
          {
            TareaId: tareaId,
            preguntas: [
              {id: id, respuesta: {base64: path, tempUri: tempUri}, tipo: tipo},
            ],
          },
        ],
      });
    } else {
      const indexPregunta = formularioPreguntas.tareas[
        indexTarea
      ].preguntas.findIndex(pregunta => pregunta.id === id);

      if (indexPregunta === -1) {
        setFormularioPreguntas({
          ...formularioPreguntas,
          tareas: [
            {
              ...formularioPreguntas.tareas[indexTarea],
              preguntas: [
                ...formularioPreguntas.tareas[indexTarea].preguntas,
                {id: id, respuesta: {base64: path, tempUri: tempUri}},
              ],
            },
          ],
        });
      } else {
        setFormularioPreguntas({
          ...formularioPreguntas,
          tareas: [
            {
              ...formularioPreguntas.tareas[indexTarea],
              preguntas: [
                ...formularioPreguntas.tareas[indexTarea].preguntas.slice(
                  0,
                  indexPregunta,
                ),
                {
                  ...formularioPreguntas.tareas[indexTarea].preguntas[
                    indexPregunta
                  ],
                  respuesta: {base64: path, tempUri: tempUri},
                },
                ...formularioPreguntas.tareas[indexTarea].preguntas.slice(
                  indexPregunta + 1,
                ),
              ],
            },
          ],
        });
      }
    }
    SetStorage(formularioPreguntas);
  };

  const handleRespVideo = async (
    tareaId,
    id,
    fileName,
    fileType,
    tempUri,
    respuesta,
    tipo,
  ) => {
    const base64 = await RNFS.readFile(tempUri, 'base64');

    let path = RNFS.DocumentDirectoryPath + `/${fileName}`;
    RNFS.writeFile(path, base64, 'utf8')
      .then(success => {
        console.log('FILE WRITTEN!');
      })
      .catch(err => {
        console.log(err.message);
      });

    console.log(path);
    const indexTarea = formularioPreguntas.tareas.findIndex(
      tarea => tarea.TareaId === tareaId,
    );

    if (indexTarea === -1) {
      setFormularioPreguntas({
        ...formularioPreguntas,
        tareas: [
          ...formularioPreguntas.tareas,
          {
            TareaId: tareaId,
            preguntas: [
              {id: id, respuesta: {base64: path, tempUri: tempUri}, tipo: tipo},
            ],
          },
        ],
      });
    } else {
      const indexPregunta = formularioPreguntas.tareas[
        indexTarea
      ].preguntas.findIndex(pregunta => pregunta.id === id);

      if (indexPregunta === -1) {
        setFormularioPreguntas({
          ...formularioPreguntas,
          tareas: [
            {
              ...formularioPreguntas.tareas[indexTarea],
              preguntas: [
                ...formularioPreguntas.tareas[indexTarea].preguntas,
                {id: id, respuesta: {base64: path, tempUri: tempUri}},
              ],
            },
          ],
        });
      } else {
        setFormularioPreguntas({
          ...formularioPreguntas,
          tareas: [
            {
              ...formularioPreguntas.tareas[indexTarea],
              preguntas: [
                ...formularioPreguntas.tareas[indexTarea].preguntas.slice(
                  0,
                  indexPregunta,
                ),
                {
                  ...formularioPreguntas.tareas[indexTarea].preguntas[
                    indexPregunta
                  ],
                  respuesta: {base64: path, tempUri: tempUri},
                },
                ...formularioPreguntas.tareas[indexTarea].preguntas.slice(
                  indexPregunta + 1,
                ),
              ],
            },
          ],
        });
      }
    }
    SetStorage(formularioPreguntas);
  };

  const handleRespAudio = async (tareaId, id, tempUri, tipo) => {
    const base64 = await RNFS.readFile(tempUri, 'base64');
    let path = RNFS.DocumentDirectoryPath + `/audio_${tareaId}${id}.mp4`;
    RNFS.writeFile(path, base64, 'utf8')
      .then(success => {
        console.log('FILE WRITTEN!');
      })
      .catch(err => {
        console.log(err.message);
      });

    const indexTarea = formularioPreguntas.tareas.findIndex(
      tarea => tarea.TareaId === tareaId,
    );

    if (indexTarea === -1) {
      setFormularioPreguntas({
        ...formularioPreguntas,
        tareas: [
          ...formularioPreguntas.tareas,
          {
            TareaId: tareaId,
            preguntas: [
              {
                id: id,
                respuesta: {base64: path},
                tipo: tipo,
              },
            ],
          },
        ],
      });
    } else {
      const indexPregunta = formularioPreguntas.tareas[
        indexTarea
      ].preguntas.findIndex(pregunta => pregunta.id === id);

      if (indexPregunta === -1) {
        setFormularioPreguntas({
          ...formularioPreguntas,
          tareas: [
            {
              ...formularioPreguntas.tareas[indexTarea],
              preguntas: [
                ...formularioPreguntas.tareas[indexTarea].preguntas,
                {id: id, respuesta: {base64: path}},
              ],
            },
          ],
        });
      } else {
        setFormularioPreguntas({
          ...formularioPreguntas,
          tareas: [
            {
              ...formularioPreguntas.tareas[indexTarea],
              preguntas: [
                ...formularioPreguntas.tareas[indexTarea].preguntas.slice(
                  0,
                  indexPregunta,
                ),
                {
                  ...formularioPreguntas.tareas[indexTarea].preguntas[
                    indexPregunta
                  ],
                  respuesta: {base64: path},
                },
                ...formularioPreguntas.tareas[indexTarea].preguntas.slice(
                  indexPregunta + 1,
                ),
              ],
            },
          ],
        });
      }
    }
    SetStorage(formularioPreguntas);
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
        <TouchableOpacity style={styles.btn} onPress={takePhotoFromGallery}>
          <Text style={styles.text5}>Galería</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            visualizaAudio ? setvisualizaAudio(false) : setvisualizaAudio(true);
          }}>
          <Text style={styles.text5}>Audio</Text>
        </TouchableOpacity>
      </View>
      {visualizaAudio && (
        <Recaudio
          handleRespAudio={handleRespAudio}
          pregunta={pregunta}
          tareaId={tareaId}
        />
      )}
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
      <ItemSeparator />
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
  },
  btn: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    color: '#fb8c00',
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
