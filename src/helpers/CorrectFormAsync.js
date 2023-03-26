import React from 'react';
import {GetStorage} from '../components/GetStorage';
import {SetStorage} from '../components/SetStorage';

export const CorrectFormAsync = async idUsuario => {
  const asyncForm = await GetStorage();
  /*  console.log('entre a corregirrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
  console.log('corregir', JSON.stringify(asyncForm)); */
  if (asyncForm !== null) {
    const data = asyncForm?.formcomplet
      .filter(item => idUsuario == item.idUsuario)[0]
      ?.ots.map(ot => {
        ot.tareas.map(tarea => {
          tarea.ErrorSend =
            tarea.formularios.filter(
              formulario =>
                formulario.preguntas.filter(
                  pregunta => pregunta?.checkSend === false,
                ).length > 0,
            ).length > 0
              ? true
              : false;
          /* console.log(
            'ot',
            ot.id_ot,
            'tarea',
            tarea.TareaId,
            'RESULTADO',
            tarea.formularios.filter(
              formulario =>
                formulario.preguntas.filter(
                  pregunta => pregunta.checkSend === false,
                ).length > 0,
            ).length > 0
              ? true
              : false,
          ); */
        });
      });

    const data2 = asyncForm?.formcomplet
      .filter(item => idUsuario == item.idUsuario)[0]
      ?.ots.map(async ot => {
        ot.tareas.map(async tarea => {
          tarea.formularios.map(
            formulario =>
              (formulario.ended =
                formulario.preguntas.filter(
                  pregunta => pregunta?.checkSend === false,
                ).length > 0
                  ? false
                  : true),
          );
        });
      });

    /* console.log('FINALLLLLL', JSON.stringify(asyncForm)); */
    SetStorage({...asyncForm});
  }
};
