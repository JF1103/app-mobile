import React from 'react';
import {CreaRespuestas} from './CreaRespuestas';

export const CargaOtForm = (
  ot,
  otExists,
  tareaExists,
  formularioExists,
  formAsync,
) => {
  if (otExists) {
    return {
      id_ot: ot.id,
      fecha: ot.fecha,
      fechafin: ot.fechafin,
      tareas: ot['0'].tareas.map(tarea => {
        if (tarea.estado === 'Creado') {
          //si la tarea existe
          if (tareaExists) {
            //si la tarea existe
            return {
              TareaId: tarea.id,
              idotd: tarea.idotd,
              formularios: tarea.formularios.map(formulario => {
                if (formularioExists) {
                  //si el formulario existe
                  return {
                    FormularioId: formulario.id,
                    refformularioconector: formulario.refformularioconector,
                    ended: true,
                    preguntas: formulario.preguntas.map(pregunta => {
                      return CreaRespuestas(pregunta);
                    }),
                  };
                } else {
                  return {
                    FormularioId: formulario.id,
                    refformularioconector: formulario.refformularioconector,
                    ended: false,
                    preguntas: formulario.preguntas.map(pregunta => {
                      return CreaRespuestas(pregunta);
                    }),
                  };
                }
              }),
            };
          } else {
            //si la tarea no existe
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
      }),
    };
  } else {
    return {
      id_ot: ot.id,
      fecha: ot.fecha,
      fechafin: ot.fechafin,
      tareas: ot['0'].tareas.map(tarea => {
        if (tarea.estado === 'Creado') {
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
      }),
    };
  }
};
