import React, {useContext, useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {ItemSeparator} from './ItemSeparator';
import {AuthContext} from '../context/AuthContext';
import RNSingleSelect, {
  ISingleSelectDataType,
} from '@freakycoder/react-native-single-select';
import RNMultiSelect from '../libs/react-native-multiple-select';
import RNTextArea from '@freakycoder/react-native-text-area';
import {GetFiles} from './GetFiles';
import {Maps} from './Maps';
import Firma from './Firma';
import {handleResp} from '../helpers/handleRespt';
import {SetStorage} from './SetStorage';
import {FormContext} from '../context/FormContext';
import {useLocation} from '../hooks/useLocation';
import SendFormulrio from './SendFormulrio';
import {Chase} from 'react-native-animated-spinkit';
import {validaCampos} from '../helpers/validaCampos';
import {TextAreaCmp} from './TextAreaCmp';
import {SingleSelectCmp} from './SingleSelectCmp';
import {MultiSelectCmp} from './MultiSelectCmp.js';
import {MaterialesCmp} from './MaterialesCmp';
import {MaterialesArray} from './MaterialesArray';

export const Formularios = ({
  formulario,
  idotd,
  tarea,
  employee,
  cordsOt,
  idUsuario,
  finish,
}) => {
  const {formAsync, setformAsync, formularioPreguntas, setFormularioPreguntas} =
    useContext(FormContext);
  const {userInfo} = useContext(AuthContext);

  const [formsended, setformsended] = useState(false);
  const [arrayReq, setArrayReq] = useState([]);
  const [sending, setSending] = useState(false);

  /*  console.log('arrayReq del formulario', arrayReq); */

  const preguntas = formulario.preguntas;

  const {getCurrentLocation} = useLocation();
  const [disabled, setDisabled] = useState(false);

  const [validaForm, setvalidaForm] = useState(false);

  useEffect(() => {
    if (!finish) {
      /*  console.log('entrooooooo cambio el storage'); */
      SetStorage(formularioPreguntas);
      setformAsync(formularioPreguntas);
    }
  }, [formularioPreguntas]);

  /*   useEffect(() => {
    console.log('cambiooo el requerido');
  }, [arrayReq]); */
  /*  console.log('formulariooooooo', JSON.stringify(formAsync)); */
  useEffect(() => {
    /*   console.log('formulariooooooo', JSON.stringify(formAsync)); */
    const nroRespuestasNoEnv = formAsync?.formcomplet
      ?.filter(item => item.idUsuario === idUsuario)[0]
      ?.ots.filter(item => item.id_ot === employee.id)[0]
      ?.tareas.filter(item => item.TareaId === tarea.id)[0]
      ?.formularios.filter(item => item.FormularioId === formulario.id)[0]
      ?.preguntas.filter(item => item.checkSend === false).length;

    const nroRespuestasVerdad = formAsync?.formcomplet
      ?.filter(item => item.idUsuario === idUsuario)[0]
      ?.ots.filter(item => item.id_ot === employee.id)[0]
      ?.tareas.filter(item => item.TareaId === tarea.id)[0]
      ?.formularios.filter(item => item.FormularioId === formulario.id)[0]
      ?.preguntas.filter(item => item.checkSend === true).length;
    /*     console.log('nroRespuestasNoEnveeeeeeeee', nroRespuestasNoEnv); */
    const numeroPreguntas = formulario.preguntas.length;

    const ended = formAsync?.formcomplet
      ?.filter(item => item.idUsuario === idUsuario)[0]
      ?.ots.filter(item => item.id_ot === employee.id)[0]
      ?.tareas.filter(item => item.TareaId === tarea.id)[0]
      ?.formularios.filter(
        item => item.FormularioId === formulario.id,
      )[0]?.ended;
    /*   console.log('nroRespuestasNoEnv', nroRespuestasNoEnv); */
    if (nroRespuestasNoEnv > 0) {
      /*  console.log('entrooooooo NO ENVE', nroRespuestasNoEnv); */
      setformsended(true);
      setDisabled(true);
      setSending(false);
      if (ended !== true) {
        let copy = formularioPreguntas;
        copy.formcomplet
          .filter(item => item.idUsuario === idUsuario)[0]
          .ots.filter(item => item.id_ot === employee.id)[0]
          .tareas.filter(item => item.TareaId === tarea.id)[0]
          .formularios.filter(
            item => item.FormularioId === formulario.id,
          )[0].ended = true;

        copy.formcomplet
          .filter(item => item.idUsuario === idUsuario)[0]
          .ots.filter(item => item.id_ot === employee.id)[0]
          .tareas.filter(item => item.TareaId === tarea.id)[0].ErrorSend = true;

        setFormularioPreguntas({...copy});
      }
    } else {
      if (nroRespuestasVerdad > 0) {
        /*  console.log('entrooooooo VERDAD', nroRespuestasVerdad); */
        setformsended(true);
        setDisabled(true);
        setSending(false);
        if (ended !== true) {
          let copy = formularioPreguntas;
          copy.formcomplet
            .filter(item => item.idUsuario === idUsuario)[0]
            .ots.filter(item => item.id_ot === employee.id)[0]
            .tareas.filter(item => item.TareaId === tarea.id)[0]
            .formularios.filter(
              item => item.FormularioId === formulario.id,
            )[0].ended = true;

          copy.formcomplet
            .filter(item => item.idUsuario === idUsuario)[0]
            .ots.filter(item => item.id_ot === employee.id)[0]
            .tareas.filter(
              item => item.TareaId === tarea.id,
            )[0].ErrorSend = false;

          setFormularioPreguntas({...copy});
        }
      } else {
        /*         console.log('ENTRO ELSE'); */
        setSending(false);
      }
    }
  }, [formAsync]);

  return (
    <>
      <View style={styles.row}>
        <Text style={styles.welcome}>{formulario.formulario}</Text>
        {preguntas?.map((pregunta, index2) => {
          const data = pregunta.respuestas.map((respuesta, index) => {
            return {
              id: respuesta.id,
              value: respuesta.leyenda,
            };
          });

          const MyInput = () => {
            const [inputWidth, setInputWidth] = useState(100);

            return (
              <TextInput
                style={{width: inputWidth}}
                onChangeText={text => setInputWidth(text.length * 10)}
              />
            );
          };

          return (
            <View key={index2}>
              {pregunta.tiporespuesta === 'Seleccion Simple' ? (
                <View key={pregunta.id} style={{alignItems: 'center'}}>
                  <Text style={styles.selsim}>{pregunta.pregunta}</Text>

                  <SingleSelectCmp
                    pregunta={pregunta}
                    disabled={disabled}
                    tarea={tarea}
                    idotd={idotd}
                    formulario={formulario}
                    employee={employee}
                    idUsuario={idUsuario}
                    arrayReq={arrayReq}
                    setArrayReq={setArrayReq}
                  />
                </View>
              ) : pregunta.tiporespuesta === 'Seleccion Multiple' ? (
                <View style={{alignItems: 'center', marginBottom: -80}}>
                  <MultiSelectCmp
                    pregunta={pregunta}
                    disabled={disabled}
                    tarea={tarea}
                    idotd={idotd}
                    formulario={formulario}
                    employee={employee}
                    idUsuario={idUsuario}
                    arrayReq={arrayReq}
                    setArrayReq={setArrayReq}
                  />
                </View>
              ) : pregunta.tiporespuesta === 'Texto' ? (
                <View
                  key={pregunta.id}
                  style={{alignItems: 'center'}}
                  pointerEvents={disabled ? 'none' : 'auto'}>
                  <Text style={styles.text}>{pregunta.pregunta}</Text>
                  <TextAreaCmp
                    pregunta={pregunta}
                    disabled={disabled}
                    tarea={tarea}
                    idotd={idotd}
                    formulario={formulario}
                    employee={employee}
                    idUsuario={idUsuario}
                    arrayReq={arrayReq}
                    setArrayReq={setArrayReq}
                  />
                </View>
              ) : pregunta.tiporespuesta === 'Geolocalizacion' ? (
                <View pointerEvents={disabled ? 'none' : 'auto'}>
                  <Maps
                    cordsOt={cordsOt}
                    tareaId={tarea.id}
                    idotd={idotd}
                    formularioId={formulario.id}
                    refformularioconector={formulario.refformularioconector}
                    pregunta={pregunta}
                    formularioPreguntas={formularioPreguntas}
                    setFormularioPreguntas={setFormularioPreguntas}
                    employee={employee}
                    idUsuario={idUsuario}
                    formAsync={formAsync}
                    arrayReq={arrayReq}
                    setArrayReq={setArrayReq}
                    disabled={disabled}
                  />
                </View>
              ) : pregunta.tiporespuesta === 'Archivo' ? (
                <View pointerEvents={disabled ? 'none' : 'auto'}>
                  <GetFiles
                    tareaId={tarea.id}
                    idotd={idotd}
                    formularioId={formulario.id}
                    refformularioconector={formulario.refformularioconector}
                    pregunta={pregunta}
                    formularioPreguntas={formularioPreguntas}
                    setFormularioPreguntas={setFormularioPreguntas}
                    employee={employee}
                    idUsuario={idUsuario}
                    formAsync={formAsync}
                    disabled={disabled}
                    arrayReq={arrayReq}
                    setArrayReq={setArrayReq}
                  />
                </View>
              ) : pregunta.tiporespuesta === 'Firma' ? (
                <>
                  <Text style={styles.textfirma}>{pregunta.pregunta}</Text>
                  <View pointerEvents={disabled ? 'none' : 'auto'}>
                    <Firma
                      tareaId={tarea.id}
                      idotd={idotd}
                      formularioId={formulario.id}
                      refformularioconector={formulario.refformularioconector}
                      pregunta={pregunta}
                      formularioPreguntas={formularioPreguntas}
                      setFormularioPreguntas={setFormularioPreguntas}
                      preguntatiporespuesta={pregunta.tiporespuesta}
                      employee={employee}
                      idUsuario={idUsuario}
                      formAsync={formAsync}
                      arrayReq={arrayReq}
                      setArrayReq={setArrayReq}
                    />
                  </View>
                </>
              ) : pregunta.tiporespuesta === 'Materiales' ? (
                <>
                  <Text style={styles.textfirma}>{pregunta.pregunta}</Text>
                  <View pointerEvents={disabled ? 'none' : 'auto'}>
                    <MaterialesArray
                      pregunta={pregunta}
                      disabled={disabled}
                      tarea={tarea}
                      idotd={idotd}
                      formulario={formulario}
                      employee={employee}
                      idUsuario={idUsuario}
                      arrayReq={arrayReq}
                      setArrayReq={setArrayReq}
                    />
                  </View>
                </>
              ) : pregunta.tiporespuesta === 'Datos' ? (
                <>
                  <View style={styles.containerText}>
                    <Text style={styles.textDatos}>
                      {pregunta.respuestas[0].respuesta}
                    </Text>
                  </View>
                </>
              ) : (
                <></>
              )}
            </View>
          );
        })}
        <View
          style={{alignItems: 'center'}}
          pointerEvents={disabled ? 'none' : 'auto'}>
          <TouchableOpacity
            style={disabled ? styles.btnDisable : styles.btnSubmit}
            onPress={() => {
              setSending(true);
              validaCampos(
                tarea.id,
                idotd,
                formulario.id,
                formulario.refformularioconector,
                formularioPreguntas,
                setFormularioPreguntas,
                formulario,
                userInfo,
                employee.id,
                employee,
                setvalidaForm,
                idUsuario,
                setSending,
                arrayReq,
                setArrayReq,
              );
            }}>
            {sending ? (
              <Chase color="white" size={14} />
            ) : (
              <Text style={{...styles.text6}}>Enviar Formulario</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  containerText: {
    marginVertical: 15,
    paddingHorizontal: 5,
  },
  row: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 15,
    marginBottom: 50,
    marginTop: 10,
    paddingHorizontal: 5,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    borderColor: '#fb8c00',
    borderWidth: 1,
  },
  welcome: {
    fontSize: 23,
    backgroundColor: '#fb8c00',
    borderRadius: 20,
    color: 'white',
    padding: 10,
    textAlign: 'center',
    marginTop: 8,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 8,
    borderColor: '#c88719',
    borderWidth: 1,
  },
  text: {
    fontSize: 14,
    color: '#fb8c00',
    padding: 5,
    marginVertical: '3%',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  texterror: {},
  selsim: {
    fontSize: 14,
    color: '#fb8c00',
    padding: 5,
    marginVertical: '3%',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  selmul: {
    fontSize: 14,
    color: '#fb8c00',
    padding: 5,
    marginVertical: '3%',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  textarea: {
    borderRadius: 20,
    height: 45,
    justifyContent: 'center',
    boxShadow: 5,
    borderColor: '#fb8c00',
    borderWidth: 1.0,
    width: '100%',
  },
  textareaError: {
    borderRadius: 20,
    height: 45,
    justifyContent: 'center',
    boxShadow: 5,
    borderColor: 'red',
    borderWidth: 2,
    width: '80%',
  },
  textareaDisable: {
    borderRadius: 20,
    height: 45,
    justifyContent: 'center',
    boxShadow: 5,
    borderColor: '#fb8c00',
    backgroundColor: '#E8D3BB',
    borderWidth: 1.0,
    width: '80%',
  },
  sm: {
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 5,
    borderColor: '#fb8c00',
    borderWidth: 1,
    borderRadius: 18,
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  smError: {
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 5,
    borderColor: 'red',
    borderWidth: 2,
    borderRadius: 18,
    marginBottom: 20,
  },
  btn5: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    boxShadow: 5,
    borderColor: '#fb8c00',
    borderWidth: 1.0,
    height: 40,
    width: '80%',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  text6: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  textDatos: {
    fontSize: 18,
    color: '#fb8c00',
    marginVertical: '1%',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textfirma: {
    fontSize: 14,
    color: '#fb8c00',
    marginVertical: '1%',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  btnDisable: {
    backgroundColor: '#E8D3BB',
    borderRadius: 20,
    padding: 10,
    marginTop: 20,
    marginBottom: 20,
    width: '80%',
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 7,
    borderColor: '#c88719',
    borderWidth: 1,
    alignItems: 'center',
  },
  btnSubmit: {
    backgroundColor: '#fb8c00',
    borderRadius: 20,
    padding: 10,
    marginTop: 20,
    marginBottom: 20,
    width: '80%',
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 7,
    borderColor: '#c88719',
    borderWidth: 1,
    alignItems: 'center',
  },
});
