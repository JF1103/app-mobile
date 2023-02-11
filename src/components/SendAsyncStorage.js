import React, {useContext} from 'react';
import {FormContext} from '../context/FormContext';
import {GetStorage} from './GetStorage';
import {SetStorage} from './SetStorage';
import getFileBase64 from '../helpers/getFileBase64';
import axios from 'axios';
import {BASE_URL} from '../config';

export const SendAsyncStorage = async (idUsuario, formAsync, setformAsync) => {
  const asyncForm = await GetStorage();

  console.log('entre SendAsyncStorage ', JSON.stringify(asyncForm));

  const indexIdUsuario = asyncForm?.formcomplet
    .map(item => item.idUsuario)
    .indexOf(idUsuario);

  if (asyncForm !== null) {
    console.log('entre en el if de asyncForm !== null');
    const data = asyncForm?.formcomplet
      .filter(item => idUsuario == item.idUsuario)[0]
      ?.ots.map(async ot => {
        const indexIdOt = asyncForm.formcomplet[indexIdUsuario].ots
          .map(item => item.id_ot)
          .indexOf(ot.id_ot);
        ot.tareas.map(tarea => {
          const indexIdTarea = asyncForm?.formcomplet[indexIdUsuario].ots[
            indexIdOt
          ].tareas
            .map(item => item.TareaId)
            .indexOf(tarea.TareaId);

          console.log('ivexxxxxx tarea', indexIdTarea);
          if (tarea.ErrorSend) {
            console.log('entre en el if de tarea.ErrorSend');
            // envio la tarea
            tarea.formularios.map(async formulario => {
              /* console.log(
                'eerrrrrrrroosss',
                asyncForm.formcomplet[indexIdUsuario].ots[indexIdOt].tareas[
                  indexIdTarea
                ],
                indexIdTarea,
              ); */
              const indexIdFormulario = asyncForm?.formcomplet[
                indexIdUsuario
              ].ots[indexIdOt].tareas[indexIdTarea].formularios
                .map(item => item.FormularioId)
                .indexOf(formulario.FormularioId);

              // envio el formulario
              console.log('entre en el map de pregunta');
              // envio el formulario
              formulario.preguntas.map(async pregunta => {
                // envio la pregunta
                let data = {};
                if (pregunta.checkSend === false) {
                  console.log('entre en el if de pregunta.checkSend === false');
                  // envio la respuesta
                  console.log('respuesta', pregunta);

                  if (
                    pregunta.tipo === 'Firma' ||
                    pregunta.tipo === 'Archivo'
                  ) {
                    const archivo = await getFileBase64(
                      pregunta.respuesta.base64,
                    );

                    data = {
                      usuario: idUsuario,
                      refformulariosconector: formulario.refformularioconector,
                      reftabla: '4',
                      idreferencia: tarea.idotd,
                      refpreguntascuestionario: pregunta.id,
                      respuesta: pregunta.respuesta.base64,
                      refrespuestascuestionario: 0,
                      archivo: archivo,
                      tipo: pregunta.respuesta.fileType,
                      carpeta: '',
                      latitud: pregunta.latitud,
                      longitud: pregunta.longitud,
                    };
                  } else {
                    data = {
                      usuario: idUsuario,
                      refformulariosconector: formulario.refformularioconector,
                      reftabla: '4',
                      idreferencia: tarea.idotd,
                      refpreguntascuestionario: pregunta.id,
                      respuesta:
                        pregunta.tipo === 'Seleccion Simple'
                          ? pregunta.respuesta.value
                          : pregunta.tipo === 'Seleccion Multiple'
                          ? pregunta.respuesta.map(item => item.id).join('/**/')
                          : pregunta.tipo === 'Geolocalizacion'
                          ? pregunta.respuesta.latitude +
                            ',' +
                            pregunta.respuesta.longitude
                          : pregunta.tipo === 'Materiales'
                          ? pregunta.respuesta.map(item => {
                              return {
                                id_pregunta: pregunta.id,
                                id_respuesta: item.id,
                                cantida: item.value,
                              };
                            })
                          : pregunta.respuesta,
                      latitud: pregunta.respuesta.latitud,
                      longitud: pregunta.respuesta.longitud,
                      refrespuestascuestionario:
                        pregunta.tipo === 'Seleccion Simple'
                          ? pregunta.respuesta.id
                          : 0,
                      latitud: pregunta.latitud,
                      longitud: pregunta.longitud,
                    };
                  }
                  const formData = new FormData();
                  formData.append('usuario', data.usuario);
                  formData.append(
                    'refformulariosconector',
                    data.refformulariosconector,
                  );
                  formData.append('reftabla', data.reftabla);
                  formData.append('idreferencia', data.idreferencia);
                  formData.append(
                    'refpreguntascuestionario',
                    data.refpreguntascuestionario,
                  );
                  formData.append(
                    'refrespuestascuestionario',
                    data.refrespuestascuestionario,
                  );
                  formData.append('respuesta', data.respuesta);
                  formData.append('latitud', data.latitud);
                  formData.append('longitud', data.longitud);
                  formData.append('archivo', data.archivo);
                  formData.append('tipo', data.tipo);
                  formData.append('carpeta', data.carpeta);

                  axios
                    .post(
                      `${BASE_URL}/formulariosdetalles/insertbyone.php`,
                      formData,
                      {
                        headers: {
                          'Content-Type': 'multipart/form-data',
                        },
                      },
                    )
                    .then(response => {
                      console.log('entre en  el then de la respuesta');
                      console.log('response', response);

                      const indexPregunta = asyncForm?.formcomplet[
                        indexIdUsuario
                      ].ots[indexIdOt].tareas[indexIdTarea].formularios[
                        indexIdFormulario
                      ].preguntas
                        .map(item => item.id)
                        .indexOf(pregunta.id);
                      console.log('indexPregunta', indexPregunta);
                      let newFormularioPreguntas = asyncForm;
                      newFormularioPreguntas.formcomplet[indexIdUsuario].ots[
                        indexIdOt
                      ].tareas[indexIdTarea].formularios[
                        indexIdFormulario
                      ].preguntas[indexPregunta].checkSend = true;
                      // console.log(
                      //  'newFormularioPreguntas',
                      //  JSON.stringify(newFormularioPreguntas),
                      // );
                      SetStorage({...newFormularioPreguntas});
                      /* setformAsync(newFormularioPreguntas); */

                      console.log(
                        'cambieeeeeeeeeeeeeeee'.newFormularioPreguntas,
                      );
                    })
                    .catch(error => {
                      console.log('error22222', error);
                      /*console.log('error', JSON.stringify(error));
                      console.log('error', JSON.stringify(error.response));
                      console.log('error', JSON.stringify(error.response.data));

                      const indexPregunta = asyncForm.formcomplet[
                        indexIdUsuario
                      ].ots[indexIdOt].tareas[indexIdTarea].formularios[
                        indexIdFormulario
                      ].preguntas
                        .map(item => item.id)
                        .indexOf(item.id);

                      let newFormularioPreguntas = asyncForm;
                      newFormularioPreguntas.formcomplet[indexIdUsuario].ots[
                        indexIdOt
                      ].tareas[indexIdTarea].formularios[
                        indexIdFormulario
                      ].preguntas[indexPregunta].checkSend = false;

                      newFormularioPreguntas.formcomplet[indexIdUsuario].ots[
                        indexIdOt
                      ].tareas[indexIdTarea].ErrorSend = true;

                      console.log(
                        'newFormularioPreguntas',
                        JSON.stringify(newFormularioPreguntas),
                      );
                      SetStorage({...newFormularioPreguntas}); */
                    })
                    .finally(() => {
                      console.log('finally sali2');

                      /*   const indexPregunta = formularioPreguntas.formcomplet[
                            indexIdUsuario
                          ].ots[indexIdOt].tareas[indexIdTarea].formularios[
                            indexIdFormulario
                          ].preguntas
                            .map(item => item.id)
                            .indexOf(item.id); */
                      //valido si el formulario se envio completo para mostrar el toast de enviado
                      /*   let formularioCompleto =
                            formularioPreguntas.formcomplet[indexIdUsuario].ots[
                              indexIdOt
                            ].tareas[indexIdTarea].formularios[
                              indexIdFormulario
                            ].preguntas[indexPregunta].checkSend;

                          if (firstFlag) {
                            if (formularioCompleto) {
                              ToastAndroid.show(
                                'Formulario enviado',
                                ToastAndroid.SHORT,
                              );
                              firstFlag = false;
                            } else {
                              ToastAndroid.show(
                                'Formulario  no fue enviado, porfavor intente mas tarde',
                                ToastAndroid.SHORT,
                              );
                              firstFlag = false;
                            }
                          } */
                    });
                }
              });
            });
          }
        });
      });
  }
};
