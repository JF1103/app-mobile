import React from 'react';

export const validaFiles = (
  nestValArchivo,
  formularioPreguntas,
  treaID,
  formularioId,
  userInfo,
  otid,
  arrayReq,
  setArrayReq,
  arrayrequeridos,
) => {
  const aarayresp = nestValArchivo.filter((item, index) => {
    /*   console.log('entre en files'); */
    let respuesta = formularioPreguntas?.formcomplet
      ?.filter(useario => useario.idUsuario === userInfo.idusuario)[0]
      ?.ots.filter(ot => ot.id_ot === otid)[0]
      ?.tareas.filter(tarea => tarea.TareaId === treaID)[0]
      ?.formularios.filter(form => form.FormularioId === formularioId)[0]
      ?.preguntas.filter(pre => pre.id === item.id)[0]?.respuesta;

    if (respuesta === null || respuesta === '' || respuesta === undefined) {
      let existe = arrayrequeridos.filter(req => req.id === item.id);

      if (existe.length === 0) {
        arrayrequeridos.push({id: item.id});
      }

      return item;
    } else {
    }
  });
  return aarayresp;
};
