import React, {Component, useState, useRef} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  SafeAreaView,
  LogBox,
} from 'react-native';
import SignatureCapture from 'react-native-signature-capture';
import {ItemSeparator} from './ItemSeparator';
import Icon from 'react-native-vector-icons/Ionicons';
import RNFS from 'react-native-fs';
import {SetStorage} from './SetStorage';

const Firma = ({
  tareaId,
  formularioId,
  preguntaid,
  formularioPreguntas,
  setFormularioPreguntas,
  preguntatiporespuesta,
}) => {
  //console.log(tareaId, preguntaid);
  const [visualizaFirma, setVisualizaFirma] = useState(false);

  const saveSign = saveBtn => {
    saveBtn.current.saveImage();
  };

  const resetSign = saveBtn => {
    saveBtn.current.resetImage();
    //eliminr firma

    let path =
      RNFS.DocumentDirectoryPath + `/firma_${tareaId}_${preguntaid}.png`;
    console.log('path', path);
    RNFS.unlink(path)
      .then(() => {
        console.log('FILE DELETED');
      })
      .catch(err => {
        console.log(err.message);
      });

    //actualizar formularioPreguntas
    const indexTarea = formularioPreguntas.tareas.findIndex(
      tarea => tarea.TareaId === tareaId,
    );

    if (indexTarea !== -1) {
      const indexFormulario = formularioPreguntas.tareas[
        indexTarea
      ].formularios.findIndex(
        formulario => formulario.FormularioId === formularioId,
      );
      if (indexFormulario !== -1) {
        const indexPregunta = formularioPreguntas.tareas[
          indexTarea
        ].formularios[indexFormulario].preguntas.findIndex(
          pregunta => pregunta.id === preguntaid,
        );
        if (indexPregunta !== -1) {
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
                      {
                        ...formularioPreguntas.tareas[indexTarea].formularios[
                          indexFormulario
                        ].preguntas.filter(
                          pregunta => pregunta.id !== preguntaid,
                        ),
                      },
                    ],
                  },
                ],
              },
            ],
          });
        }
      }
    }
  };

  /*     if (indexTarea !== -1) {
      const indexPregunta = formularioPreguntas.tareas[
        indexTarea
      ].preguntas.findIndex(pregunta => pregunta.id === preguntaid);

      if (indexPregunta !== -1) {
        console.log('entre eliminarrrr');
        setFormularioPreguntas({
          ...formularioPreguntas,
          tareas: [
            {
              //elimino la pregunta
              ...formularioPreguntas.tareas[indexTarea],
              preguntas: [
                ...formularioPreguntas.tareas[indexTarea].preguntas.slice(
                  0,
                  indexPregunta,
                ),
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
  };*/
  const saveBtn = useRef(null);
  const height = visualizaFirma ? '100%' : 0;
  const stylesE = StyleSheet.create(
    visualizaFirma === true
      ? {height: 280}
      : {height: 0, width: 0, borderColor: 'transparent'},
  );

  const _onSaveEvent = result => {
    console.log(result.pathName);
    handleRespFirma(
      tareaId,
      formularioId,
      preguntaid,
      {dat: result.encoded, tempUri: result.pathName},
      preguntatiporespuesta,
    );
  };
  const _onDragEvent = () => {
    // This callback will be called when the user enters signature
    console.log('dragged');
  };

  const handleRespFirma = async (
    tareaId,
    formularioId,
    id,
    respuesta,
    tipo,
  ) => {
    console.log('ITEMS', respuesta, tipo);

    const base64 = await RNFS.readFile(respuesta.tempUri, 'base64');
    console.log(preguntaid);
    let path =
      RNFS.DocumentDirectoryPath +
      `/firma_${tareaId}_${formularioId}_${id}.png`;
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
          {
            TareaId: tareaId,
            formularios: [
              {
                FormularioId: formularioId,
                preguntas: [
                  {
                    id: id,
                    respuesta: {base64: path, tempUri: respuesta.tempUri},
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
                      respuesta: {base64: path, tempUri: respuesta.tempUri},
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
                        respuesta: {base64: path, tempUri: respuesta.tempUri},
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
                        respuesta: {base64: path, tempUri: respuesta.tempUri},
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
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          visualizaFirma ? setVisualizaFirma(false) : setVisualizaFirma(true);
        }}>
        <Text style={styles.text1}>Presione aquí para firmar</Text>
      </TouchableOpacity>
      <SafeAreaView style={{...styles.marco, ...stylesE}}>
        <SignatureCapture
          ref={saveBtn}
          style={{...styles.signature}}
          onSaveEvent={_onSaveEvent}
          onDragEvent={_onDragEvent}
          saveImageFileInExtStorage={true}
          showNativeButtons={false}
          showTitleLabel={false}
          viewMode={'portrait'}
        />

        <ItemSeparator />

        <View style={{flexDirection: 'row'}}>
          <TouchableHighlight
            style={styles.buttonStyle}
            onPress={() => {
              saveSign(saveBtn);
            }}>
            <Text style={styles.text}>Guardar</Text>
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.buttonStyle}
            onPress={() => {
              resetSign(saveBtn);
            }}>
            <Text style={styles.text}>Borrar</Text>
          </TouchableHighlight>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  marco: {
    backgroundColor: '#ffffff',
    boxShadow: 5,
    borderColor: '#fb8c00',
    borderWidth: 1,
  },
  signature: {
    borderWidth: 1,
    height: 200,
    boxShadow: 5,
    borderColor: '#fb8c00',
    margin: 10,
  },
  buttonStyle: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    boxShadow: 5,
    borderColor: '#fb8c00',
    borderWidth: 1,
    height: 30,
    justifyContent: 'center',
    marginHorizontal: 40,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#fb8c00',
    textAlign: 'center',
  },
  text1: {
    fontSize: 16,
    color: '#000000',
    marginVertical: '2%',
    textAlign: 'center',
  },
});

export default Firma;
