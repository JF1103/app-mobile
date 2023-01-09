import React from 'react';
import {validaCamposSingleSelect} from './validaCmaposSingleSelect';
import {validaTextArea} from './validaTextArea';
import {validaddMultiple} from './validaddMultiple';
import {validaFirma} from './validaFirma';
import {validaFiles} from './validaFiles';
import {ToastAndroid} from 'react-native';
import SendFormulrio from '../components/SendFormulrio';

export const validaCampos = (
  selectedItem,
  setsingleSelectReq,
  text,
  settextAreaReq,
  IditemSelect,
  setmultiSelectReq,
  setfirmaReq,
  setfileReq,
  setmapsReq,
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
) => {
  let validFirma = true;
  let validFile = true;
  let validSingleSelect = true;
  let validTextArea = true;
  let validMultiSelect = true;
  let validMaps = true;

  const nestValFirma = formulario.preguntas.filter(
    pre => pre.tiporespuesta === 'Firma',
  )[0];
  const nestValArchivo = formulario.preguntas.filter(
    pre => pre.tiporespuesta === 'Archivo',
  )[0];
  const nestValSingleSelect = formulario.preguntas.filter(
    pre => pre.tiporespuesta === 'Seleccion Simple',
  )[0];
  const nestValTextArea = formulario.preguntas.filter(
    pre => pre.tiporespuesta === 'Texto',
  )[0];

  const nestValMultiSelect = formulario.preguntas.filter(
    pre => pre.tiporespuesta === 'Seleccion Multiple',
  )[0];

  if (nestValTextArea !== undefined) {
    validTextArea = validaTextArea(text, settextAreaReq);
  }
  if (nestValSingleSelect !== undefined) {
    validSingleSelect = validaCamposSingleSelect(
      selectedItem,
      setsingleSelectReq,
    );
  }

  if (nestValMultiSelect !== undefined) {
    validMultiSelect = validaddMultiple(
      IditemSelect,
      setmultiSelectReq,
      treaID,
      idotd,
      formularioId,
      refformularioconector,
      formularioPreguntas,
      formulario,
      userInfo,
      otid,
    );
  }

  if (nestValFirma !== undefined) {
    validFirma = validaFirma(
      setfirmaReq,
      treaID,
      idotd,
      formularioId,
      refformularioconector,
      formularioPreguntas,
      formulario,
      userInfo,
      otid,
    );
  }

  if (nestValArchivo !== undefined) {
    validFile = validaFiles(
      setfileReq,
      treaID,
      idotd,
      formularioId,
      refformularioconector,
      formularioPreguntas,
      formulario,
      userInfo,
      otid,
    );
  }

  if (
    validSingleSelect &&
    validTextArea &&
    validMultiSelect &&
    validFirma &&
    validFile
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
