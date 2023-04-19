import React, {useContext, useEffect, useState} from 'react';
import RNTextArea from '@freakycoder/react-native-text-area';
import {handleResp} from '../helpers/handleRespt';
import {useLocation} from '../hooks/useLocation';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {FormContext} from '../context/FormContext';
import {FakeGpsError} from '../helpers/FakeGpsError';

const heightInitial = 55;
const heightDelta = 20;

export const TextAreaCmp = ({
  pregunta,
  disabled,
  tarea,
  idotd,
  formulario,
  employee,
  idUsuario,
  arrayReq,
  setArrayReq,
}) => {
  const {formAsync, setformAsync, formularioPreguntas, setFormularioPreguntas} =
    useContext(FormContext);

  /*   console.log('cambieeeeeeee en text component'); */

  const textAsync = formAsync?.formcomplet
    ?.filter(item => item.idUsuario === idUsuario)[0]
    ?.ots.filter(item => item.id_ot === employee.id)[0]
    ?.tareas.filter(item => item.TareaId === tarea.id)[0]
    ?.formularios.filter(item => item.FormularioId === formulario.id)[0]
    ?.preguntas?.filter(item => item.id === pregunta.id)[0]?.respuesta;

  const [text, setText] = useState(textAsync ? textAsync : '');
  const {getCurrentLocation, initialPosition} = useLocation();
  const [countLine, setCountLine] = useState(
    textAsync ? Math.floor(textAsync.length / 35 + 1) : 1,
  );
  const [textAreaReq, settextAreaReq] = useState(false);

  useEffect(() => {
    if (
      arrayReq.length > 0 &&
      arrayReq.filter(item => item.id === pregunta.id).length > 0
    ) {
      settextAreaReq(true);
    } else {
      settextAreaReq(false);
    }
  }, [arrayReq]);

  return (
    <RNTextArea
      defaultCharCount={text.length}
      key={pregunta.id}
      textInputStyle={{
        fontSize: 15,
        color: 'black',
        textAlignVertical: 'top',
      }}
      style={
        disabled
          ? styles.textareaDisable
          : textAreaReq
          ? {
              ...styles.textareaError,
              height: heightInitial + heightDelta * countLine,
            }
          : {
              ...styles.textarea,
              height: heightInitial + heightDelta * countLine,
            }
      }
      maxCharLimit={200}
      placeholderTextColor="#000000"
      exceedCharCountColor="#990606"
      placeholder={'Escriba aquí ...'}
      onChangeText={text => {
        if (!initialPosition.mocked) {
          if (!disabled) {
            getCurrentLocation().then(cords => {
              handleResp(
                tarea.id,
                idotd,
                formulario.id,
                formulario.refformularioconector,
                pregunta.id,
                text,
                pregunta.tiporespuesta,
                formularioPreguntas,
                setFormularioPreguntas,
                employee,
                idUsuario,
                cords,
              );
            }),
              setText(text),
              setCountLine(
                Math.floor(text.replace(/(\r\n|\n|\r)/gm, '').length / 30 + 1) +
                  (text.split('\n').length - 1),
              ),
              text !== '' &&
                setArrayReq(arrayReq.filter(item => item.id !== pregunta.id));
          }
        } else {
          FakeGpsError(idUsuario);
        }
      }}
      value={text}
    />
  );
};
const styles = StyleSheet.create({
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
    width: '100%',
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
