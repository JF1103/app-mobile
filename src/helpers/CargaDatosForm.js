import {useState} from 'react';
import {CreaRespuestas} from './CreaRespuestas';
import {CargaOtForm} from './CargaotForm';
import {BuscadorRespuestas} from './BuscadorRespuestas';
import {SetStorage} from '../components/SetStorage';

/* data: datos del servidor */
/* form datos del storage */
/* formAsync estado del storage */

export const CargaDatosForm = (
  data,
  form,
  formAsync,
  setformAsync,
  setFormularioPreguntas,
  idusuario,
) => {
  const respuestas = BuscadorRespuestas(data);

  if (form === null && respuestas.ot.length > 0) {
    //si no hay datos en el estorage
    let respuestasFinal = {
      formcomplet: [
        {
          idUsuario: idusuario,
          ots: data.ot
            .map(ot => {
              if (respuestas.ot.filter(item => item.id === ot.id).length > 0) {
                console.log('entre en ot datos forrrrmmm');
                return CargaOtForm(
                  ot,
                  false,
                  false,
                  false,
                  form,
                  respuestas,
                  ot.id,
                );
              }
            })
            .filter(item => item !== undefined),
        },
      ],
    };
    setformAsync(respuestasFinal);
    SetStorage(respuestasFinal); //guardo en el estorage
  } else {
    //si hay datos en el estorage
    //verifico si ya existe el idUsuario
    let User = form.formcomplet.filter(item => item.idUsuario === idusuario);
    if (User.length > 0) {
      //si eexiste el usuario
      //verifico si existe la ot
      console.log('entre en  el mismo user');
      data.ot
        .map(ot => {
          if (respuestas.ot.filter(item => item.id === ot.id).length > 0) {
            /* if (respuestas.ot.filter(item => item.id === ot.id).length > 0) { */
            let Ot = form.formcomplet
              .filter(item => item.idUsuario === idusuario)[0]
              .ots.filter(item => item.id_ot === ot.id);
            if (Ot.length > 0) {
              console.log('exite una ot con respuestas en el asinc');
              //si existe la ot
              //verifico si existe la tarea
              //valido si la ot tiene respuestas
              if (respuestas.ot.filter(item => item.id === ot.id).length > 0) {
                console.log('hay respuestas en la ot', ot.id);
                let tarea = ot['0'].tareas.map(tarea => {
                  let tareaExist = form.formcomplet
                    .filter(item => item.idUsuario === idusuario)[0]
                    .ots.filter(item => item.id_ot === ot.id)[0]
                    .tareas.filter(item => item.TareaId === tarea.id);
                  if (tareaExist.length > 0) {
                    //valido si la tarea tiene respuestas
                    console.log('existe la tarea en el asinc');
                    if (
                      respuestas.ot
                        .filter(item => item.id === ot.id)[0]
                        .tarea.filter(tarea => tarea.id === tarea.id).length > 0
                    ) {
                      //si existe la tarea
                      //verifico si existe el formulario
                      console.log('existe la tarea numero', tarea.id);
                      let formulario = tarea.formularios.map(formulario => {
                        let FormularioExist = form.formcomplet
                          .filter(item => item.idUsuario === idusuario)[0]
                          .ots.filter(item => item.id_ot === ot.id)[0]
                          .tareas.filter(item => item.TareaId === tarea.id)[0]
                          .formularios.filter(
                            item => item.id === formulario.id,
                          );

                        if (FormularioExist.length > 0) {
                          //valido si el formulario tiene respuestas
                          console.log('existe el formulario en el asinc');
                          console.log(
                            'errors',
                            JSON.stringify(
                              respuestas.ot
                                .filter(item => item.id === ot.id)[0]
                                .tarea.filter(
                                  tarea => tarea.id === tarea.id,
                                )[0],
                            ),
                          );
                          if (
                            respuestas.ot
                              .filter(item => item.id === ot.id)[0]
                              .tarea.filter(tarea => tarea.id === tarea.id)[0]
                              .formularios.filter(
                                formulario => formulario.id === formulario.id,
                              ).length > 0
                          ) {
                            //si existe el formulario
                            // li piso
                            console.log(
                              'existe el formulario numero',
                              formulario.id,
                            );
                            console.log('seteo el async');
                            setformAsync({
                              formcomplet: [
                                {
                                  idUsuario: idusuario,
                                  ots: data.ot
                                    .map(ot1 => {
                                      if (
                                        respuestas.ot.filter(
                                          item => item.id === ot1.id,
                                        ).length > 0
                                      ) {
                                        return CargaOtForm(
                                          ot1,
                                          true,
                                          true,
                                          true,
                                          form,
                                          respuestas,
                                          ot.id,
                                        );
                                      }
                                    })
                                    .filter(item => item !== undefined),
                                },
                              ],
                            });
                          }
                        } else {
                          //si no existe el formulario
                          //lo sumo al existente
                          console.log('no existe el formulario en el asinc');
                          console.log(
                            'ERRORS4',
                            JSON.stringify(
                              respuestas.ot
                                .filter(item => item.id === ot.id)[0]
                                .tarea.filter(tarea => tarea.id === tarea.id)[0]
                                .formularios.filter(
                                  form => form.id === formulario.id,
                                ),
                            ),
                          );
                          if (
                            respuestas.ot
                              .filter(item => item.id === ot.id)[0]
                              .tarea.filter(tarea => tarea.id === tarea.id)[0]
                              .formularios.filter(
                                form => form.id === formulario.id,
                              ).length > 0
                          ) {
                            console.log('ENTRO ASETAR EL ASYNC');
                            setformAsync({
                              formcomplet: [
                                {
                                  idUsuario: idusuario,
                                  ots: data.ot
                                    .map(ot1 => {
                                      if (
                                        respuestas.ot.filter(
                                          item => item.id === ot1.id,
                                        ).length > 0
                                      ) {
                                        return CargaOtForm(
                                          ot1,
                                          true,
                                          true,
                                          false,
                                          form,
                                          respuestas,
                                          ot.id,
                                        );
                                      }
                                    })
                                    .filter(item => item !== undefined),
                                },
                              ],
                            });
                          }
                        }
                      });
                    }
                  } else {
                    //si no existe la tarea y si existe la ot
                    //lo sumo al existente
                    if (
                      respuestas.ot
                        .filter(item => item.id === ot.id)[0]
                        .tarea.filter(tarea => tarea.id === tarea.id).length > 0
                    ) {
                      setformAsync({
                        formcomplet: [
                          {
                            idUsuario: idusuario,
                            ots: data.ot
                              .map(ot1 => {
                                if (
                                  respuestas.ot.filter(
                                    item => item.id === ot1.id,
                                  ).length > 0
                                ) {
                                  return CargaOtForm(
                                    ot1,
                                    true,
                                    false,
                                    false,
                                    form,
                                    respuestas,
                                    ot.id,
                                  );
                                }
                              })
                              .filter(item => item !== undefined),
                          },
                        ],
                      });
                    }
                  }
                });
              }
            } else {
              //si no existe la ot
              //lo sumo al existente
              //valido si hay respuestas en el servidor
              if (respuestas.ot.filter(item => item.id === ot.id).length > 0) {
                setformAsync({
                  formcomplet: [
                    {
                      idUsuario: idusuario,
                      ots: [
                        ...form.formcomplet.filter(
                          form => form.idUsuario === idusuario,
                        )[0].ots,

                        data.ot
                          .map(ot1 => {
                            if (
                              respuestas.ot.filter(item => item.id === ot1.id)
                                .length > 0
                            ) {
                              return CargaOtForm(
                                ot1,
                                false,
                                false,
                                false,
                                form,
                                respuestas,
                                ot.id,
                              );
                            }
                          })
                          .filter(item => item !== undefined),
                      ],
                    },
                    form.formcomplet.filter(
                      form => form.idUsuario !== idusuario,
                    ),
                  ],
                });
              }
            }
          }
        })
        .filter(item => item !== undefined);
    } else {
      //no existe elusuario lo sumo al existente
      //valido si hay respuestas en el servidor
      if (respuestas.ot.length > 0) {
        setformAsync({
          formcomplet: [
            ...form.formcomplet,
            {
              idUsuario: idusuario,
              ots: data.ot
                .map(ot => {
                  if (
                    respuestas.ot.filter(item => item.id === ot1.id).length > 0
                  ) {
                    return CargaOtForm(
                      ot,
                      false,
                      false,
                      false,
                      form,
                      respuestas,
                      ot.id,
                    );
                  }
                })
                .filter(item => item !== undefined),
            },
          ],
        });
      }
    }
  }
};
