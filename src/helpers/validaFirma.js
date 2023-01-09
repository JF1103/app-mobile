import React from 'react';

export const validaFirma = (
  setfirmaReq,
  treaID,
  idotd,
  formularioId,
  refformularioconector,
  formularioPreguntas,
  formulario,
  userInfo,
  otid,
) => {
  const firma = formularioPreguntas?.formcomplet
    ?.filter(useario => useario.idUsuario === userInfo.idusuario)[0]
    ?.ots.filter(ot => ot.id_ot === otid)[0]
    ?.tareas.filter(tarea => tarea.TareaId === treaID)[0]
    ?.formularios.filter(form => form.FormularioId === formularioId)[0]
    ?.preguntas.filter(pre => pre.tipo === 'Firma')[0];

  if (firma === undefined) {
    setfirmaReq(true);
    return false;
  } else {
    setfirmaReq(false);
    return true;
  }
};
