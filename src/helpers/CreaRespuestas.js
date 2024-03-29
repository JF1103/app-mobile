import React from 'react';
import {DivideRespMult} from './DivideRespMult';

export const CreaRespuestas = pregunta => {
  /*   console.log('entre en respuestasssssss', pregunta); */
  switch (pregunta.tiporespuesta) {
    case 'Archivo':
      return {
        id: pregunta.id,
        respuesta: {
          base64: pregunta.respuestaCargada,
          tempUri: pregunta.respuestaCargada,
          fileType: 'image/jpeg',
        },
        tipo: pregunta.tiporespuesta,
        latitud: 0.0,
        longitud: 0.0,
        checkSend: true,
      };
      break;
    case 'Texto':
      return {
        id: pregunta.id,
        respuesta: pregunta.respuestaCargada,
        tipo: pregunta.tiporespuesta,
        latitud: 0.0,
        longitud: 0.0,
        checkSend: true,
      };
      break;
    case 'Seleccion Simple':
      const idResCargada = pregunta.respuestas.filter(
        item => item.leyenda === pregunta.respuestaCargada,
      )[0];
      console.log('idResCargada', idResCargada);
      return {
        id: pregunta.id,
        respuesta: {
          id: idResCargada.id,
          value: idResCargada.respuesta,
        },
        tipo: pregunta.tiporespuesta,
        latitud: 0.0,
        longitud: 0.0,
        checkSend: true,
      };
      break;
    case 'Seleccion Multiple':
      let arrayResp = DivideRespMult(pregunta.respuestaCargada);
      return {
        id: pregunta.id,
        respuesta: arrayResp.map(item => {
          return {
            id: item.id,
            value: pregunta.respuestas.filter(resp => resp.id == item.id)[0]
              ?.respuesta,
            isChecked: true,
          };
        }),
        tipo: pregunta.tiporespuesta,
        latitud: 0.0,
        longitud: 0.0,
        checkSend: true,
      };
      break;
    case 'Firma':
      return {
        id: pregunta.id,
        respuesta: {
          base64: pregunta.respuestaCargada,
          tempUri: pregunta.respuestaCargada,
          fileType: 'image/jpeg',
        },
        tipo: pregunta.tiporespuesta,
        latitud: 0.0,
        longitud: 0.0,
        checkSend: true,
      };
    case 'Geolocalizacion':
      return {
        id: pregunta.id,
        respuesta: pregunta.respuestaCargada,
        tipo: pregunta.tiporespuesta,
        latitud: 0.0,
        longitud: 0.0,
        checkSend: true,
      };
    case 'Materiales':
      return {
        id: pregunta.id,
        respuesta: pregunta.respuestaCargada.map(item => {
          return {
            id: item.id,
            value: pregunta.respuestaCargada.filter(
              resp => resp.id == item.id,
            )[0]?.respuesta,
          };
        }),
        tipo: pregunta.tiporespuesta,
        latitud: 0.0,
        longitud: 0.0,
        checkSend: true,
      };
    case 'Datos':
      return {
        id: pregunta.id,
        respuesta: pregunta.respuestaCargada,
        tipo: pregunta.tiporespuesta,
        latitud: 0.0,
        longitud: 0.0,
        checkSend: true,
      };
    default:
      break;
  }
};
