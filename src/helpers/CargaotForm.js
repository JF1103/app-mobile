import React from 'react';
import {CreaRespuestas} from './CreaRespuestas';

export const CargaOtForm = (
  ot,
  otExists,
  tareaExists,
  formularioExists,
  formAsync,
  respuestas,
  otId,
) => {
  if (otExists) {
    console.log('entre en ot existente', ot.id);
    return {
      id_ot: ot.id,
      fecha: ot.fecha,
      fechafin: ot.fechafin,
      tareas: ot['0'].tareas
        .map(tarea => {
          console.log(
            'tareaaaaa',
            JSON.stringify(respuestas.ot.filter(item => item.id === otId)[0]),
          );
          if (
            respuestas.ot
              .filter(item => item.id === ot.id)[0]
              .tarea.filter(item => item.id === tarea.id).length > 0
          ) {
            console.log('entre en tarea  con respuestas', tarea.id);
            //si la tarea existe
            if (tareaExists) {
              //si la tarea existe
              console.log('entre en tarea  existente', tarea.id);
              return {
                TareaId: tarea.id,
                idotd: tarea.idotd,
                ErrorSend: false,
                formularios: tarea.formularios
                  .map(formulario => {
                    if (
                      respuestas.ot
                        ?.filter(item => item.id === ot.id)[0]
                        ?.tarea.filter(item => item.id === tarea.id)[0]
                        ?.formularios.filter(item => item.id === formulario.id)
                        ?.length > 0
                    ) {
                      console.log('entre en formulario  con respuestas');
                      if (formularioExists) {
                        console.log('entre en formulario  existente');
                        //si el formulario existe
                        return {
                          FormularioId: formulario.id,
                          refformularioconector:
                            formulario.refformularioconector,
                          ended: true,
                          preguntas: formulario.preguntas.map(pregunta => {
                            return CreaRespuestas(pregunta);
                          }),
                        };
                      } else {
                        console.log('entre en formulario  NO existente');
                        return {
                          FormularioId: formulario.id,
                          refformularioconector:
                            formulario.refformularioconector,
                          ended: false,
                          preguntas: formulario.preguntas.map(pregunta => {
                            return CreaRespuestas(pregunta);
                          }),
                        };
                      }
                    }
                  })
                  .filter(item => item !== undefined),
              };
            } else {
              //si la tarea no existe
              console.log('entre en tarea  NO existente', tarea.id);
              return {
                TareaId: tarea.id,
                idotd: tarea.idotd,
                formularios: tarea.formularios.map(formulario => {
                  return {
                    FormularioId: formulario.id,
                    refformularioconector: formulario.refformularioconector,
                    ended: true,
                    preguntas: formulario.preguntas.map(pregunta => {
                      return CreaRespuestas(pregunta);
                    }),
                  };
                }),
              };
            }
          }
        })
        .filter(item => item !== undefined),
    };
  } else {
    console.log('entre en ot  NO existente', ot.id);
    return {
      id_ot: ot.id,
      fecha: ot.fecha,
      fechafin: ot.fechafin,
      tareas: ot['0'].tareas
        .map(tarea => {
          // valido se la tarea tiene respuestas
          if (
            respuestas.ot
              .filter(item => item.id === ot.id)[0]
              .tarea.filter(item => item.id === tarea.id).length > 0
          ) {
            console.log('entre en tarea  con respuestas222', tarea.id);
            return {
              TareaId: tarea.id,
              idotd: tarea.idotd,
              ErrorSend: false,
              formularios: tarea.formularios
                .map(formulario => {
                  if (
                    respuestas.ot
                      ?.filter(item => item.id === ot.id)[0]
                      ?.tarea.filter(item => item.id === tarea.id)[0]
                      ?.formularios.filter(item => item.id === formulario.id)
                      ?.length > 0
                  ) {
                    console.log(
                      'entre en formulario  con respuestas222',
                      formulario.id,
                    );
                    return {
                      //valido si el formulario tiene respuestas

                      FormularioId: formulario.id,
                      refformularioconector: formulario.refformularioconector,
                      ended: true,
                      preguntas: formulario.preguntas.map(pregunta => {
                        return CreaRespuestas(pregunta);
                      }),
                    };
                  }
                })
                .filter(item => item !== undefined),
            };
          }
        })
        .filter(item => item !== undefined),
    };
  }
};
