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
  /*  console.log('entro handleeeee respppppppppppppt' + JSON.stringify(respuesta)); */
  const initialFormState = [
    {
      id_ot: employee.id,
      fecha: employee.fecha,
      fechafin: employee.fechafin,
      tareas: [
        {
          TareaId: tareaId,
          idotd: idotd,
          ErrorSend: false,
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
                  checkSend: '',
                },
              ],
            },
          ],
        },
      ],
    },
  ];
  /*  console.log(
    'formularioPreguntassssssssssssssssss',
    JSON.stringify(formularioPreguntas),
  ); */
  /* console.log('entre handleResp');
  console.log('respuesta', respuesta);
  console.log('usuario', +idUsuario); */
  //no esxiste el formulario
  if (!formularioPreguntas) {
    /*  console.log('no existe el formulario'); */

    const otsIdUsuario = [
      {
        idUsuario: idUsuario,
        ots: initialFormState,
      },
    ];

    setFormularioPreguntas({formcomplet: otsIdUsuario});
  } else {
    /* console.log('existe el formulario'); */
    const indexUsuario = formularioPreguntas.formcomplet.findIndex(
      usuario => usuario.idUsuario === idUsuario,
    );

    //formulario tiene datos pero no del usuario
    if (indexUsuario === -1) {
      /*  console.log('formulario tiene datos pero no del usuario'); */
      const otsIdUsuario = [
        {
          idUsuario: idUsuario,
          ots: initialFormState,
        },
      ];
      formularioPreguntas.formcomplet.push(otsIdUsuario);
      setFormularioPreguntas({...formularioPreguntas});
    } else {
      /* console.log('formulario tiene datos del usuario'); */
      //formulrio tienen daatos del usurio
      const indexOt = formularioPreguntas?.formcomplet[
        indexUsuario
      ]?.ots?.findIndex(ot => ot.id_ot === employee.id);

      if (indexOt === -1) {
        /*  console.log('formulario tiene datos del usuario pero no de la ot'); */
        formularioPreguntas.formcomplet[indexUsuario].ots.push(
          ...initialFormState,
        ),
          setFormularioPreguntas({...formularioPreguntas});
      } else {
        /* console.log('formulario tiene datos del usuario y de la ot'); */
        const indexTarea = formularioPreguntas.formcomplet[indexUsuario].ots[
          indexOt
        ].tareas.findIndex(tarea => tarea.TareaId === tareaId);

        if (indexTarea === -1) {
          /*  console.log(
            'formulario tiene datos del usuario y de la ot pero no de la tarea',
          ); */
          formularioPreguntas.formcomplet[indexUsuario].ots[
            indexOt
          ].tareas.push({
            TareaId: tareaId,
            idotd: idotd,
            ErrorSend: false,
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
                    checkSend: '',
                  },
                ],
              },
            ],
          }),
            setFormularioPreguntas({...formularioPreguntas});
        } else {
          /* console.log(
            'formulario tiene datos del usuario y de la ot y de la tarea',
          ); */
          const indexFormulario = formularioPreguntas.formcomplet[
            indexUsuario
          ].ots[indexOt].tareas[indexTarea].formularios.findIndex(
            formulario => formulario.FormularioId === formularioId,
          );

          if (indexFormulario === -1) {
            /*   console.log(
              'formulario tiene datos del usuario y de la ot y de la tarea pero no del formulario',
            ); */
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
                  checkSend: '',
                },
              ],
            }),
              setFormularioPreguntas({...formularioPreguntas});
          } else {
            /* console.log(
              'formulario tiene datos del usuario y de la ot y de la tarea y del formulario',
            ); */
            const indexPregunta = formularioPreguntas.formcomplet[
              indexUsuario
            ].ots[indexOt].tareas[indexTarea].formularios[
              indexFormulario
            ].preguntas.findIndex(pregunta => pregunta.id === id);

            if (indexPregunta === -1) {
              /*   console.log(
                'formulario tiene datos del usuario y de la ot y de la tarea y del formulario pero no de la pregunta',
              ); */
              /* console.log('no existe la pregunta'); */
              formularioPreguntas.formcomplet[indexUsuario].ots[indexOt].tareas[
                indexTarea
              ].formularios[indexFormulario].preguntas.push({
                id: id,
                respuesta: respuesta,
                tipo: tipo,
                latitud: preguntaCords.latitude,
                longitud: preguntaCords.longitude,
                checkSend: '',
              }),
                setFormularioPreguntas({
                  ...formularioPreguntas,
                });
            } else {
              /*  console.log(
                'formulario tiene datos del usuario y de la ot y de la tarea y del formulario y de la pregunta',
              ); */

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
};
