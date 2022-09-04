import React, {Component, useState, useRef} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import SignatureCapture from 'react-native-signature-capture';
import {ItemSeparator} from './ItemSeparator';
import Icon from 'react-native-vector-icons/Ionicons';

const Firma = ({
  preguntaid,
  formularioPreguntas,
  setFormularioPreguntas,
  preguntatiporespuesta,
}) => {
  const [visualizaFirma, setVisualizaFirma] = useState(false);

  const saveSign = saveBtn => {
    saveBtn.current.saveImage();
  };

  const resetSign = saveBtn => {
    saveBtn.current.resetImage();
    //eliminr firma
    const index = formularioPreguntas.preguntas.findIndex(
      item => item.id === preguntaid,
    );

    if (index > -1) {
      const auxform = formularioPreguntas.pregunta;
    }

    setFormularioPreguntas({
      ...formularioPreguntas,
      preguntas: [
        ...formularioPreguntas.preguntas.filter(item => item.id !== preguntaid),
      ],
    });
  };
  const saveBtn = useRef(null);
  const height = visualizaFirma ? '100%' : 0;
  const stylesE = StyleSheet.create(
    visualizaFirma === true
      ? {height: 280}
      : {height: 0, width: 0, borderColor: 'transparent'},
  );

  const _onSaveEvent = result => {
    handleRespFirma(
      preguntaid,
      {dat: result.encoded, tipo: preguntatiporespuesta},
      preguntatiporespuesta,
    );
    //result.pathName - for the file path name
  };
  const _onDragEvent = () => {
    // This callback will be called when the user enters signature
    console.log('dragged');
  };

  const handleRespFirma = (id, respuesta, tipo) => {
    const index = formularioPreguntas.preguntas.findIndex(
      pregunta => pregunta.id === id,
    );

    if (index === -1) {
      setFormularioPreguntas({
        ...formularioPreguntas,
        preguntas: [
          ...formularioPreguntas.preguntas,
          {id: id, respuesta: respuesta},
        ],
      });
    } else {
      setFormularioPreguntas({
        ...formularioPreguntas,
        preguntas: formularioPreguntas.preguntas.map(pregunta =>
          pregunta.id === id ? {...pregunta, respuesta: respuesta} : pregunta,
        ),
      });
    }
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
          saveImageFileInExtStorage={false}
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


