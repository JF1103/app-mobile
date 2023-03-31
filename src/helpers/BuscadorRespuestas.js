import React from 'react';

/* 
{
   "ot":[
      {
         "id":32,
         "tarea":[
            {
               "id":10,
               "formularios":[
                  {
                     "id":9
                  }
               ]
            },
            {
               "id":11,
               "formularios":[
                  {
                     "id":11
                  }
               ]
            }
         ]
      }
   ]
}
*/
export const BuscadorRespuestas = data => {
  return (respuestas = {
    ot: data.ot
      .map(ot => {
        return {
          id: ot.id,
          tarea: ot['0'].tareas
            .map(tarea => {
              return {
                id: tarea.id,
                formularios: tarea.formularios
                  .map(formulario => {
                    //valido si alguna pregunta del formulario tiene respuesta
                    //si tiene respuesta, devuelvo el id del formulario
                    //si no tiene respuesta, devuelvo null
                    const respuesta = formulario.preguntas.find(pregunta => {
                      return !(
                        pregunta.respuestaCargada === '' ||
                        (pregunta.tiporespuesta === 'Materiales' &&
                          pregunta.respuestaCargada?.length === 0)
                      );
                    });
                    console.log(
                      'respuestaaaaaa',
                      respuesta,
                      'formulariooooooooooo',
                      formulario.id,
                    );
                    if (respuesta) {
                      return {id: formulario.id};
                    } else {
                      return null;
                    }
                  })
                  .filter(formulario => {
                    return formulario !== null;
                  }),
              };
            })
            .filter(tarea => {
              return tarea.formularios.length > 0;
            }),
        };
      })
      .filter(ot => {
        return ot.tarea.length > 0;
      }),
  });
};
