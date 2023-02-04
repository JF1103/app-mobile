import React, {useContext, useState} from 'react';
import {View} from 'react-native';
import {FormContext} from '../context/FormContext';
import {MaterialesCmp} from './MaterialesCmp';

export const MaterialesArray = ({
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
  const MaterialAsync = formAsync?.formcomplet
    ?.filter(item => item.idUsuario === idUsuario)[0]
    ?.ots.filter(item => item.id_ot === employee.id)[0]
    ?.tareas.filter(item => item.TareaId === tarea.id)[0]
    ?.formularios.filter(item => item.FormularioId === formulario.id)[0]
    ?.preguntas.filter(item => item.id === pregunta.id)[0]?.respuesta;

  console.log('MaterialAsync', MaterialAsync);
  const [cantMaterialArray, setCantMaterialArray] = useState(
    MaterialAsync ? MaterialAsync : [],
  );
  console.log('cantMaterialArray', cantMaterialArray);

  return (
    <View>
      {pregunta?.respuestas.map((item, index) => {
        return (
          <MaterialesCmp
            key={index}
            idMaterial={item.id}
            pregunta={pregunta}
            disabled={disabled}
            tarea={tarea}
            idotd={idotd}
            formulario={formulario}
            employee={employee}
            idUsuario={idUsuario}
            arrayReq={arrayReq}
            setArrayReq={setArrayReq}
            respuesta={item}
            cantMaterialArray={cantMaterialArray}
            setCantMaterialArray={setCantMaterialArray}
          />
        );
      })}
    </View>
  );
};
