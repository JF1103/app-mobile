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
  preguntaid,
  formularioPreguntas,
  setFormularioPreguntas,
  preguntatiporespuesta,
}) => {
  console.log(tareaId, preguntaid);
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
  };
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
      preguntaid,
      {dat: result.encoded, tempUri: result.pathName},
      preguntatiporespuesta,
    );
  };
  const _onDragEvent = () => {
    // This callback will be called when the user enters signature
    console.log('dragged');
  };

  const handleRespFirma = async (tareaId, preguntaid, respuesta, tipo) => {
    const base64 = await RNFS.readFile(respuesta.tempUri, 'base64');
    console.log(preguntaid);
    let path =
      RNFS.DocumentDirectoryPath + `/firma_${tareaId}_${preguntaid}.png`;
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
                id: preguntaid,
                respuesta: {base64: path, tempUri: respuesta.tempUri},
                tipo: tipo,
              },
            ],
          },
        ],
      });
    } else {
      const indexPregunta = formularioPreguntas.tareas[
        indexTarea
      ].preguntas.findIndex(pregunta => pregunta.id === preguntaid);

      if (indexPregunta === -1) {
        setFormularioPreguntas({
          ...formularioPreguntas,
          tareas: [
            {
              ...formularioPreguntas.tareas[indexTarea],
              preguntas: [
                ...formularioPreguntas.tareas[indexTarea].preguntas,
                {
                  id: preguntaid,
                  respuesta: {base64: path, tempUri: respuesta.tempUri},
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
              preguntas: [
                ...formularioPreguntas.tareas[indexTarea].preguntas.slice(
                  0,
                  indexPregunta,
                ),
                {
                  ...formularioPreguntas.tareas[indexTarea].preguntas[
                    indexPregunta
                  ],
                  respuesta: {base64: path, tempUri: respuesta.tempUri},
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
    <>
      <TouchableOpacity
        onPress={() => {
          visualizaFirma ? setVisualizaFirma(false) : setVisualizaFirma(true);
        }}>
        <Icon name="reorder-three-outline" size={40} color="#000000" />
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
    borderWidth: 2,
  },
  signature: {
    borderWidth: 1.5,
    height: 200,
    boxShadow: 5,
    borderColor: '#fb8c00',
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
});

export default Firma;
