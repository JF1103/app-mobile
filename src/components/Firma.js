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
    `/firma_${employee.id}_${tareaId}_${formularioId}_${preguntaid}.png`;
  RNFS.DocumentDirectoryPath;
  const [base64, setbase64] = useState(null);

  const firmInit = formAsync?.formcomplet
    .filter(item => item.idUsuario === idUsuario)[0]
    ?.ots.filter(item => item.id_ot === employee.id)[0]
    ?.tareas.filter(item => item.TareaId === tareaId)[0]
    ?.formularios.filter(item => item.FormularioId === formularioId)[0]
    ?.preguntas.filter(item => item.tipo === 'Firma')[0]?.respuesta?.base64;

  const [firmPath, setFirmPath] = useState(
    firmInit ? 'file:' + firmInit : null,
  );
  /* useEffect(async () => {
    const base64 = await RNFS.readFile(firmInit, 'base64');
    console.log('de la memoria2', base64);
  }, []); */

  const exists = async () => {
    /* let exists = await RNFS.exists(
      '/data/user/0/com.app_mobile/files/firma_14_5_3_13.png',
    ); */
    /* console.log('exists', exists); */
    firmInit && setbase64(await RNFS.readFile(firmInit, 'base64'));
  };

  useEffect(() => {
    exists();
  }, [firmPath]);
  const [visualizaFirma, setVisualizaFirma] = useState(firmPath ? true : false);

  console.log('firmPath', firmPath);
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
    console.log('pathname onsaveevent', result.encoded);
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
        {dat: result.encoded, tempUri: result.pathName, fileType: 'file/png'},
        preguntatiporespuesta,
        employee,
        idUsuario,
        cords,
      );
      /*   saveBtn.current.resetImage(); */
    });
  };
  const _onDragEvent = () => {
    console.log('dragged');
  };

  console.log('baes54', base64);
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          visualizaFirma ? setVisualizaFirma(false) : setVisualizaFirma(true);
        }}>
        <Text style={styles.text1}>Presione aquí para firmar</Text>
      </TouchableOpacity>
      <SafeAreaView style={{...styles.marco, ...stylesE}}>
        {base64 !== null && firmPath ? (
          <Image
            source={{uri: `data:image/png;base64,${base64}`}}
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
                idUsuario,
                employee,
                idotd,
                tareaId,
                formularioId,
                preguntaid,
                preguntatiporespuesta,
              );
              /* saveBtn.current.resetImage(); */
            }}>
            <Text style={styles.text}>Borrar</Text>
          </TouchableHighlight>
        </View>
      </SafeAreaView>
      {/*   {base64 !== null && (
        <Image
          source={{uri: `data:image/png;base64,${base64}`}}
          style={{
            marginTop: 20,
            width: '100%',
            height: 200,
          }}
        />
      )} */}
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
    fontSize: 14,
    color: '#000000',
    marginVertical: '2%',
    textAlign: 'center',
  },
});

export default Firma;
