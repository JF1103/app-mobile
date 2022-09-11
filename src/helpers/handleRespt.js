import React from 'react';
import {SetStorage} from '../components/SetStorage';

export const handleResp = async (
  tareaId,
  formularioId,
  id,
  respuesta,
  tipo,
  formularioPreguntas,
  setFormularioPreguntas,
) => {
  console.log('ITEMS', respuesta, tipo);

  console.log('FORMULARIO PREGUNTAS', JSON.stringify(respuesta));
  const indexTarea = formularioPreguntas.tareas.findIndex(
    tarea => tarea.TareaId === tareaId,
  );
  if (indexTarea === -1) {
    setFormularioPreguntas({
      ...formularioPreguntas,
      tareas: [
        {
          TareaId: tareaId,
          formularios: [
            {
              FormularioId: formularioId,
              preguntas: [{id: id, respuesta: respuesta, tipo: tipo}],
            },
          ],
        },
      ],
    });
  } else {
    const indexFormulario = formularioPreguntas.tareas[
      indexTarea
    ].formularios.findIndex(
      formulario => formulario.FormularioId === formularioId,
    );

    if (indexFormulario === -1) {
      setFormularioPreguntas({
        ...formularioPreguntas,
        tareas: [
          {
            ...formularioPreguntas.tareas[indexTarea],
            formularios: [
              {
                FormularioId: formularioId,
                preguntas: [{id: id, respuesta: respuesta, tipo: tipo}],
              },
            ],
          },
        ],
      });
    } else {
      const indexPregunta = formularioPreguntas.tareas[indexTarea].formularios[
        indexFormulario
      ].preguntas.findIndex(pregunta => pregunta.id === id);

      if (indexPregunta === -1) {
        setFormularioPreguntas({
          ...formularioPreguntas,
          tareas: [
            {
              ...formularioPreguntas.tareas[indexTarea],
              formularios: [
                {
                  ...formularioPreguntas.tareas[indexTarea].formularios[
                    indexFormulario
                  ],
                  preguntas: [
                    ...formularioPreguntas.tareas[indexTarea].formularios[
                      indexFormulario
                    ].preguntas,
                    {id: id, respuesta: respuesta, tipo: tipo},
                  ],
                },
              ],
            },
          ],
        });
      } else {
        setFormularioPreguntas({
          ...formularioPreguntas,
          tareas: [
            {
              ...formularioPreguntas.tareas[indexTarea],
              formularios: [
                {
                  ...formularioPreguntas.tareas[indexTarea].formularios[
                    indexFormulario
                  ],
                  preguntas: [
                    ...formularioPreguntas.tareas[indexTarea].formularios[
                      indexFormulario
                    ].preguntas.slice(0, indexPregunta),
                    {id: id, respuesta: respuesta, tipo: tipo},
                    ...formularioPreguntas.tareas[indexTarea].formularios[
                      indexFormulario
                    ].preguntas.slice(indexPregunta + 1),
                  ],
                },
              ],
            },
          ],
        });
      }
    }
  }

  /*  } else {
      //modifico pregunta
      setFormularioPreguntas({
        ...formularioPreguntas,
        tareas: [
          {
            ...formularioPreguntas.tareas[indexTarea],
            preguntas: [
              ...formularioPreguntas.tareas[indexTarea].preguntas.slice(
                0,
                indexPregunta,
              ),
              {
                ...formularioPreguntas.tareas[indexTarea].preguntas[
                  indexPregunta
                ],
                respuesta: respuesta,
              },
              ...formularioPreguntas.tareas[indexTarea].preguntas.slice(
                indexPregunta + 1,
              ),
            ],
          },
        ],
      });
    }
  } */
  /* SetStorage(formularioPreguntas); */
};
