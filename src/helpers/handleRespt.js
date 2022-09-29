import React from 'react';
import {SetStorage} from '../components/SetStorage';
import {useLocation} from '../hooks/useLocation';

export const handleResp = async (
  tareaId,
  idotd,
  formularioId,
  refformularioconector,
  id,
  respuesta,
  tipo,
  formularioPreguntas,
  setFormularioPreguntas,
  employee,
  idUsuario,
  preguntaCords,
) => {
  const initialFormState = [
    {
      id_ot: employee.id,
      fecha: employee.fecha,
      fechafin: employee.fechafin,
      tareas: [
        {
          TareaId: tareaId,
          idotd: idotd,
          formularios: [
            {
              FormularioId: formularioId,
              refformularioconector: refformularioconector,
              ended: false,
              preguntas: [
                {
                  id: id,
                  respuesta: respuesta,
                  tipo: tipo,
                  latitud: preguntaCords.latitude,
                  longitud: preguntaCords.longitude,
                  checkSend: false,
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  console.log('entre handleResp');
  console.log('respuesta', respuesta);
  console.log('usuario', +idUsuario);
  //no esxiste el formulario
  if (!formularioPreguntas) {
    console.log('no existe el formulario');

    const otsIdUsuario = [
      {
        idUsuario: idUsuario,
        ots: initialFormState,
      },
    ];

    setFormularioPreguntas({formcomplet: otsIdUsuario});
  } else {
    console.log('existe el formulario');
    const indexUsuario = formularioPreguntas.formcomplet.findIndex(
      usuario => usuario.idUsuario === idUsuario,
    );

    //formulario tiene datos pero no del usuario
    if (indexUsuario === -1) {
      console.log('formulario tiene datos pero no del usuario');
      const otsIdUsuario = [
        {
          idUsuario: idUsuario,
          ots: initialFormState,
        },
      ];
      formularioPreguntas.formcomplet.push(otsIdUsuario);
      setFormularioPreguntas({...formularioPreguntas});
    } else {
      console.log('formulario tiene datos del usuario');
      //formulrio tienen daatos del usurio
      const indexOt = formularioPreguntas.formcomplet[
        indexUsuario
      ].ots.findIndex(ot => ot.id_ot === employee.id);

      if (indexOt === -1) {
        console.log('formulario tiene datos del usuario pero no de la ot');
        formularioPreguntas.formcomplet[indexUsuario].ots.push(
          ...initialFormState,
        ),
          setFormularioPreguntas({...formularioPreguntas});
      } else {
        console.log('formulario tiene datos del usuario y de la ot');
        const indexTarea = formularioPreguntas.formcomplet[indexUsuario].ots[
          indexOt
        ].tareas.findIndex(tarea => tarea.TareaId === tareaId);

        if (indexTarea === -1) {
          console.log(
            'formulario tiene datos del usuario y de la ot pero no de la tarea',
          );
          formularioPreguntas.formcomplet[indexUsuario].ots[
            indexOt
          ].tareas.push({
            TareaId: tareaId,
            idotd: idotd,
            formularios: [
              {
                FormularioId: formularioId,
                refformularioconector: refformularioconector,
                ended: false,

                preguntas: [
                  {
                    id: id,
                    respuesta: respuesta,
                    tipo: tipo,
                    latitud: preguntaCords.latitude,
                    longitud: preguntaCords.longitude,
                    checkSend: false,
                  },
                ],
              },
            ],
          }),
            setFormularioPreguntas({...formularioPreguntas});
        } else {
          console.log(
            'formulario tiene datos del usuario y de la ot y de la tarea',
          );
          const indexFormulario = formularioPreguntas.formcomplet[
            indexUsuario
          ].ots[indexOt].tareas[indexTarea].formularios.findIndex(
            formulario => formulario.FormularioId === formularioId,
          );

          if (indexFormulario === -1) {
            console.log(
              'formulario tiene datos del usuario y de la ot y de la tarea pero no del formulario',
            );
            formularioPreguntas.formcomplet[indexUsuario].ots[indexOt].tareas[
              indexTarea
            ].formularios.push({
              FormularioId: formularioId,
              refformularioconector: refformularioconector,
              ended: false,
              preguntas: [
                {
                  id: id,
                  respuesta: respuesta,
                  tipo: tipo,
                  latitud: preguntaCords.latitude,
                  longitud: preguntaCords.longitude,
                  checkSend: false,
                },
              ],
            }),
              setFormularioPreguntas({...formularioPreguntas});
          } else {
            console.log(
              'formulario tiene datos del usuario y de la ot y de la tarea y del formulario',
            );
            const indexPregunta = formularioPreguntas.formcomplet[
              indexUsuario
            ].ots[indexOt].tareas[indexTarea].formularios[
              indexFormulario
            ].preguntas.findIndex(pregunta => pregunta.id === id);

            if (indexPregunta === -1) {
              console.log(
                'formulario tiene datos del usuario y de la ot y de la tarea y del formulario pero no de la pregunta',
              );
              console.log('no existe la pregunta');
              formularioPreguntas.formcomplet[indexUsuario].ots[indexOt].tareas[
                indexTarea
              ].formularios[indexFormulario].preguntas.push({
                id: id,
                respuesta: respuesta,
                tipo: tipo,
                latitud: preguntaCords.latitude,
                longitud: preguntaCords.longitude,
                checkSend: false,
              }),
                setFormularioPreguntas({
                  ...formularioPreguntas,
                });
            } else {
              console.log(
                'formulario tiene datos del usuario y de la ot y de la tarea y del formulario y de la pregunta',
              );

              const objcopy = formularioPreguntas;
              objcopy.formcomplet[indexUsuario].ots[indexOt].tareas[
                indexTarea
              ].formularios[indexFormulario].preguntas[
                indexPregunta
              ].respuesta = respuesta;
              objcopy.formcomplet[indexUsuario].ots[indexOt].tareas[
                indexTarea
              ].formularios[indexFormulario].preguntas[indexPregunta].latitud =
                preguntaCords.latitude;
              objcopy.formcomplet[indexUsuario].ots[indexOt].tareas[
                indexTarea
              ].formularios[indexFormulario].preguntas[indexPregunta].longitud =
                preguntaCords.longitude;

              setFormularioPreguntas({...objcopy});
            }
          }
        }
      }
    }
  }

  /* 
  const indexTarea = formularioPreguntas.tareas.findIndex(
    tarea => tarea.TareaId == tareaId,
  );
  console.log('entre en tareas con datos', JSON.stringify(formularioPreguntas));
  console.log('indexTarea', indexTarea, tareaId);
  if (indexTarea === -1) {
    if (formularioPreguntas.tareas.length === 0) {
      console.log('entre en tareas vacia');
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
      console.log('entre en tareas con datos');
      //si no estan vacias agrego la tarea
      setFormularioPreguntas({
        ...formularioPreguntas,
        tareas: formularioPreguntas.tareas.concat({
          TareaId: tareaId,
          formularios: [
            {
              FormularioId: formularioId,
              preguntas: [{id: id, respuesta: respuesta, tipo: tipo}],
            },
          ],
        }),
      });
    }
  } else {
    const indexFormulario = formularioPreguntas.tareas[
      indexTarea
    ].formularios.findIndex(
      formulario => formulario.FormularioId === formularioId,
    );

    console.log('trea existe', indexFormulario, formularioId);

    if (indexFormulario === -1) {
      //valio si el formulario existe
      //existe la tarea, no el formulario
      if ((formularioPreguntas.tareas[indexTarea].formularios.length = 0)) {
        //el formulario esta vacio
        console.log('formulario no existe ');
        console.log('formulario vacio');

        setFormularioPreguntas({
          ...formularioPreguntas,
          tareas: [
            ...formularioPreguntas.tareas.slice(0, indexTarea),
            {
              ...formularioPreguntas.tareas[indexTarea],
              formularios: formularioPreguntas.tareas[
                indexTarea
              ].formularios.concat({
                FormularioId: formularioId,
                preguntas: [{id: id, respuesta: respuesta, tipo: tipo}],
              }),
            },
            ...formularioPreguntas.tareas.slice(indexTarea + 1),
            //sumo el resto de las tareas
          ],
        });
      } else {
        //existe la tarea, no el formulario y el formularios tiene otros formularios
        console.log('formulario no existe');
        console.log('formulario con datos');
        //mantengo el fomulario y agrego el nuevo formulario
        setFormularioPreguntas({
          ...formularioPreguntas,
          tareas: [
            ...formularioPreguntas.tareas.slice(0, indexTarea),
            {
              ...formularioPreguntas.tareas[indexTarea],
              formularios: formularioPreguntas.tareas[
                indexTarea
              ].formularios.concat({
                FormularioId: formularioId,
                preguntas: [{id: id, respuesta: respuesta, tipo: tipo}],
              }),
            },
            ...formularioPreguntas.tareas.slice(indexTarea + 1),
          ],
        });
      }
    } else {
      const indexPregunta = formularioPreguntas.tareas[indexTarea].formularios[
        indexFormulario
      ].preguntas.findIndex(pregunta => pregunta.id === id);

      if (indexPregunta === -1) {
        setFormularioPreguntas({
          ...formularioPreguntas,
          tareas: [
            ...formularioPreguntas.tareas.slice(0, indexTarea),
            {
              ...formularioPreguntas.tareas[indexTarea],
              formularios: [
                ...formularioPreguntas.tareas[indexTarea].formularios.slice(
                  0,
                  indexFormulario,
                ),
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
                ...formularioPreguntas.tareas[indexTarea].formularios.slice(
                  indexFormulario + 1,
                ),
              ],
            },
            ...formularioPreguntas.tareas.slice(indexTarea + 1),
          ],
        });
      } else {
        //edito pregunta encontrada
        console.log('edito pregunta encontrada');
        setFormularioPreguntas({
          ...formularioPreguntas,
          tareas: [
            ...formularioPreguntas.tareas.slice(0, indexTarea),
            {
              ...formularioPreguntas.tareas[indexTarea],
              formularios: [
                ...formularioPreguntas.tareas[indexTarea].formularios.slice(
                  0,
                  indexFormulario,
                ),
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
                ...formularioPreguntas.tareas[indexTarea].formularios.slice(
                  indexFormulario + 1,
                ),
              ],
            },
            ...formularioPreguntas.tareas.slice(indexTarea + 1),
          ],
        });
      }
    }
  } */
};
