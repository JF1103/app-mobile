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
}) => {
  const [visualizaAudio, setvisualizaAudio] = useState(false);
  const {getCurrentLocation} = useLocation();

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

  const syncUri = formAsync?.formcomplet
    .filter(item => item.idUsuario === idUsuario)[0]
    ?.ots.filter(item => item.id_ot === employee.id)[0]
    ?.tareas.filter(item => item.TareaId === tareaId)[0]
    ?.formularios.filter(item => item.FormularioId === formularioId)[0]
    ?.preguntas.filter(item => item.tipo === 'Archivo')[0]?.respuesta?.tempUri;

  // console.log('syncUri', syncUri);
  useEffect(() => {
    checkLocationPermissions();
  }, []);

  const [tempUri, setTempUri] = useState(syncUri ? syncUri : '');

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

    RNFS.writeFile(path, base64, 'utf8')
      .then(success => {
        console.log('FILE WRITTEN!');
      })
      .catch(err => {
        console.log(err.message);
      });

    getCurrentLocation().then(cords => {
      handleResp(
        tareaId,
        idotd,
        formularioId,
        refformularioconector,
        id,
        {base64: path, tempUri: tempUri},
        tipo,
        formularioPreguntas,
        setFormularioPreguntas,
        employee,
        idUsuario,
        cords,
      );
    });
  };
  //console.log('ITEMS', respuesta, tipo);

  /*   const indexTarea = formularioPreguntas.tareas.findIndex(
      tarea => tarea.TareaId === tareaId,
    );
    if (indexTarea === -1) {
      setFormularioPreguntas({
        ...formularioPreguntas,
        tareas: [
          {
            TareaId: tareaId,
            formularios: [
              {
                FormularioId: formularioId,
                preguntas: [
                  {
                    id: id,
                    respuesta: {base64: path, tempUri: tempUri},
                    tipo: tipo,
                  },
                ],
              },
            ],
          },
        ],
      });
    } else {
      const indexFormulario = formularioPreguntas.tareas[
        indexTarea
      ].formularios.findIndex(
        formulario => formulario.FormularioId === formularioId,
      );

      if (indexFormulario === -1) {
        setFormularioPreguntas({
          ...formularioPreguntas,
          tareas: [
            {
              ...formularioPreguntas.tareas[indexTarea],
              formularios: [
                {
                  FormularioId: formularioId,
                  preguntas: [
                    {
                      id: id,
                      respuesta: {base64: path, tempUri: tempUri},
                      tipo: tipo,
                    },
                  ],
                },
              ],
            },
          ],
        });
      } else {
        const indexPregunta = formularioPreguntas.tareas[
          indexTarea
        ].formularios[indexFormulario].preguntas.findIndex(
          pregunta => pregunta.id === id,
        );

        if (indexPregunta === -1) {
          setFormularioPreguntas({
            ...formularioPreguntas,
            tareas: [
              {
                ...formularioPreguntas.tareas[indexTarea],
                formularios: [
                  {
                    ...formularioPreguntas.tareas[indexTarea].formularios[
                      indexFormulario
                    ],
                    preguntas: [
                      ...formularioPreguntas.tareas[indexTarea].formularios[
                        indexFormulario
                      ].preguntas,
                      {
                        id: id,
                        respuesta: {base64: path, tempUri: tempUri},
                        tipo: tipo,
                      },
                    ],
                  },
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
                formularios: [
                  {
                    ...formularioPreguntas.tareas[indexTarea].formularios[
                      indexFormulario
                    ],
                    preguntas: [
                      ...formularioPreguntas.tareas[indexTarea].formularios[
                        indexFormulario
                      ].preguntas.slice(0, indexPregunta),
                      {
                        id: id,
                        respuesta: {base64: path, tempUri: tempUri},
                        tipo: tipo,
                      },
                      ...formularioPreguntas.tareas[indexTarea].formularios[
                        indexFormulario
                      ].preguntas.slice(indexPregunta + 1),
                    ],
                  },
                ],
              },
            ],
          });
        }
      }
    }
    SetStorage(formularioPreguntas); */

  const handleRespAudio = async (tareaId, formularioId, id, tempUri, tipo) => {
    const base64 = await RNFS.readFile(tempUri, 'base64');
    let path =
      RNFS.DocumentDirectoryPath +
      `/audio_${tareaId}_${formularioId}_${id}.mp4`;
    RNFS.writeFile(path, base64, 'utf8')
      .then(success => {
        console.log('FILE WRITTEN!');
      })
      .catch(err => {
        console.log(err.message);
      });
    getCurrentLocation().then(cords => {
      handleResp(
        tareaId,
        idotd,
        formularioId,
        refformularioconector,
        id,
        {base64: path},
        tipo,
        formularioPreguntas,
        setFormularioPreguntas,
        employee,
        idUsuario,
        cords,
      );
    });
    /*   
    const indexTarea = formularioPreguntas.tareas.findIndex(
      tarea => tarea.TareaId === tareaId,
    );
    if (indexTarea === -1) {
      setFormularioPreguntas({
        ...formularioPreguntas,
        tareas: [
          {
            TareaId: tareaId,
            formularios: [
              {
                FormularioId: formularioId,
                preguntas: [{id: id, respuesta: {base64: path}, tipo: tipo}],
              },
            ],
          },
        ],
      });
    } else {
      const indexFormulario = formularioPreguntas.tareas[
        indexTarea
      ].formularios.findIndex(
        formulario => formulario.FormularioId === formularioId,
      );

      if (indexFormulario === -1) {
        setFormularioPreguntas({
          ...formularioPreguntas,
          tareas: [
            {
              ...formularioPreguntas.tareas[indexTarea],
              formularios: [
                {
                  FormularioId: formularioId,
                  preguntas: [{id: id, respuesta: {base64: path}, tipo: tipo}],
                },
              ],
            },
          ],
        });
      } else {
        const indexPregunta = formularioPreguntas.tareas[
          indexTarea
        ].formularios[indexFormulario].preguntas.findIndex(
          pregunta => pregunta.id === id,
        );

        if (indexPregunta === -1) {
          setFormularioPreguntas({
            ...formularioPreguntas,
            tareas: [
              {
                ...formularioPreguntas.tareas[indexTarea],
                formularios: [
                  {
                    ...formularioPreguntas.tareas[indexTarea].formularios[
                      indexFormulario
                    ],
                    preguntas: [
                      ...formularioPreguntas.tareas[indexTarea].formularios[
                        indexFormulario
                      ].preguntas,
                      {id: id, respuesta: {base64: path}, tipo: tipo},
                    ],
                  },
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
                formularios: [
                  {
                    ...formularioPreguntas.tareas[indexTarea].formularios[
                      indexFormulario
                    ],
                    preguntas: [
                      ...formularioPreguntas.tareas[indexTarea].formularios[
                        indexFormulario
                      ].preguntas.slice(0, indexPregunta),
                      {id: id, respuesta: {base64: path}, tipo: tipo},
                      ...formularioPreguntas.tareas[indexTarea].formularios[
                        indexFormulario
                      ].preguntas.slice(indexPregunta + 1),
                    ],
                  },
                ],
              },
            ],
          });
        }
      }
    }
    SetStorage(formularioPreguntas); */
  };

  return (
    <View key={pregunta.id}>
      <Text style={styles.archivo}>{pregunta.pregunta}</Text>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 10,
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
          tareaId={tareaId}
          formularioId={formularioId}
          pregunta={pregunta}
          formAsync={formAsync}
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
    </View>
  );
};
const styles = StyleSheet.create({
  archivo: {
    fontSize: 14,
    color: '#fb8c00',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  btn: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    boxShadow: 5,
    borderColor: '#fb8c00',
    borderWidth: 1.0,
    height: 30,
    justifyContent: 'center',
    marginRight: 5,
    marginLeft: 5,
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
