import React, {useContext} from 'react';
import {validaCamposSingleSelect} from './validaCmaposSingleSelect';
import {validaTextArea} from './validaTextArea';
import {validaddMultiple} from './validaddMultiple';
import {validaFirma} from './validaFirma';
import {validaFiles} from './validaFiles';
import {ToastAndroid} from 'react-native';
import SendFormulrio from '../components/SendFormulrio';
import {FormContext} from '../context/FormContext';

export const validaCampos = (
  treaID,
  idotd,
  formularioId,
  refformularioconector,
  formularioPreguntas,
  setFormularioPreguntas,
  formulario,
  userInfo,
  otid,
  employee,
  setvalidaForm,
  idUsuario,
  setSending,
  arrayReq,
  setArrayReq,
) => {
  let validFirma = [];
  let validFile = [];
  let validSingleSelect = [];
  let validTextArea = [];
  let validMultiSelect = [];
  let validMaps = [];
  let arrayrequeridos = [];

  console.log('formulario', arrayReq);

  const nestValFirma = formulario.preguntas.filter(
    pre => pre.tiporespuesta === 'Firma' && pre.obligatoria === 1,
  );
  const nestValArchivo = formulario.preguntas.filter(
    pre => pre.tiporespuesta === 'Archivo' && pre.obligatoria === 1,
  );
  const nestValSingleSelect = formulario.preguntas.filter(
    pre => pre.tiporespuesta === 'Seleccion Simple' && pre.obligatoria === 1,
  );
  const nestValTextArea = formulario.preguntas.filter(
    pre => pre.tiporespuesta === 'Texto' && pre.obligatoria === 1,
  );

  const nestValMultiSelect = formulario.preguntas.filter(
    pre => pre.tiporespuesta === 'Seleccion Multiple' && pre.obligatoria === 1,
  );

  if (nestValTextArea[0] !== undefined) {
    validTextArea = validaTextArea(
      nestValTextArea,
      formularioPreguntas,
      treaID,
      formularioId,
      userInfo,
      otid,
      arrayReq,
      setArrayReq,
      arrayrequeridos,
    );
  }
  if (nestValSingleSelect[0] !== undefined) {
    validSingleSelect = validaCamposSingleSelect(
      nestValSingleSelect,
      formularioPreguntas,
      treaID,
      formularioId,
      userInfo,
      otid,
      arrayReq,
      setArrayReq,
      arrayrequeridos,
    );
  }
  console.log('despues de val texto', arrayrequeridos);
  if (nestValMultiSelect[0] !== undefined) {
    validMultiSelect = validaddMultiple(
      nestValMultiSelect,
      formularioPreguntas,
      treaID,
      formularioId,
      userInfo,
      otid,
      arrayReq,
      setArrayReq,
      arrayrequeridos,
    );
  }

  if (nestValFirma[0] !== undefined) {
    validFirma = validaFirma(
      nestValFirma,
      formularioPreguntas,
      treaID,
      formularioId,
      userInfo,
      otid,
      arrayReq,
      setArrayReq,
      arrayrequeridos,
    );
  }

  if (nestValArchivo[0] !== undefined) {
    validFile = validaFiles(
      nestValArchivo,
      formularioPreguntas,
      treaID,
      formularioId,
      userInfo,
      otid,
      arrayReq,
      setArrayReq,
      arrayrequeridos,
    );
    /*  console.log('aarayreq en la validacion', arrayReq); */
  }

  if (arrayrequeridos.length !== 0) {
    setArrayReq(arrayrequeridos);
  }

  console.log('validSingleSelect', validSingleSelect);
  console.log('validTextArea', validTextArea);
  console.log('validMultiSelect', validMultiSelect);
  console.log('validFirma', validFirma);
  console.log('validFile', validFile);

  if (
    validSingleSelect?.length == 0 &&
    validTextArea?.length == 0 &&
    validMultiSelect?.length == 0 &&
    validFirma?.length == 0 &&
    validFile?.length == 0
  ) {
    setvalidaForm(true);

    SendFormulrio(
      treaID,
      idotd,
      formulario.id,
      formulario.refformularioconector,
      formularioPreguntas,
      setFormularioPreguntas,
      employee,
      idUsuario,
      setSending,
    );
  } else {
    setSending(false);
    ToastAndroid.show('Faltan completar campos requeridos', ToastAndroid.SHORT);
    setvalidaForm(false);
  }

  return (
    validSingleSelect &&
    validTextArea &&
    validMultiSelect &&
    validFirma &&
    validFile
  );
};
