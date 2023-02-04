import React, {useContext, useState} from 'react';
import {FormContext} from '../context/FormContext';
import {useLocation} from '../hooks/useLocation';
import NumericInput from 'react-native-numeric-input';
import {handleResp} from '../helpers/handleRespt';
import {StyleSheet, Text, View} from 'react-native';

export const MaterialesCmp = ({
  idMaterial,
  pregunta,
  disabled,
  tarea,
  idotd,
  formulario,
  employee,
  idUsuario,
  arrayReq,
  setArrayReq,
  respuesta,
  cantMaterialArray,
  setCantMaterialArray,
}) => {
  const {formAsync, setformAsync, formularioPreguntas, setFormularioPreguntas} =
    useContext(FormContext);
  const [textAreaReq, settextAreaReq] = useState(false);

  const {getCurrentLocation} = useLocation();
  const [cantMaterial, setCantMaterial] = useState(
    cantMaterialArray.length > 0
      ? cantMaterialArray.filter(item => (item.id = idMaterial))[0].value
      : 0,
  );
  /* console.log(
    'array',
    cantMaterialArray.filter(item => (item.id = idMaterial))[0].value,
  ); */
  console.log('cantMaterial', cantMaterial, idMaterial);
  const MaterialAsync = formAsync?.formcomplet
    ?.filter(item => item.idUsuario === idUsuario)[0]
    ?.ots.filter(item => item.id_ot === employee.id)[0]
    ?.tareas.filter(item => item.TareaId === tarea.id)[0]
    ?.formularios.filter(item => item.FormularioId === formulario.id)[0]
    ?.preguntas.filter(item => item.id === pregunta.id)[0]
    ?.respuesta.filter(item => item.id === idMaterial);

  const handlerespMateriales = value => {
    let arracpy = [...cantMaterialArray];
    console.log('materiales', cantMaterialArray);
    setCantMaterial(value);
    //valido si el material ya existe en el array
    if (cantMaterialArray.filter(item => item.id === idMaterial).length > 0) {
      //si existe lo modifico
      console.log('entre en el if', arracpy);
      arracpy.filter(item => item.id === idMaterial)[0].value = value;
      console.log('entre en el true', arracpy);
      setCantMaterialArray(arracpy);
    } else {
      //si no existe lo agrego
      arracpy.push({id: idMaterial, value: value});
      console.log('entre en el else', arracpy);
      setCantMaterialArray(arracpy);
    }
    getCurrentLocation().then(cords => {
      handleResp(
        tarea.id,
        idotd,
        formulario.id,
        formulario.refformularioconector,
        pregunta.id,
        arracpy,
        pregunta.tiporespuesta,
        formularioPreguntas,
        setFormularioPreguntas,
        employee,
        idUsuario,
        cords,
      );
    });
  };
  return (
    <View style={styles.items}>
      <Text style={styles.text}>{respuesta.respuesta}</Text>
      <NumericInput
        value={cantMaterial}
        onChange={value => {
          handlerespMateriales(value);
        }}
        onLimitReached={(isMax, msg) => console.log(isMax, msg)}
        totalWidth={150}
        totalHeight={40}
        iconSize={30}
        step={1}
        valueType="real"
        rounded
        textColor="#000000"
        iconStyle={{color: 'white'}}
        rightButtonBackgroundColor="#fb8c00"
        leftButtonBackgroundColor="#fb8c00"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  items: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 5,
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
    fontSize: 20,
    color: '#fb8c00',
    padding: 5,
    marginVertical: '3%',
    textAlign: 'center',
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
