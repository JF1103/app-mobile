import axios from 'axios';
import React from 'react';
import {ToastAndroid} from 'react-native';
import {BASE_URL} from '../config';
import getFileBase64 from '../helpers/getFileBase64';

export default function SendFormulrio(
  tareaid,
  idotd,
  formularioid,
  refformularioconector,
  formularioPreguntas,
  setFormularioPreguntas,
  employee,
  idUsuario,
  setSending,
) {
  /* 
    usuario:11
refformulariosconector:3
reftabla:4
idreferencia:2
refpreguntascuestionario:3
respuesta:test
latitud:3.4
longitud:3.5
refrespuestascuestionario:0
archivo:
tipo: 
carpeta

*/
  console.log('entre a enviar formualrio');

  let firstFlag = true;
  /* console.log('e formulario es ', JSON.stringify(formularioPreguntas)); */
  const preguntas = formularioPreguntas.formcomplet
    .filter(item => item.idUsuario === idUsuario)[0]
    .ots.filter(item => item.id_ot === employee.id)[0]
    .tareas.filter(item => item.TareaId === tareaid)[0]
    .formularios.filter(
      item => item.FormularioId === formularioid,
    )[0].preguntas;

  const indexIdUsuario = formularioPreguntas.formcomplet
    .map(item => item.idUsuario)
    .indexOf(idUsuario);

  const indexIdOt = formularioPreguntas.formcomplet[indexIdUsuario].ots
    .map(item => item.id_ot)
    .indexOf(employee.id);

  const indexIdTarea = formularioPreguntas.formcomplet[indexIdUsuario].ots[
    indexIdOt
  ].tareas
    .map(item => item.TareaId)
    .indexOf(tareaid);

  const indexIdFormulario = formularioPreguntas.formcomplet[indexIdUsuario].ots[
    indexIdOt
  ].tareas[indexIdTarea].formularios
    .map(item => item.FormularioId)
    .indexOf(formularioid);

  const data = preguntas.map(async (item, index) => {
    console.log('entrooooo numero ', index, item.id);

    let data = {};
    let arrayMaterial = [];
    if (item.tipo === 'Firma' || item.tipo === 'Archivo') {
      const archivo = await getFileBase64(item.respuesta.base64);

      data = {
        usuario: idUsuario,
        refformulariosconector: refformularioconector,
        reftabla: '4',
        idreferencia: idotd,
        refpreguntascuestionario: item.id,
        respuesta: item.respuesta.base64,
        refrespuestascuestionario: 0,
        archivo: archivo,
        tipo: item.respuesta.fileType,
        carpeta: '',
        latitud: item.latitud,
        longitud: item.longitud,
      };
    } else {
      /* console.log('arrayMaterial', JSON.stringify(arrayMaterial)); */
      data = {
        usuario: idUsuario,
        refformulariosconector: refformularioconector,
        reftabla: '4',
        idreferencia: idotd,
        refpreguntascuestionario: item.id,
        respuesta:
          item.tipo === 'Seleccion Simple'
            ? item.respuesta.value
            : item.tipo === 'Seleccion Multiple'
            ? item.respuesta.map(item => item.id).join('/**/')
            : item.tipo === 'Geolocalizacion'
            ? item.respuesta.latitude + ',' + item.respuesta.longitude
            : item.tipo === 'Materiales'
            ? item.respuesta.map(respuesta => {
                return [respuesta.id, respuesta.value];
              })
            : item.respuesta,

        latitud: item.respuesta.latitud,
        longitud: item.respuesta.longitud,
        refrespuestascuestionario:
          item.tipo === 'Seleccion Simple' ? item.respuesta.id : 0,
        latitud: item.latitud,
        longitud: item.longitud,
      };
    }

    const formData = new FormData();
    formData.append('usuario', data.usuario);
    formData.append('refformulariosconector', data.refformulariosconector);
    formData.append('reftabla', data.reftabla);
    formData.append('idreferencia', data.idreferencia);
    formData.append('refpreguntascuestionario', data.refpreguntascuestionario);
    formData.append(
      'refrespuestascuestionario',
      data.refrespuestascuestionario,
    );
    formData.append('respuesta', data.respuesta);
    formData.append('latitud', data.latitud);
    formData.append('longitud', data.longitud);
    formData.append('archivo', data.archivo);
    if (item.tipo === 'Firma' || item.tipo === 'Archivo') {
      formData.append('tipo', data.tipo);
      formData.append('carpeta', data.carpeta);
    }

    /* console.log('envia-----------', JSON.stringify(formData)); */

    axios
      .post(`${BASE_URL}/formulariosdetalles/insertbyone.php`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        /* console.log(JSON.stringify(response.data)); */
        console.log('success', response.data);
        /*  console.log('success', JSON.stringify(formData)); */
        const indexPregunta = formularioPreguntas.formcomplet[
          indexIdUsuario
        ].ots[indexIdOt].tareas[indexIdTarea].formularios[
          indexIdFormulario
        ].preguntas
          .map(item => item.id)
          .indexOf(item.id);

        let newFormularioPreguntas = formularioPreguntas;
        newFormularioPreguntas.formcomplet[indexIdUsuario].ots[
          indexIdOt
        ].tareas[indexIdTarea].formularios[indexIdFormulario].preguntas[
          indexPregunta
        ].checkSend = true;
        // console.log(
        //  'newFormularioPreguntas',
        //  JSON.stringify(newFormularioPreguntas),
        // );
        setFormularioPreguntas({...newFormularioPreguntas});
      })
      .catch(error => {
        console.log('error', error);
        console.log('error', JSON.stringify(error));
        console.log('error', JSON.stringify(error.response));
        console.log('error', JSON.stringify(error.response.data));

        const indexPregunta = formularioPreguntas.formcomplet[
          indexIdUsuario
        ].ots[indexIdOt].tareas[indexIdTarea].formularios[
          indexIdFormulario
        ].preguntas
          .map(item => item.id)
          .indexOf(item.id);

        let newFormularioPreguntas = formularioPreguntas;
        newFormularioPreguntas.formcomplet[indexIdUsuario].ots[
          indexIdOt
        ].tareas[indexIdTarea].formularios[indexIdFormulario].preguntas[
          indexPregunta
        ].checkSend = false;

        newFormularioPreguntas.formcomplet[indexIdUsuario].ots[
          indexIdOt
        ].tareas[indexIdTarea].ErrorSend = true;

        setFormularioPreguntas({...newFormularioPreguntas});
      })
      .finally(() => {
        const indexPregunta = formularioPreguntas.formcomplet[
          indexIdUsuario
        ].ots[indexIdOt].tareas[indexIdTarea].formularios[
          indexIdFormulario
        ].preguntas
          .map(item => item.id)
          .indexOf(item.id);
        console.log('finally');
        //valido si el formulario se envio completo para mostrar el toast de enviado
        let formularioCompleto =
          formularioPreguntas.formcomplet[indexIdUsuario].ots[indexIdOt].tareas[
            indexIdTarea
          ].formularios[indexIdFormulario].preguntas[indexPregunta].checkSend;

        if (firstFlag) {
          if (formularioCompleto) {
            ToastAndroid.show('Formulario enviado', ToastAndroid.SHORT);
            firstFlag = false;
          } else {
            ToastAndroid.show(
              'Formulario  no fue enviado, porfavor intente mas tarde',
              ToastAndroid.SHORT,
            );
            firstFlag = false;
          }
        }
      });
  });
}
