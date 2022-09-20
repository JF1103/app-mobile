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

  const data = preguntas.map(item => {
    if (item.tipo === 'Firma' || item.tipo === 'Archivo') {
      return {
        usuario: idUsuario,
        refformulariosconector: refformularioconector,
        reftabla: '4',
        idreferencia: idotd,
        refpreguntascuestionario: item.preguntaId,
        respuesta: item.respuesta.base64,
        latitud: item.respuesta.latitud,
        longitud: item.respuesta.longitud,
        refrespuestascuestionario:
          item.tipo === 'Seleccion Multiple' || item.tipo === 'Seleccion Simple'
            ? item.respuesta
            : '',
        archivo: item.respuesta.archivo,
        tipo: item.tipo,
        carpeta: '',
      };
    } else {
      return {
        usuario: idUsuario,
        refformulariosconector: refformularioconector,
        reftabla: '4',
        idreferencia: idotd,
        refpreguntascuestionario: item.preguntaId,
        respuesta: item.respuesta,
        latitud: item.respuesta.latitud,
        longitud: item.respuesta.longitud,
        refrespuestascuestionario:
          item.tipo === 'Seleccion Multiple' || item.tipo === 'Seleccion Simple'
            ? item.respuesta
            : '',
        archivo: '',
        tipo: '',
        carpeta: '',
      };
    }
  });

  console.log(JSON.stringify(data));

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
