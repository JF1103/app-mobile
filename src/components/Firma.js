import React, {Component, useState, useRef, useEffect} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
  SafeAreaView,
  LogBox,
  Image,
} from 'react-native';
import SignatureCapture from 'react-native-signature-capture';
import {ItemSeparator} from './ItemSeparator';
import Icon from 'react-native-vector-icons/Ionicons';
import RNFS from 'react-native-fs';
import {SetStorage} from './SetStorage';
import {deleteFiles} from './DeleteFiles';
import {resetSign} from './ResetFirm';
import {handleRespFirma} from './handleRespFirma';
import {useLocation} from '../hooks/useLocation';

const Firma = ({
  tareaId,
  idotd,
  formularioId,
  refformularioconector,
  preguntaid,
  formularioPreguntas,
  setFormularioPreguntas,
  preguntatiporespuesta,
  employee,
  idUsuario,
  formAsync,
}) => {
  const {getCurrentLocation} = useLocation();
  let path =
    RNFS.DocumentDirectoryPath +
    `/firma_${tareaId}_${formularioId}_${preguntaid}.png`;

  const exists = async () => {
    let exists = await RNFS.exists(
      '/data/user/0/com.app_mobile/files/firma_5_3_13.png',
    );
    console.log('exists', exists);
  };

  useEffect(() => {
    exists();
  }, []);

  const firmInit = formAsync?.formcomplet
    .filter(item => item.idUsuario === idUsuario)[0]
    ?.ots.filter(item => item.id_ot === employee.id)[0]
    ?.tareas.filter(item => item.TareaId === tareaId)[0]
    ?.formularios.filter(item => item.FormularioId === formularioId)[0]
    ?.preguntas.filter(item => item.tipo === 'Firma')[0]?.respuesta?.base64;

  const [firmPath, setFirmPath] = useState(
    firmInit ? 'file:' + firmInit : null,
  );

  const [visualizaFirma, setVisualizaFirma] = useState(firmPath ? true : false);

  /*  console.log('firmPath', firmPath);
  console.log('firmInit', firmInit);
  console.log(JSON.stringify(formularioPreguntas)); */

  const saveSign = saveBtn => {
    saveBtn.current.saveImage();
  };

  const saveBtn = useRef(null);
  const height = visualizaFirma ? '100%' : 0;
  const stylesE = StyleSheet.create(
    visualizaFirma === true
      ? {height: 280}
      : {height: 0, width: 0, borderColor: 'transparent'},
  );

  const _onSaveEvent = result => {
    /* console.log('pathname onsaveevent', result.encoded); */
    getCurrentLocation().then(cords => {
      handleRespFirma(
        formularioPreguntas,
        setFormularioPreguntas,
        path,
        firmPath,
        setFirmPath,
        tareaId,
        idotd,
        formularioId,
        refformularioconector,
        preguntaid,
        {dat: result.encoded, tempUri: result.pathName, fileType},
        preguntatiporespuesta,
        employee,
        idUsuario,
        cords,
      );
    });
  };
  const _onDragEvent = () => {
    console.log('dragged');
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
        {firmPath ? (
          <Image
            source={{uri: firmPath}}
            style={{
              marginTop: 20,
              width: '100%',
              height: 200,
            }}
          />
        ) : (
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
        )}

        <ItemSeparator />

        <View style={{flexDirection: 'row'}}>
          {!firmPath && (
            <TouchableHighlight
              style={styles.buttonStyle}
              onPress={() => {
                saveSign(saveBtn);
              }}>
              <Text style={styles.text}>Guardar</Text>
            </TouchableHighlight>
          )}

          <TouchableHighlight
            style={styles.buttonStyle}
            onPress={() => {
              resetSign(
                path,
                saveBtn,
                firmPath,
                setFirmPath,
                formularioPreguntas,
                setFormularioPreguntas,
                tareaId,
                formularioId,
                preguntaid,
                preguntatiporespuesta,
              );
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
    alignItems: 'center'
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
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    fontSize: 16,
    color: '#fb8c00',
    textAlign: 'center',
  },
  text1: {
    fontSize: 14,
    color: '#000000',
    marginVertical: '2%',
    textAlign: 'center',
  },
});

export default Firma;
