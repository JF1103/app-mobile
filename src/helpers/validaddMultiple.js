import React from 'react';

export const validaddMultiple = (
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
) => {
  const data = formularioPreguntas?.formcomplet
    ?.filter(useario => useario.idUsuario === userInfo.idusuario)[0]
    ?.ots.filter(ot => ot.id_ot === otid)[0]
    ?.tareas.filter(tarea => tarea.TareaId === treaID)[0]
    ?.formularios.filter(form => form.FormularioId === formularioId)[0]
    ?.preguntas.filter(pre => pre.tipo === 'Seleccion Multiple')[0]
    ?.respuesta.filter(resp => resp.isChecked === true)[0];

  if (
    IditemSelect === null ||
    IditemSelect === '' ||
    IditemSelect === undefined ||
    IditemSelect === 0 ||
    IditemSelect.length === 0
  ) {
    if (data === undefined) {
      setmultiSelectReq(true);
      return false;
    } else {
      setmultiSelectReq(false);
      return true;
    }
  } else {
    setmultiSelectReq(false);
    return true;
  }
};
