import axios from 'axios';
import React from 'react';
import {BASE_URL} from '../config';

export default function SendFormulrio(
  tareaid,
  idotd,
  formularioid,
  refformularioconector,
  formularioPreguntas,
  setFormularioPreguntas,
  employee,
  idUsuario,
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

  console.log(indexIdUsuario, indexIdOt, indexIdTarea, indexIdFormulario);

  console.log(JSON.stringify(preguntas));
  const data = preguntas.map(item => {
    const data =
      item.tipo === 'Firma' || item.tipo === 'Archivo'
        ? {
            usuario: idUsuario,
            refformulariosconector: refformularioconector,
            reftabla: '4',
            idreferencia: idotd,
            refpreguntascuestionario: item.id,
            respuesta: item.respuesta.base64,
            latitud: item.respuesta.latitud,
            longitud: item.respuesta.longitud,
            refrespuestascuestionario:
              item.tipo === 'Seleccion Simple' ? item.respuesta : 0,
            archivo: item.respuesta.archivo,
            tipo: item.tipo,
            carpeta: '',
            latitud: item.latitud,
            longitud: item.longitud,
          }
        : {
            usuario: idUsuario,
            refformulariosconector: refformularioconector,
            reftabla: '4',
            idreferencia: idotd,
            refpreguntascuestionario: item.id,
            respuesta: item.respuesta,
            latitud: item.respuesta.latitud,
            longitud: item.respuesta.longitud,
            refrespuestascuestionario:
              item.tipo === 'Seleccion Simple' ? item.respuesta : 0,
            archivo: '',
            tipo: '',
            carpeta: '',
            latitud: item.latitud,
            longitud: item.longitud,
          };

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
    formData.append('tipo', data.tipo);
    formData.append('carpeta', data.carpeta);

    console.log('envia-----------', JSON.stringify(formData));
    axios
      .post(`${BASE_URL}/formulariosdetalles/insertbyone.php`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        console.log('termine');
        console.log(JSON.stringify(response.data));

        const indexPregunta = formularioPreguntas.formcomplet[
          indexIdUsuario
        ].ots[indexIdOt].tareas[indexIdTarea].formularios[
          indexIdFormulario
        ].preguntas
          .map(item => item.id)
          .indexOf(item.id);

        console.log('success');

        let newFormularioPreguntas = formularioPreguntas;
        newFormularioPreguntas.formcomplet[indexIdUsuario].ots[
          indexIdOt
        ].tareas[indexIdTarea].formularios[indexIdFormulario].preguntas[
          indexPregunta
        ].respuesta.checkSend = true;
        console.log(
          'newFormularioPreguntas',
          JSON.stringify(newFormularioPreguntas),
        );
        setFormularioPreguntas({...newFormularioPreguntas});
      })
      .catch(error => {
        console.log('error', error);
      });
  });

  /*  console.log(JSON.stringify(data));

  for (let i = 1; i < data.length - 1; i++) {
    const element = data[i];
    const formData = new FormData();
    formData.append('usuario', element.usuario);
    formData.append('refformulariosconector', element.refformulariosconector);
    formData.append('reftabla', element.reftabla);
    formData.append('idreferencia', element.idreferencia);
    formData.append(
      'refpreguntascuestionario',
      element.refpreguntascuestionario,
    );
    formData.append('refrespuestascuestionario', 0);
    formData.append('respuesta', 'cb');
    formData.append('latitud', -34.598726);
    formData.append('longitud', -58.4101175);
    formData.append('archivo', '');
    formData.append('tipo', '');
    formData.append('carpeta', '');

    console.log('envia-----------', JSON.stringify(formData));
    axios
      .post(`${BASE_URL}/formulariosdetalles/insertbyone.php`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  } */

  /*  const formData = new FormData();
  formData.append('usuario', 11);
  formData.append('refformulariosconector', 5);
  formData.append('reftabla', 4);
  formData.append('idreferencia', 7);
  formData.append('refpreguntascuestionario', 8);
  formData.append('refrespuestascuestionario', 0);
  formData.append('respuesta', 'cb');
  formData.append('latitud', -34.598726);
  formData.append('longitud', -58.4101175);
  console.log('envia-----------', JSON.stringify(formData));
  axios
    .post(`${BASE_URL}/formulariosdetalles/insertbyone.php`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => {
      console.log(response.request);
      console.log(response.data);
    })
    .catch(error => {
      console.log(error);
    }); */

  /*  data.foreach(item => {
       fetch(`${BASE_URL}/formulariosdetalles/insertbyone.php`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
      })
      .catch(error => {
        console.error(error);
      }); 
    console.log(item); 
  }); */

  /* const formData = new FormData();
  formData.append('data', JSON.stringify(data));

  fetch(`${BASE_URL}/formularios/respuestas.php`, {
    method: 'POST',
    body: formData,
  })
    .then(response => response.json())
    .then(responseJson => {
      console.log(responseJson);
    })
    .catch(error => {
      console.error(error);
    }); */
}
