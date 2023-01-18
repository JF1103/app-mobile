import {useState} from 'react';

export const CargaDatosForm = (
  data,
  formAsync,
  setformAsync,
  setFormularioPreguntas,
  idusuario,
) => {
  //  console.log('data', JSON.stringify(data));
  console.log('formAsync2', JSON.stringify(formAsync));
  if (formAsync === null) {
    console.log('entre');
    //si no hay datos en el estorage
    setformAsync({
      formcomplet: [
        {
          idUsuario: idusuario,
          ots: data.ot.map(ot => {
            return {
              id_ot: ot.id,
              fecha: ot.fecha,
              fechafin: ot.fechafin,
              tareas: ot['0'].tareas.map(tarea => {
                //TODO: Cambiar el nombre  del estado
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
                          return {
                            id: pregunta.id,
                            respuesta: pregunta.respuestaCargada,
                            tipo: pregunta.tiporespuesta,
                            latitud: 0.0,
                            longitud: 0.0,
                            checkSend: true,
                          };
                        }),
                      };
                    }),
                  };
                }
              }),
            };
          }),
        },
      ],
    });
  } /* else {
    //si hay datos en el estorage
    setformAsync({
      formcomplet: [
        {
          idUsuario: idusuario,
          ots: data.ot.map(ot => {
            return {
              id_ot: ot.id,
              fecha: ot.fecha,
              fechafin: ot.fechafin,
              tareas: ot['0'].tareas.map(tarea => {
                if (tarea.estado === 'Finzalizada') {
                  return {
                    TareaId: tarea.id,
                    idotd: tarea.idotd,
                    formularios: tarea.formularios.map(formulario => {
                      return {
                        FormularioId: formulario.id,
                        refformularioconector: formulario.refformularioconector,
                        ended: true,
                        preguntas: formulario.preguntas.map(pregunta => {
                          return {
                            id: pregunta.id,
                            respuesta: pregunta.respuestaCargada,
                            tipo: pregunta.tiporespuesta,
                            latitud: 0.0,
                            longitud: 0.0,
                            checkSend: true,
                          };
                        }),
                      };
                    }),
                  };
                }
              }),
            };
          }),
        },
      ],
    });
  } */
};
