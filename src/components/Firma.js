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
import {ItemSeparator2} from './ItemSeparator2';
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
  pregunta,
  formularioPreguntas,
  setFormularioPreguntas,
  preguntatiporespuesta,
  employee,
  idUsuario,
  formAsync,
  arrayReq,
  setArrayReq,
}) => {
  const {getCurrentLocation} = useLocation();
  let path =
    RNFS.DocumentDirectoryPath +
    `/firma_${employee.id}_${tareaId}_${formularioId}_${pregunta.id}.png`;
  RNFS.DocumentDirectoryPath;
  const [base64, setbase64] = useState(null);
  const [firmaReq, setfirmaReq] = useState(false);

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
    
  }, []); */

  const exists = async () => {
    /* let exists = await RNFS.exists(
      '/data/user/0/com.app_mobile/files/firma_14_5_3_13.png',
    ); */

    firmInit && setbase64(await RNFS.readFile(firmInit, 'base64'));
  };

  useEffect(() => {
    exists();
  }, [firmPath]);
  const [visualizaFirma, setVisualizaFirma] = useState(firmPath ? true : false);

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

  useEffect(() => {
    if (
      arrayReq.length > 0 &&
      arrayReq.filter(item => item.id === pregunta.id).length > 0
    ) {
      setfirmaReq(true);
    } else {
      setfirmaReq(false);
    }
  }, [arrayReq]);

  const _onSaveEvent = result => {
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
        pregunta.id,
        {dat: result.encoded, tempUri: result.pathName, fileType: 'file/png'},
        preguntatiporespuesta,
        employee,
        idUsuario,
        cords,
      );
      /*   saveBtn.current.resetImage(); */
    });
    setfirmaReq(false);
    setArrayReq(arrayReq.filter(item => item.id !== pregunta.id));
  };
  const _onDragEvent = () => {};

  console.log('firmPath', firmPath);
  return (
    <>
      <TouchableOpacity
        style={{alignItems: 'center'}}
        onPress={() => {
          visualizaFirma ? setVisualizaFirma(false) : setVisualizaFirma(true);
        }}>
        <Image
          style={firmaReq ? styles.text1Error : styles.text1}
          source={require('./../assets/img/expo-2.png')}
        />
      </TouchableOpacity>
      <SafeAreaView
        style={firmaReq ? styles.marcoError : {...styles.marco, ...stylesE}}>
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
        <View style={{alignItems: 'center'}}>
          <ItemSeparator2 />

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
                  pregunta.id,
                  preguntatiporespuesta,
                );
                /* saveBtn.current.resetImage(); */
              }}>
              <Text style={styles.text}>Borrar</Text>
            </TouchableHighlight>
          </View>
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
    borderColor: '#fb8c00',
    borderWidth: 1,
  },
  marcoError: {
    backgroundColor: '#ffffff',
    borderColor: 'red',
    borderWidth: 2,
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
    borderColor: '#fb8c00',
    borderWidth: 1,
    height: 30,
    justifyContent: 'center',
    marginHorizontal: 40,
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  text: {
    fontSize: 16,
    color: '#fb8c00',
    textAlign: 'center',
  },
  text1: {
    marginVertical: '5%',
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    borderColor: '#fb8c00',
    borderWidth: 1,
  },
  text1Error: {
    marginVertical: '5%',
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    borderColor: 'red',
    borderWidth: 2,
  },
});

export default Firma;
