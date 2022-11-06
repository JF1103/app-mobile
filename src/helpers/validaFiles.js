import React from 'react';

export const validaFiles = (
  setfileReq,
  treaID,
  idotd,
  formularioId,
  refformularioconector,
  formularioPreguntas,
  formulario,
  userInfo,
  otid,
) => {
  const archivo = formularioPreguntas?.formcomplet
    ?.filter(useario => useario.idUsuario === userInfo.idusuario)[0]
    ?.ots.filter(ot => ot.id_ot === otid)[0]
    ?.tareas.filter(tarea => tarea.TareaId === treaID)[0]
    ?.formularios.filter(form => form.FormularioId === formularioId)[0]
    ?.preguntas.filter(pre => pre.tipo === 'Archivo')[0];

  if (archivo === undefined) {
    setfileReq(true);
    return false;
  } else {
    setfileReq(false);
    return true;
  }
};
