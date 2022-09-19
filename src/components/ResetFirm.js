import {deleteFiles} from './DeleteFiles';
import {SetStorage} from './SetStorage';
import RNFS from 'react-native-fs';

export const resetSign = (
  path,
  saveBtn,
  firmPath,
  setFirmPath,
  formularioPreguntas,
  setFormularioPreguntas,
  tareaId,
  formularioId,
  preguntaid,
  preguntatiporespuesta,
) => {
  console.log('resetSign', JSON.stringify(formularioPreguntas));
  if (firmPath) {
    /*    let path =
        RNFS.DocumentDirectoryPath + `/firma_${tareaId}_${preguntaid}.png`;
      console.log('pathborrar', path); */
    console.log('PATHBORRAR', path);
    deleteFiles(path);
    setFirmPath(null);
    //actualizar formularioPreguntas
    const indexTarea = formularioPreguntas.tareas.findIndex(
      tarea => tarea.TareaId === tareaId,
    );

    if (indexTarea !== -1) {
      const indexFormulario = formularioPreguntas.tareas[
        indexTarea
      ].formularios.findIndex(
        formulario => formulario.FormularioId === formularioId,
      );
      if (indexFormulario !== -1) {
        const indexPregunta = formularioPreguntas.tareas[
          indexTarea
        ].formularios[indexFormulario].preguntas.findIndex(
          pregunta => pregunta.id === preguntaid,
        );
        if (indexPregunta !== -1) {
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
                      {
                        id: preguntaid,
                        respuesta: '',
                        tipo: preguntatiporespuesta,
                      },
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
  } else {
    saveBtn.current.resetImage();
    //eliminr firma

    /* setFirmPath(''); */

    deleteFiles(path);

    //actualizar formularioPreguntas
    const indexTarea = formularioPreguntas.tareas.findIndex(
      tarea => tarea.TareaId === tareaId,
    );

    if (indexTarea !== -1) {
      const indexFormulario = formularioPreguntas.tareas[
        indexTarea
      ].formularios.findIndex(
        formulario => formulario.FormularioId === formularioId,
      );
      if (indexFormulario !== -1) {
        const indexPregunta = formularioPreguntas.tareas[
          indexTarea
        ].formularios[indexFormulario].preguntas.findIndex(
          pregunta => pregunta.id === preguntaid,
        );
        if (indexPregunta !== -1) {
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
                      {
                        ...formularioPreguntas.tareas[indexTarea].formularios[
                          indexFormulario
                        ].preguntas.filter(
                          pregunta => pregunta.id !== preguntaid,
                        ),
                      },
                    ],
                  },
                ],
              },
            ],
          });
        }
      }
    }
    SetStorage(formularioPreguntas);
  }
};
